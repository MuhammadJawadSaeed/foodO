import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye, AiOutlineEdit } from "react-icons/ai";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { deleteProduct } from "../../redux/actions/product";
import Loader from "../Layout/Loader";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const [productStatuses, setProductStatuses] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  useEffect(() => {
    // Initialize product statuses from products data
    if (products) {
      const statuses = {};
      products.forEach((product) => {
        statuses[product._id] = product.isAvailable !== false; // default to true if not set
      });
      setProductStatuses(statuses);
    }
  }, [products]);

  const handleToggleAvailability = async (id) => {
    try {
      const { data } = await axios.put(
        `${server}/product/toggle-product-availability/${id}`,
        {},
        { withCredentials: true }
      );

      // Update local state
      setProductStatuses((prev) => ({
        ...prev,
        [id]: data.isAvailable,
      }));

      toast.success(data.message);
      // Refresh products list
      dispatch(getAllProductsShop(seller._id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update availability"
      );
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );

    if (confirmDelete) {
      dispatch(deleteProduct(id))
        .then(() => {
          toast.success("Product deleted successfully!");
          // Refresh the products list
          dispatch(getAllProductsShop(seller._id));
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message ||
              "Failed to delete product. Please try again."
          );
        });
    }
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "availability",
      headerName: "Status",
      minWidth: 120,
      flex: 0.7,
      renderCell: (params) => {
        const isAvailable = productStatuses[params.id];
        return (
          <div className="flex items-center gap-1">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        );
      },
    },
    {
      field: "Toggle",
      headerName: "Availability",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => {
        const isAvailable = productStatuses[params.id];
        return (
          <Button
            onClick={() => handleToggleAvailability(params.id)}
            title={isAvailable ? "Mark as unavailable" : "Mark as available"}
          >
            {isAvailable ? (
              <MdToggleOn size={28} color="#22c55e" />
            ) : (
              <MdToggleOff size={28} color="#ef4444" />
            )}
          </Button>
        );
      },
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Edit",
      flex: 0.8,
      minWidth: 100,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/dashboard-edit-product/${params.id}`}>
              <Button>
                <AiOutlineEdit size={20} />
              </Button>
            </Link>
          </>
        );
      },
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

  products &&
    products.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "PKR " + item.discountPrice,
        sold: item?.sold_out,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader fullScreen={true} />
      ) : (
        <div className="w-full p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-orange-50 min-h-screen">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <h3 className="text-white font-bold text-lg">All Products</h3>
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
        </div>
      )}
    </>
  );
};

export default AllProducts;
