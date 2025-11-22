import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../../server";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [click, setClick] = useState(false);
  const navigate = useNavigate();
  //   const [select, setSelect] = useState(false);

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

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
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

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  return (
    <div
      className="fixed w-full h-screen top-0 left-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      {data ? (
        <div
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 z-50 p-2 bg-gray-100 hover:bg-red-100 rounded-full transition-colors group"
            onClick={() => setOpen(false)}
          >
            <RxCross1
              size={20}
              className="text-gray-600 group-hover:text-red-500 transition-colors"
            />
          </button>

          {/* Restaurant Offline Warning */}
          {data.shop?.isOnline === false && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 m-6 mb-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-red-800">
                    Restaurant Currently Offline
                  </h3>
                  <p className="text-xs text-red-700 mt-1">
                    This restaurant is not accepting orders at the moment.
                    Please check back later.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Left Column - Image & Shop Info */}
            <div className="space-y-4">
              {/* Product Image */}
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img
                  className="w-full h-auto object-cover"
                  src={`${data.images && data.images[0]?.url}`}
                  alt={data.name}
                />
                {data.shop?.isOnline === false && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                      Offline
                    </span>
                  </div>
                )}
              </div>

              {/* Shop Info Card */}
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-100">
                <Link
                  to={`/shop/preview/${data.shop._id}`}
                  className="flex items-center gap-3 group"
                >
                  <img
                    src={`${data?.shop?.avatar?.url}`}
                    alt={data.shop.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-200 group-hover:border-orange-400 transition-colors"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {data.shop.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <AiFillStar className="text-yellow-500" size={16} />
                      {data?.ratings} Ratings
                    </p>
                  </div>
                </Link>

                <button
                  className="w-full mt-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  onClick={handleMessageSubmit}
                >
                  <AiOutlineMessage size={18} />
                  Send Message
                </button>
              </div>

              {/* Orders Delivered */}
              <div className="flex items-center gap-2 text-sm">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-600 font-semibold">
                  {data?.sold_out} Orders Delivered
                </span>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {data.name}
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {data.description}
                </p>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-600">
                    {data.discountPrice} PKR
                  </span>
                  {data.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {data.originalPrice} PKR
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity & Wishlist */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400"
                      onClick={decrementCount}
                      disabled={data.shop?.isOnline === false || count <= 1}
                    >
                      -
                    </button>
                    <span className="flex-1 text-center py-2.5 bg-white font-semibold">
                      {count}
                    </span>
                    <button
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400"
                      onClick={incrementCount}
                      disabled={data.shop?.isOnline === false}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Wishlist Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wishlist
                  </label>
                  <button
                    className={`p-3 rounded-lg border-2 transition-all ${
                      click
                        ? "bg-gradient-to-br from-orange-500 to-pink-500 border-orange-500"
                        : "bg-white border-gray-200 hover:border-orange-300"
                    }`}
                    onClick={() =>
                      click
                        ? removeFromWishlistHandler(data)
                        : addToWishlistHandler(data)
                    }
                    title={click ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {click ? (
                      <AiFillHeart size={24} className="text-white" />
                    ) : (
                      <AiOutlineHeart size={24} className="text-orange-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                className={`w-full py-3.5 px-6 rounded-lg font-bold text-white text-base transition-all flex items-center justify-center gap-2 ${
                  data.shop?.isOnline === false
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
                onClick={() =>
                  data.shop?.isOnline !== false && addToCartHandler(data._id)
                }
                disabled={data.shop?.isOnline === false}
              >
                {data.shop?.isOnline !== false ? (
                  <>
                    <AiOutlineShoppingCart size={22} />
                    Add to Cart
                  </>
                ) : (
                  "Restaurant Offline"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
