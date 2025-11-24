import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";
import { DataGrid } from "@material-ui/data-grid";
import { BsPencil } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import {
  AiOutlineSearch,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { MdPending } from "react-icons/md";

const AdvancedAllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchWithdrawRequests();
  }, []);

  const fetchWithdrawRequests = () => {
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
      });
  };

  const handleSubmit = async () => {
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Withdraw request updated successfully!");
        setData(res.data.withdraws);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to update request"
        );
      });
  };

  // Filter data
  const filteredData = data?.filter((item) => {
    const matchesSearch =
      item.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { field: "id", headerName: "Withdraw ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 180,
      flex: 0.9,
    },
    {
      field: "shopId",
      headerName: "Shop ID",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">{params.value}</span>
      ),
    },
    {
      field: "bankInfo",
      headerName: "Bank Account",
      minWidth: 180,
      flex: 0.8,
      renderCell: (params) => (
        <div className="text-sm">
          <div>{params.row.bankName}</div>
          <div className="text-gray-500 text-xs">
            {params.row.accountNumber}
          </div>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        const statusColors = {
          Processing: "bg-yellow-100 text-yellow-800",
          Succeed: "bg-green-100 text-green-800",
          Rejected: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              statusColors[params.value] || "bg-gray-100 text-gray-800"
            }`}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Request Date",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "actions",
      headerName: "Update Status",
      minWidth: 150,
      flex: 0.6,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-2">
            {params.row.status === "Processing" && (
              <button
                onClick={() => {
                  setOpen(true);
                  setWithdrawData(params.row);
                  setWithdrawStatus(params.row.status);
                }}
                className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm flex items-center gap-1"
              >
                <BsPencil size={14} />
                Update
              </button>
            )}
            {params.row.status === "Succeed" && (
              <span className="text-green-600 flex items-center gap-1">
                <AiOutlineCheckCircle />
                Completed
              </span>
            )}
            {params.row.status === "Rejected" && (
              <span className="text-red-600 flex items-center gap-1">
                <AiOutlineCloseCircle />
                Rejected
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const rows =
    filteredData?.map((item) => ({
      id: item._id,
      shopId: item.seller?._id,
      name: item.seller?.name,
      amount: "PKR " + item.amount?.toFixed(2),
      bankName: item.seller?.withdrawMethod?.bankName || "N/A",
      accountNumber: item.seller?.withdrawMethod?.bankAccountNumber || "N/A",
      status: item.status,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    })) || [];

  // Calculate statistics
  const totalRequests = data?.length || 0;
  const pendingRequests =
    data?.filter((r) => r.status === "Processing").length || 0;
  const approvedRequests =
    data?.filter((r) => r.status === "Succeed").length || 0;
  const totalAmount = data?.reduce((acc, r) => acc + (r.amount || 0), 0) || 0;
  const pendingAmount =
    data
      ?.filter((r) => r.status === "Processing")
      .reduce((acc, r) => acc + (r.amount || 0), 0) || 0;

  return (
    <div className="w-full p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800">{totalRequests}</p>
          <p className="text-xs text-gray-500">All time</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingRequests}
          </p>
          <p className="text-xs text-gray-500">Awaiting approval</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {approvedRequests}
          </p>
          <p className="text-xs text-gray-500">Successfully paid</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600">
            PKR {totalAmount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">All requests</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Pending Amount</p>
          <p className="text-2xl font-bold text-orange-600">
            PKR {pendingAmount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">To be processed</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Withdraw Requests
            </h2>
            <p className="text-gray-600 text-sm">
              Total: {totalRequests} | Showing: {filteredData?.length || 0}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <AiOutlineSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by shop name or withdraw ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Succeed">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Withdraw Table */}
      <div className="w-full bg-white rounded-lg shadow-md">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          rowsPerPageOptions={[10, 25, 50]}
        />
      </div>

      {/* Update Status Modal */}
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[95%] 800px:w-[50%] bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Update Withdraw Status
              </h1>
              <RxCross1
                size={25}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Shop Name</p>
                <p className="font-semibold">{withdrawData?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold text-green-600">
                    {withdrawData?.amount}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Current Status</p>
                  <p className="font-semibold">{withdrawData?.status}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600 mb-2">Bank Information</p>
                <p className="text-sm">
                  <strong>Bank:</strong> {withdrawData?.bankName}
                </p>
                <p className="text-sm">
                  <strong>Account:</strong> {withdrawData?.accountNumber}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Update Status
                </label>
                <select
                  value={withdrawStatus}
                  onChange={(e) => setWithdrawStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Processing">Processing</option>
                  <option value="Succeed">Approve & Complete</option>
                  <option value="Rejected">Reject</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAllWithdraw;
