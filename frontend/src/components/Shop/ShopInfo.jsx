import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
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

  const averageRating = totalRatings / totalReviewsLength || 0;

  return (
    <>
      {isLoading ? (
        <Loader fullScreen={true} />
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 h-24"></div>

          {/* Avatar */}
          <div className="relative px-4 pb-4">
            <div className="flex justify-center -mt-12">
              <img
                src={`${data.avatar?.url}`}
                alt={data.name}
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
              />
            </div>

            {/* Shop Name & Description */}
            <div className="text-center mt-3">
              <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
              <p className="text-sm text-gray-600 mt-2 px-2 leading-relaxed">
                {data.description || "Welcome to our shop!"}
              </p>
            </div>

            {/* Rating Card */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 mt-4">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-lg font-bold text-orange-600">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600">/ 5.0</span>
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 mt-4">
              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Address
                    </p>
                    <p className="text-sm text-gray-900 mt-1">{data.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      {data.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Products
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {products && products.length}
                  </span>
                </div>
              </div>

              <div className="pb-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Joined
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {data?.createdAt?.slice(0, 10)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isOwner && (
              <div className="space-y-2 mt-4">
                <Link to="/settings">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                    Edit Shop
                  </button>
                </Link>
                <button
                  onClick={logoutHandler}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ShopInfo;
