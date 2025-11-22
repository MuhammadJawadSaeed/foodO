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
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
              Offline
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
              data.shop?.isOnline === false ? "opacity-60" : ""
            }`}
          />
        </Link>

        <div className="p-2">
          <Link to={`/shop/preview/${data?.shop._id}`}>
            <div className="flex justify-between items-center border-b pb-1">
              <h5 className="text-xs text-gray-600">{data.shop.name}</h5>
              <Ratings rating={data?.ratings} />
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
                ({data?.sold_out} sold)
              </span>
            </div>
          </Link>
        </div>

        {/* Side Options */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {click ? (
            <button
              className="bg-white p-1 rounded-full shadow-md hover:shadow-lg"
              onClick={() => removeFromWishlistHandler(data)}
            >
              <AiFillHeart
                size={22}
                color="#FF6600"
                title="Remove from wishlist"
              />
            </button>
          ) : (
            <button
              className="bg-white p-1 rounded-full shadow-md hover:shadow-lg"
              onClick={() => addToWishlistHandler(data)}
            >
              <AiOutlineHeart
                size={22}
                color="#FF6600"
                title="Add to wishlist"
              />
            </button>
          )}

          <button
            className="bg-white p-1 rounded-full shadow-md hover:shadow-lg"
            onClick={() => setOpen(!open)}
          >
            <AiOutlineEye size={22} color="#FF6600" title="Quick view" />
          </button>

          <button
            className={`bg-white p-1 rounded-full shadow-md hover:shadow-lg ${
              data.shop?.isOnline === false
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              data.shop?.isOnline !== false && addToCartHandler(data._id)
            }
            disabled={data.shop?.isOnline === false}
          >
            <AiOutlineShoppingCart
              size={25}
              color="#FF6600"
              title={
                data.shop?.isOnline === false
                  ? "Restaurant offline"
                  : "Add to cart"
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
