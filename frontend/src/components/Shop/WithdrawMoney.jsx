import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };

    setPaymentMethod(false);

    await axios
      .put(
        `${server}/shop/update-payment-methods`,
        {
          withdrawMethod,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw method added successfully!");
        dispatch(loadSeller());
        setBankInfo({
          bankName: "",
          bankCountry: "",
          bankSwiftCode: null,
          bankAccountNumber: null,
          bankHolderName: "",
          bankAddress: "",
        });
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const deleteHandler = async () => {
    await axios
      .delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Withdraw method deleted successfully!");
        dispatch(loadSeller());
      });
  };

  const error = () => {
    toast.error("You not have enough balance to withdraw!");
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
      toast.error("You can't withdraw this amount!");
    } else {
      const amount = withdrawAmount;
      await axios
        .post(
          `${server}/withdraw/create-withdraw-request`,
          { amount },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("Withdraw money request is successful!");
        });
    }
  };

  const availableBalance = seller?.availableBalance.toFixed(2);

  return (
    <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-orange-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <h3 className="text-white font-bold text-lg">Withdraw Money</h3>
        </div>
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">Available Balance</p>
            <p className="text-4xl font-bold text-orange-600">
              PKR {availableBalance}
            </p>
          </div>
          <button
            onClick={() => (availableBalance < 50 ? error() : setOpen(true))}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md"
          >
            Withdraw Money
          </button>
        </div>
      </div>
      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-xl">
                {paymentMethod ? "Add Withdraw Method" : "Withdraw Money"}
              </h2>
              <button
                onClick={() => {
                  setOpen(false);
                  setPaymentMethod(false);
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <RxCross1 size={24} />
              </button>
            </div>

            <div className="p-6">
              {paymentMethod ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      placeholder="Enter your bank name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank country"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Swift Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      placeholder="Enter your bank swift code"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Account Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter your bank account number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      placeholder="Enter bank holder name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      placeholder="Enter your bank address"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
                  >
                    Add Withdraw Method
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Available Withdraw Methods
                  </h3>

                  {seller && seller?.withdrawMethod ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-500">
                                Account Number
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {"*".repeat(
                                  seller?.withdrawMethod.bankAccountNumber
                                    .length - 3
                                ) +
                                  seller?.withdrawMethod.bankAccountNumber.slice(
                                    -3
                                  )}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Bank Name</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {seller?.withdrawMethod.bankName}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteHandler()}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <AiOutlineDelete size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Available Balance
                        </p>
                        <p className="text-2xl font-bold text-orange-600 mb-4">
                          {availableBalance} PKR
                        </p>

                        <div className="flex gap-3 items-end">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Amount to Withdraw
                            </label>
                            <input
                              type="number"
                              placeholder="Enter amount..."
                              value={withdrawAmount}
                              onChange={(e) =>
                                setWithdrawAmount(e.target.value)
                              }
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <button
                            onClick={withdrawHandler}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
                          >
                            Withdraw
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        No withdraw methods available
                      </p>
                      <button
                        onClick={() => setPaymentMethod(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                      >
                        Add Withdraw Method
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
