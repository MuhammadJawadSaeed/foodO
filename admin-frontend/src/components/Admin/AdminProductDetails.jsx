import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import AdminHeader from "../Layout/AdminHeader";
import AdminSideBar from "../Layout/AdminSideBar";
import {
  AiOutlineArrowLeft,
  AiOutlineDollar,
  AiOutlineShoppingCart,
  AiOutlineStar,
  AiOutlineTag,
} from "react-icons/ai";
import { BsShop } from "react-icons/bs";
import { MdCategory, MdDescription, MdInventory } from "react-icons/md";

const AdminProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${server}/product/admin-all-products`, {
        withCredentials: true,
      });
      const foundProduct = res.data.products.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error("Product not found");
        navigate("/admin-products");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch product details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${server}/product/delete-product/${id}`, {
          withCredentials: true,
        });
        toast.success("Product deleted successfully!");
        navigate("/admin-products");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    }
  };

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <AdminSideBar active={5} />
            </div>
            <div className="w-full flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <AdminHeader />
        <div className="w-full flex">
          <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <AdminSideBar active={5} />
            </div>
            <div className="w-full flex justify-center items-center h-screen">
              <p className="text-gray-600">Product not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={5} />
          </div>

          <div className="w-full min-h-screen bg-gray-50 p-4 800px:p-8">
            {/* Back Button */}
            <button
              onClick={() => navigate("/admin-products")}
              className="flex items-center gap-2 mb-6 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <AiOutlineArrowLeft size={20} />
              <span className="font-semibold">Back to Products</span>
            </button>

            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col 800px:flex-row justify-between items-start 800px:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Product Details
                  </h1>
                  <p className="text-gray-600">Product ID: {product._id}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteProduct}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                  >
                    Delete Product
                  </button>
                  {product.shop?._id && (
                    <button
                      onClick={() =>
                        navigate(
                          `/admin-restaurant-details/${product.shop._id}`
                        )
                      }
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
                    >
                      View Shop
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 800px:grid-cols-3 gap-6">
              {/* Product Images */}
              <div className="800px:col-span-2 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Product Images
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {product.images?.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Product Name</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-semibold">
                      <MdCategory />
                      {product.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tags</p>
                    <p className="text-gray-800">{product.tags || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Created At</p>
                    <p className="text-gray-800">
                      {new Date(product.createdAt).toLocaleDateString("en-US", {
                        dateStyle: "long",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MdDescription className="text-blue-600" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Description</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description || "No description available"}
              </p>
            </div>

            {/* Pricing and Stock */}
            <div className="grid grid-cols-1 800px:grid-cols-2 gap-6 mt-6">
              {/* Pricing */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <AiOutlineDollar className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Pricing Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Original Price</span>
                    <span className="text-xl font-bold text-gray-800">
                      PKR {product.originalPrice?.toFixed(2)}
                    </span>
                  </div>
                  {product.discountPrice && (
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-300">
                      <span className="text-green-700 font-semibold">
                        Discount Price
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        PKR {product.discountPrice?.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {product.originalPrice && product.discountPrice && (
                    <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                      <span className="text-orange-700 font-semibold">
                        Discount Percentage
                      </span>
                      <span className="text-xl font-bold text-orange-600">
                        {(
                          ((product.originalPrice - product.discountPrice) /
                            product.originalPrice) *
                          100
                        ).toFixed(0)}
                        % OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock and Sales */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <MdInventory className="text-indigo-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Stock & Sales
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Stock Available</span>
                    <span
                      className={`text-xl font-bold ${
                        product.stock > 10
                          ? "text-green-600"
                          : product.stock > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Sold</span>
                    <span className="text-xl font-bold text-gray-800">
                      {product.sold_out || 0} units
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Reviews</span>
                    <div className="flex items-center gap-2">
                      <AiOutlineStar className="text-yellow-500" size={20} />
                      <span className="text-xl font-bold text-gray-800">
                        {product.ratings || 0} / 5
                      </span>
                      <span className="text-sm text-gray-500">
                        ({product.reviews?.length || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Information */}
            {product.shop && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <BsShop className="text-orange-600" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Shop Information
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  {product.shop.avatar?.url && (
                    <img
                      src={product.shop.avatar.url}
                      alt={product.shop.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.shop.name}
                    </h3>
                    <p className="text-gray-600">{product.shop.email}</p>
                    {product.shop.phoneNumber && (
                      <p className="text-gray-600">
                        {product.shop.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Customer Reviews ({product.reviews.length})
                </h2>
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={
                            review.user?.avatar?.url || "/default-avatar.png"
                          }
                          alt={review.user?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {review.user?.name || "Anonymous"}
                          </p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <AiOutlineStar
                                key={i}
                                className={
                                  i < review.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }
                                size={16}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetails;
