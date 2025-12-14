import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/actions/user";
import { DataGrid } from "@material-ui/data-grid";
import {
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineMail,
  AiOutlineSearch,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { Button } from "@material-ui/core";
import { RxCross1 } from "react-icons/rx";
import { BiBlock, BiCheckCircle } from "react-icons/bi";
import { MdVerified } from "react-icons/md";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AdvancedAllUsers = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    role: "User",
  });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllUsers());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to delete user");
      });
  };

  const handleSuspend = async (id) => {
    await axios
      .put(`${server}/user/suspend-user/${id}`, {}, { withCredentials: true })
      .then((res) => {
        toast.success("User suspended successfully");
        dispatch(getAllUsers());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to suspend user");
      });
  };

  const handleUnsuspend = async (id) => {
    await axios
      .put(`${server}/user/unsuspend-user/${id}`, {}, { withCredentials: true })
      .then((res) => {
        toast.success("User activated successfully");
        dispatch(getAllUsers());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to activate user");
      });
  };

  const handleSendEmail = async (id) => {
    await axios
      .post(
        `${server}/user/send-email/${id}`,
        { subject: "Platform Update", message: "..." },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Email sent successfully");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to send email");
      });
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedUsers.length} users?`)) {
      const promises = selectedUsers.map((id) =>
        axios.delete(`${server}/user/delete-user/${id}`, {
          withCredentials: true,
        })
      );
      await Promise.all(promises)
        .then(() => {
          toast.success(`${selectedUsers.length} users deleted`);
          setSelectedUsers([]);
          dispatch(getAllUsers());
        })
        .catch(() => {
          toast.error("Some deletions failed");
        });
    }
  };

  const viewUserDetails = async (id) => {
    await axios
      .get(`${server}/user/user-info/${id}`, { withCredentials: true })
      .then((res) => {
        setUserDetails(res.data.user);
        setShowDetails(true);
      })
      .catch((error) => {
        toast.error("Failed to load user details");
      });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.phoneNumber
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    await axios
      .post(`${server}/user/create-user`, newUser, { withCredentials: true })
      .then((res) => {
        toast.success("User created successfully");
        setShowAddUser(false);
        setNewUser({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          city: "",
          role: "User",
        });
        dispatch(getAllUsers());
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to create user");
      });
  };

  // Filter users
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.suspended) ||
      (filterStatus === "suspended" && user.suspended);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      field: "select",
      headerName: "",
      minWidth: 50,
      flex: 0.3,
      renderCell: (params) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(params.row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedUsers([...selectedUsers, params.row.id]);
            } else {
              setSelectedUsers(
                selectedUsers.filter((id) => id !== params.row.id)
              );
            }
          }}
          className="w-4 h-4"
        />
      ),
    },
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.avatar || "/default-avatar.png"}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{params.row.name}</span>
          {params.row.verified && <MdVerified className="text-blue-500" />}
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      type: "text",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            params.row.role === "Admin"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.row.role || "User"}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            params.row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.row.status}
        </span>
      ),
    },
    {
      field: "joinedAt",
      headerName: "Joined",
      type: "text",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "orders",
      headerName: "Orders",
      type: "number",
      minWidth: 80,
      flex: 0.4,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      flex: 0.8,
      type: "text",
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => viewUserDetails(params.id)}
            variant="outlined"
            size="small"
            startIcon={<AiOutlineEye />}
          >
            View
          </Button>
          <Button
            onClick={() => {
              setOpen(true);
              setUserId(params.id);
            }}
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<AiOutlineDelete />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const rows =
    filteredUsers?.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.suspended ? "Suspended" : "Active",
      joinedAt: new Date(user.createdAt).toLocaleDateString(),
      orders: user.orders?.length || 0,
      avatar: user.avatar?.url,
      verified: user.verified,
    })) || [];

  return (
    <div className="w-full p-4">
      {/* Header with Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              User Management
            </h2>
            <p className="text-gray-600 text-sm">
              Total Users: {users?.length || 0} | Showing:{" "}
              {filteredUsers?.length || 0}
            </p>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <AiOutlineUserAdd size={20} />
            <span>Add User</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <AiOutlineSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Roles</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
            <span className="text-gray-700">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              >
                <AiOutlineDelete />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
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

      {/* Delete Confirmation Modal */}
      {open && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="w-full flex justify-end cursor-pointer mb-2">
              <RxCross1
                size={24}
                onClick={() => setOpen(false)}
                className="hover:text-red-500"
              />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl text-center py-3 sm:py-5 font-Poppins text-gray-800">
              Are you sure you want to delete this user?
            </h3>
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4">
              <button
                className="w-full sm:w-36 bg-gray-700 hover:bg-gray-800 flex items-center justify-center rounded-lg cursor-pointer text-white text-base font-medium h-11 transition-colors"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="w-full sm:w-36 bg-red-600 hover:bg-red-700 flex items-center justify-center rounded-lg cursor-pointer text-white text-base font-medium h-11 transition-colors"
                onClick={() => {
                  setOpen(false);
                  handleDelete(userId);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetails && userDetails && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen overflow-y-auto p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="w-full flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">User Details</h3>
              <RxCross1
                size={25}
                onClick={() => setShowDetails(false)}
                className="cursor-pointer hover:text-red-500"
              />
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <img
                src={userDetails.avatar?.url || "/default-avatar.png"}
                alt={userDetails.name || "User"}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-2xl font-semibold text-gray-800">
                    {userDetails.name || "N/A"}
                  </h4>
                  {userDetails.verified && (
                    <MdVerified className="text-blue-500" size={24} />
                  )}
                </div>
                <p className="text-gray-600 text-lg mb-1">
                  {userDetails.email || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Member since{" "}
                  {userDetails.createdAt
                    ? new Date(userDetails.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 font-medium mb-1">Role</p>
                <p className="text-xl font-bold text-purple-900">
                  {userDetails.role || "User"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  Phone Number
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {userDetails.phoneNumber || "Not provided"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium mb-1">
                  Total Orders
                </p>
                <p className="text-xl font-bold text-green-900">
                  {userDetails.orders?.length || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700 font-medium mb-1">
                  Account Status
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    userDetails.suspended
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {userDetails.suspended ? "Suspended" : "Active"}
                </span>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <h5 className="text-lg font-bold text-gray-800 mb-3">
                Additional Information
              </h5>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">User ID:</span>
                  <span className="text-gray-800 font-mono text-sm">
                    {userDetails._id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">
                    Email Verified:
                  </span>
                  <span
                    className={`font-semibold ${
                      userDetails.verified ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {userDetails.verified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">
                    Account Created:
                  </span>
                  <span className="text-gray-800">
                    {userDetails.createdAt
                      ? new Date(userDetails.createdAt).toLocaleString("en-US")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Addresses Section */}
            <div className="mb-6">
              <h5 className="text-lg font-bold text-gray-800 mb-3">
                Saved Addresses
              </h5>
              {userDetails.addresses?.length > 0 ? (
                <div className="space-y-3">
                  {userDetails.addresses.map((addr, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-gray-800">
                          {addr.addressType || "Address"}
                        </p>
                        {addr.default && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-1">
                        {addr.address1 || ""}
                        {addr.address2 ? `, ${addr.address2}` : ""}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {addr.city || ""}, {addr.zipCode || ""},{" "}
                        {addr.country || ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">No addresses saved yet</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleSendEmail(userDetails._id)}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 font-semibold transition-colors"
              >
                <AiOutlineMail size={20} />
                Send Email
              </button>
              {userDetails.suspended ? (
                <button
                  onClick={() => {
                    handleUnsuspend(userDetails._id);
                    setShowDetails(false);
                  }}
                  className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 font-semibold transition-colors"
                >
                  <BiCheckCircle size={20} />
                  Activate User
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleSuspend(userDetails._id);
                    setShowDetails(false);
                  }}
                  className="flex-1 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2 font-semibold transition-colors"
                >
                  <BiBlock size={20} />
                  Suspend User
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RxCross1 size={24} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newUser.phoneNumber}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phoneNumber: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="+92XXXXXXXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={newUser.city}
                    onChange={(e) =>
                      setNewUser({ ...newUser, city: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAllUsers;
