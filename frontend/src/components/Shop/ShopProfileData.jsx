import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
  }, [dispatch]);

  const [active, setActive] = useState(1);

  const allReviews =
    products && products.map((product) => product.reviews).flat();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tabs Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between px-4 sm:px-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActive(1)}
              className={`flex items-center gap-2 py-4 px-4 sm:px-6 text-sm font-semibold border-b-2 transition-colors ${
                active === 1
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span className="hidden sm:inline">Shop Products</span>
              <span className="sm:hidden">Products</span>
            </button>

            <button
              onClick={() => setActive(3)}
              className={`flex items-center gap-2 py-4 px-4 sm:px-6 text-sm font-semibold border-b-2 transition-colors ${
                active === 3
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
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
              <span className="hidden sm:inline">Shop Reviews</span>
              <span className="sm:hidden">Reviews</span>
            </button>
          </nav>

          {isOwner && (
            <Link to="/dashboard" className="hidden sm:block">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                Dashboard
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {active === 1 && (
          <div>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((i, index) => (
                  <ProductCard data={i} key={index} isShop={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Products Yet
                </h3>
                <p className="text-gray-600">
                  This shop hasn't added any products yet.
                </p>
              </div>
            )}
          </div>
        )}

        {active === 3 && (
          <div>
            {allReviews && allReviews.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {allReviews.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={`${item.user.avatar?.url}`}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      alt={item.user.name}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {item.user.name}
                        </h4>
                        <Ratings rating={item.rating} />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item?.comment}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600">
                  This shop hasn't received any reviews yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProfileData;
