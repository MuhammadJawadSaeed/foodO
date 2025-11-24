import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye, AiOutlineSearch } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { Button } from "@material-ui/core";
import { getAllProducts } from "../../redux/actions/product";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

const AdvancedAllProducts = () => {
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/product/delete-product/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Product deleted successfully!");
        dispatch(getAllProducts());
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      });
  };

  // Get unique categories
  const categories = [...new Set(products?.map((p) => p.category))].filter(
    Boolean
  );

  // Filter products
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shop?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.image}
            alt=""
            className="w-10 h-10 rounded object-cover"
          />
          <span>{params.row.name}</span>
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-semibold text-green-600">{params.value}</span>
      ),
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 100,
      flex: 0.4,
      renderCell: (params) => (
        <span className="font-semibold text-yellow-600 flex items-center gap-1">
          {params.value} <FaStar className="text-yellow-500" />
        </span>
      ),
    },
    {
      field: "sold",
      headerName: "Sold",
      type: "number",
      minWidth: 100,
      flex: 0.4,
    },
    {
      field: "shop",
      headerName: "Shop",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 0.7,
      type: "text",
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Link to={`/product/${params.id}`}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AiOutlineEye />}
            >
              View
            </Button>
          </Link>
          <Button
            onClick={() => {
              setOpen(true);
              setProductId(params.id);
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
    filteredProducts?.map((item) => ({
      id: item._id,
      name: item.name,
      category: item.category,
      price: "PKR " + item.discountPrice,
      rating: item.ratings?.toFixed(1) || "0.0",
      sold: item.sold_out || 0,
      shop: item.shop?.name || "N/A",
      image: item.images?.[0]?.url || "/default-product.png",
    })) || [];

  // Calculate statistics
  const totalProducts = products?.length || 0;
  const activeProducts = products?.filter((p) => p).length || 0;
  const totalCategories =
    [...new Set(products?.map((p) => p.category))].filter(Boolean).length || 0;
  const totalSold =
    products?.reduce((acc, p) => acc + (p.sold_out || 0), 0) || 0;
  const avgRating = (
    products?.reduce((acc, p) => acc + (p.ratings || 0), 0) /
    (products?.length || 1)
  ).toFixed(1);

  return (
    <div className="w-full p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
          <p className="text-xs text-gray-500">All food items</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Categories</p>
          <p className="text-2xl font-bold text-purple-600">
            {totalCategories}
          </p>
          <p className="text-xs text-gray-500">Food categories</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Total Sold</p>
          <p className="text-2xl font-bold text-blue-600">{totalSold}</p>
          <p className="text-xs text-gray-500">All time sales</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 text-sm">Avg Rating</p>
          <p className="text-2xl font-bold text-yellow-600 flex items-center gap-2">
            {avgRating} <FaStar className="text-yellow-500" />
          </p>
          <p className="text-xs text-gray-500">Customer ratings</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Product Management
            </h2>
            <p className="text-gray-600 text-sm">
              Total: {totalProducts} | Showing: {filteredProducts?.length || 0}
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
            placeholder="Search by product name or shop..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="w-full bg-white rounded-lg shadow-md">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {open && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
              Are you sure you want to delete this product?
            </h3>
            <div className="w-full flex items-center justify-center">
              <div
                className="w-[150px] bg-[#000000cb] my-3 flex items-center justify-center rounded-xl cursor-pointer text-white text-[18px] h-[45px]"
                onClick={() => setOpen(false)}
              >
                Cancel
              </div>
              <div
                className="w-[150px] bg-[#d63f3f] my-3 ml-4 flex items-center justify-center rounded-xl cursor-pointer text-white text-[18px] h-[45px]"
                onClick={() => {
                  setOpen(false);
                  handleDelete(productId);
                }}
              >
                Confirm
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAllProducts;
