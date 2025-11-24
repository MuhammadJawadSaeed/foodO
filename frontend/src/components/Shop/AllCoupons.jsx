import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineGift } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [value, setValue] = useState(null);
  const [searchProduct, setSearchProduct] = useState("");
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupouns(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch]);

  const handleDelete = async (id) => {
    axios
      .delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success("Coupon code deleted succesfully!");
      });
    window.location.reload();
  };

  const toggleProductSelection = (productName) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productName)) {
        return prev.filter((p) => p !== productName);
      } else {
        return [...prev, productName];
      }
    });
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.name));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!name || name.trim() === "") {
      toast.error("Please enter a coupon code name!");
      return;
    }

    if (!value || value <= 0 || value > 100) {
      toast.error("Please enter a valid discount percentage (1-100)!");
      return;
    }

    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name: name.trim().toUpperCase(),
          minAmount,
          maxAmount,
          selectedProducts,
          value: Number(value),
          shopId: seller._id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Coupon code created successfully!");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to create coupon code"
        );
      });
  };

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Value",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  coupouns &&
    coupouns.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
        sold: 10,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader fullScreen={true} />
      ) : (
        <div className="w-full p-6 bg-gradient-to-br from-gray-50 to-orange-50 min-h-screen">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Discount Codes</h3>
              <button
                onClick={() => setOpen(true)}
                className="bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 text-sm"
              >
                <AiOutlineGift size={18} />
                Create Coupon
              </button>
            </div>
            <div className="p-6">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                autoHeight
                className="border-0"
              />
            </div>
          </div>
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-[20000] flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-white font-bold text-xl">
                    Create Coupon Code
                  </h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                  >
                    <RxCross1 size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Coupon Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter coupon code name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discount Percentage{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={value}
                      required
                      min="1"
                      max="100"
                      step="1"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter discount percentage (1-100)..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a value between 1 and 100
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Min Amount (Optional)
                      </label>
                      <input
                        type="number"
                        name="minAmount"
                        value={minAmount}
                        min="0"
                        step="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        onChange={(e) => setMinAmout(e.target.value)}
                        placeholder="Minimum order amount..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum purchase required
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Discount (Optional)
                      </label>
                      <input
                        type="number"
                        name="maxAmount"
                        value={maxAmount}
                        min="0"
                        step="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Maximum discount amount..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Cap on discount value
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Selected Products (Optional)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Leave empty to apply coupon on all products, or select
                      specific products
                    </p>

                    {/* Search Box */}
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm mb-2"
                    />

                    {/* Select All Button */}
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        onClick={selectAllProducts}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        {selectedProducts.length === products?.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                      <span className="text-xs text-gray-500">
                        {selectedProducts.length} selected
                      </span>
                    </div>

                    {/* Products List with Checkboxes */}
                    <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                      {products && products.length > 0 ? (
                        products
                          .filter((product) =>
                            product.name
                              .toLowerCase()
                              .includes(searchProduct.toLowerCase())
                          )
                          .map((product) => (
                            <label
                              key={product._id}
                              className="flex items-center px-4 py-2.5 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(
                                  product.name
                                )}
                                onChange={() =>
                                  toggleProductSelection(product.name)
                                }
                                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mr-3"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-700">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Rs.{" "}
                                  {product.discountPrice ||
                                    product.originalPrice}
                                </div>
                              </div>
                            </label>
                          ))
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                          No products available
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
                  >
                    Create Coupon Code
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
