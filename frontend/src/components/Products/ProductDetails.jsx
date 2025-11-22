import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      const cartData = { ...data, qty: count };
      dispatch(addTocart(cartData));
      toast.success("Item added to cart successfully!");
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {data ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-xs text-gray-500">
              <li>
                <Link to="/" className="hover:text-orange-500">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/products" className="hover:text-orange-500">
                  Products
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium truncate">
                {data.name}
              </li>
            </ol>
          </nav>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-6 p-4 lg:p-6">
              {/* Left Column - Images */}
              <div className="space-y-3">
                {/* Main Image */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video max-h-80">
                  <img
                    src={`${data && data.images[select]?.url}`}
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {data.images && data.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {data.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelect(index)}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          select === index
                            ? "border-orange-500 ring-2 ring-orange-200"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                      >
                        <img
                          src={`${img?.url}`}
                          alt={`${data.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Shop Info Card */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-3 border border-orange-100">
                  <div className="flex items-center gap-3">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <img
                        src={`${data?.shop?.avatar?.url}`}
                        alt={data.shop.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/shop/preview/${data?.shop._id}`}>
                        <h3 className="font-bold text-gray-900 hover:text-orange-500 text-sm truncate">
                          {data.shop.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(averageRating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          ({averageRating})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleMessageSubmit}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md transition-colors"
                      title="Send Message"
                    >
                      <AiOutlineMessage size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-4">
                {/* Restaurant Offline Warning */}
                {data.shop?.isOnline === false && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-red-800">
                          Restaurant Currently Offline
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          This restaurant is not accepting orders at the moment.
                          Please check back later.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {data.name}
                  </h1>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {data.description}
                  </p>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg p-3 border border-orange-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-orange-600">
                      {data.discountPrice} PKR
                    </span>
                    {data.originalPrice && (
                      <>
                        <span className="text-base text-gray-500 line-through">
                          {data.originalPrice} PKR
                        </span>
                        <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                          {Math.round(
                            ((data.originalPrice - data.discountPrice) /
                              data.originalPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={decrementCount}
                        className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={count <= 1 || data.shop?.isOnline === false}
                      >
                        -
                      </button>
                      <span className="w-12 h-9 flex items-center justify-center text-sm font-semibold">
                        {count}
                      </span>
                      <button
                        onClick={incrementCount}
                        className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={data.shop?.isOnline === false}
                      >
                        +
                      </button>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() =>
                        click
                          ? removeFromWishlistHandler(data)
                          : addToWishlistHandler(data)
                      }
                      className="p-2 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors group"
                      title={click ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {click ? (
                        <AiFillHeart size={20} className="text-orange-500" />
                      ) : (
                        <AiOutlineHeart
                          size={20}
                          className="text-gray-600 group-hover:text-orange-500"
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() =>
                      data.shop?.isOnline !== false &&
                      addToCartHandler(data._id)
                    }
                    disabled={data.shop?.isOnline === false}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
                      data.shop?.isOnline === false
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    <AiOutlineShoppingCart size={18} />
                    {data.shop?.isOnline === false
                      ? "Restaurant Offline"
                      : "Add to Cart"}
                  </button>

                  <Link
                    to={`/shop/preview/${data?.shop._id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors"
                  >
                    Visit Shop
                  </Link>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs">Quality Checked</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs">Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span className="text-xs">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-xs">100% Fresh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActive(1)}
            className={`flex-1 py-3 px-4 text-center text-sm font-semibold transition-colors relative ${
              active === 1
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Food Details
            </span>
          </button>
          <button
            onClick={() => setActive(2)}
            className={`flex-1 py-3 px-4 text-center text-sm font-semibold transition-colors relative ${
              active === 2
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Reviews ({data.reviews.length})
            </span>
          </button>
          <button
            onClick={() => setActive(3)}
            className={`flex-1 py-3 px-4 text-center text-sm font-semibold transition-colors relative ${
              active === 3
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Seller Info
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4 lg:p-6">
        {active === 1 && (
          <div className="prose max-w-none">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              About this item
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Product Information
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium text-gray-900">
                      {data.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sold:</span>
                    <span className="font-medium text-gray-900">
                      {data.sold_out || 0} times
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Why Choose This?
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Freshly prepared homemade food</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Quality checked by verified chefs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Hygienic packaging & fast delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {active === 2 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Customer Reviews
            </h3>

            {data.reviews && data.reviews.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {data.reviews.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
                  >
                    <img
                      src={`${item.user.avatar?.url}`}
                      alt={item.user.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {item.user.name}
                        </h4>
                        <Ratings rating={item.rating} />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.comment}
                      </p>
                      {item.createdAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-gray-300 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <h4 className="text-base font-medium text-gray-900 mb-1">
                  No Reviews Yet
                </h4>
                <p className="text-sm text-gray-600">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        )}

        {active === 3 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <Link to={`/shop/preview/${data.shop._id}`}>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={`${data?.shop?.avatar?.url}`}
                    alt={data.shop.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-200"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-orange-500">
                      {data.shop.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(averageRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600">({averageRating})</span>
                    </div>
                  </div>
                </div>
              </Link>

              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {data.shop.description ||
                  "A passionate home chef bringing authentic flavors to your table."}
              </p>

              <Link
                to={`/shop/preview/${data.shop._id}`}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Visit Shop
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="text-base font-bold text-gray-900 mb-3">
                Shop Statistics
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Joined On</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {data.shop?.createdAt?.slice(0, 10)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Products</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {products && products.length}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Reviews</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {totalReviewsLength}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="text-sm font-semibold text-orange-500">
                    {averageRating} / 5.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
