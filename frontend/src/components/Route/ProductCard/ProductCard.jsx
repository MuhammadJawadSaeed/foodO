import React, { useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

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

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      const cartData = { ...data, qty: 1 };
      dispatch(addTocart(cartData));
      toast.success("Item added to cart successfully!");
    }
  };

  return (
    <>
      <div className="w-[250px] bg-white border mx-auto rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 relative">
        {/* Shop Status Badge */}
        {data.shop?.isOnline === false && (
          <div className="absolute top-2 left-2 z-[5]">
            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
              Offline
            </span>
          </div>
        )}

        {/* Product Availability Badge */}
        {data.shop?.isOnline !== false && data.isAvailable === false && (
          <div className="absolute top-2 left-2 z-[5]">
            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
              Unavailable
            </span>
          </div>
        )}

        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
        >
          <img
            src={data.images && data.images[0]?.url}
            alt={data.name}
            className={`w-full h-[180px] object-cover ${
              data.shop?.isOnline === false || data.isAvailable === false
                ? "opacity-60"
                : ""
            }`}
          />
        </Link>

        <div className="p-2">
          <Link to={`/shop/preview/${data?.shop._id}`}>
            <div className="flex justify-between items-center border-b pb-1">
              <h5 className="text-xs text-gray-600">{data.shop.name}</h5>
              <div className="flex items-center gap-1">
                <span className="text-orange-500 text-sm font-bold">
                  {data?.ratings?.toFixed(1) || "0.0"}
                </span>
                <AiFillStar size={14} className="text-orange-500" />
              </div>
            </div>
          </Link>

          <Link
            to={`${
              isEvent === true
                ? `/product/${data._id}?isEvent=true`
                : `/product/${data._id}`
            }`}
          >
            <h4 className="text-sm font-semibold truncate mt-1">{data.name}</h4>

            <div className="flex justify-between items-center mt-1">
              <div className="flex">
                <h5 className="text-red-600 font-bold">
                  {data.originalPrice === 0
                    ? data.originalPrice
                    : data.discountPrice}
                  PKR
                </h5>
                {data.originalPrice && (
                  <h4 className="text-gray-400 text-xs line-through ml-1">
                    {data.originalPrice}PKR
                  </h4>
                )}
              </div>
              <span className="text-green-600 text-xs">
                ({data?.sold_out} Orders Delivered)
              </span>
            </div>
          </Link>
        </div>

        {/* Action Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-[5]">
          {/* Wishlist Button */}
          {click ? (
            <button
              className="group bg-gradient-to-br from-orange-500 to-pink-500 p-2.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFromWishlistHandler(data);
              }}
              title="Remove from wishlist"
            >
              <AiFillHeart size={18} className="text-white" />
            </button>
          ) : (
            <button
              className="group bg-white p-2.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-gray-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToWishlistHandler(data);
              }}
              title="Add to wishlist"
            >
              <AiOutlineHeart
                size={18}
                className="text-orange-500 group-hover:text-pink-500 transition-colors"
              />
            </button>
          )}

          {/* Quick View Button */}
          <button
            className="group bg-white p-2.5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border border-gray-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
            }}
            title="Quick view"
          >
            <AiOutlineEye
              size={18}
              className="text-orange-500 group-hover:text-orange-600 transition-colors"
            />
          </button>

          {/* Add to Cart Button */}
          <button
            className={`group p-2.5 rounded-full shadow-lg transition-all duration-300 border ${
              data.shop?.isOnline === false || data.isAvailable === false
                ? "bg-gray-300 border-gray-400 opacity-60 cursor-not-allowed"
                : "bg-white border-gray-100 hover:shadow-xl transform hover:scale-110"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (data.shop?.isOnline !== false && data.isAvailable !== false) {
                addToCartHandler(data._id);
              }
            }}
            disabled={
              data.shop?.isOnline === false || data.isAvailable === false
            }
            title={
              data.shop?.isOnline === false
                ? "Restaurant offline"
                : data.isAvailable === false
                ? "Product unavailable"
                : "Add to cart"
            }
          >
            <AiOutlineShoppingCart
              size={18}
              className={
                data.shop?.isOnline === false || data.isAvailable === false
                  ? "text-gray-500"
                  : "text-orange-500 group-hover:text-orange-600 transition-colors"
              }
            />
          </button>
        </div>

        {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
      </div>
    </>
  );
};

export default ProductCard;
