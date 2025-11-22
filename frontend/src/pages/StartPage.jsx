import React, { useEffect, useState } from "react";
import { assets } from "../Assests/assets";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";
import Header2 from "../components/Layout/Header2";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

// Optimized Image Component with lazy loading
const OptimizedImage = ({ src, alt, className, priority = false }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const StartPage = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const { isSeller } = useSelector((state) => state.seller);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Preload critical images for hero section
    const preloadImages = [assets.food_2];
    preloadImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });

    // Simulate initial loading
    setTimeout(() => setLoading(false), 800);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  const handleCityClick = (city) => {
    setSelectedCity(city);
    navigate("/home", { state: { selectedCity: city } });
  };

  if (loading) {
    return <Loader fullScreen={true} useAnimation={true} />;
  }

  return (
    <div className="bg-white">
      <Header2 activeHeading={1} />

      <div className="relative w-full bg-gradient-to-br from-orange-200 via-white to-gray-200 pt-[70px] md:pt-[70px] pb-8 md:pb-12">
        {/* Decorative circles */}
        <div className="absolute top-20 md:top-24 right-10 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl"></div>

        <div className="relative z-0 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Left Content */}
            <div className="text-gray-800">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-4">
                Delicious Home-Cooked Food
                <span className="block mt-2 text-orange-600">
                  Delivered to Your Door
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 max-w-xl">
                Experience authentic homemade flavors from passionate local
                chefs in your city
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/home"
                  className="inline-flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600 font-medium px-5 py-2.5 rounded-lg shadow-md transition-all duration-300"
                >
                  <span>Order Now</span>
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
                <Link
                  to="/shop-create"
                  className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-gray-50 border-2 border-orange-500 font-medium px-5 py-2.5 rounded-lg shadow-md transition-all duration-300"
                >
                  <span>Become a Chef</span>
                </Link>
              </div>
            </div>

            {/* Right Image - Hidden on mobile */}
            <div className="hidden md:block">
              <OptimizedImage
                src={assets.food_2}
                alt="Delicious Food"
                className="w-full h-auto rounded-xl shadow-lg"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Why Choose <span className="text-orange-500">foodO</span>?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Experience the best homemade food delivery with our unique
              features
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-orange-500"
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
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Fast Delivery
              </h3>
              <p className="text-sm text-gray-600">
                Fresh meals delivered quickly to your doorstep
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-orange-500"
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
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Quality Food
              </h3>
              <p className="text-sm text-gray-600">
                Authentic homemade meals from verified chefs
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Best Prices
              </h3>
              <p className="text-sm text-gray-600">
                Affordable homemade food without compromising quality
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Local Chefs
              </h3>
              <p className="text-sm text-gray-600">
                Supporting passionate home chefs in your community
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Section */}
      <div className="bg-gradient-to-br from-gray-50 to-orange-50 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="order-2 md:order-1">
              <OptimizedImage
                src={assets.food_3}
                alt="Join as Chef"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>

            {/* Right Content */}
            <div className="order-1 md:order-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                You Cook,{" "}
                <span className="text-orange-500">We Handle the Rest</span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mb-6">
                Join thousands of home chefs who are earning while doing what
                they love
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Easy Registration
                    </h3>
                    <p className="text-sm text-gray-600">
                      Simple signup process to start selling your homemade food
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Manage Your Menu
                    </h3>
                    <p className="text-sm text-gray-600">
                      Full control over your dishes, pricing, and availability
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Earn More Income
                    </h3>
                    <p className="text-sm text-gray-600">
                      Flexible hours and competitive commission rates
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to={`${isSeller ? "/dashboard" : "/shop-create"}`}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
              >
                <span>Start Cooking with Us</span>
                <svg
                  className="w-5 h-5"
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
          </div>
        </div>
      </div>

      {/* Cities Section */}
      <div className="bg-white py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Available in <span className="text-orange-500">16+ Cities</span>{" "}
              Across Pakistan
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Find delicious homemade food in your city
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              "Lahore",
              "Karachi",
              "Islamabad",
              "Rawalpindi",
              "Faisalabad",
              "Multan",
              "Peshawar",
              "Quetta",
              "Gujranwala",
              "Sialkot",
              "Bahawalpur",
              "Sargodha",
              "Abbottabad",
              "Hyderabad",
              "Mirpur",
              "Muzaffarabad",
            ].map((city) => (
              <div
                key={city}
                className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => handleCityClick(city)}
              >
                <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden bg-gray-200">
                  <OptimizedImage
                    src={assets[city]}
                    alt={city}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg md:text-xl mb-1">
                      {city}
                    </h3>
                    <p className="text-orange-200 text-xs sm:text-sm">
                      Order Now →
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business/Corporate Section */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
                <span className="text-orange-100">foodO</span> for Business
              </h2>
              <p className="text-orange-50 text-base sm:text-lg mb-6">
                Corporate catering made easy with authentic homemade meals
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-orange-200 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-orange-50">
                    Perfect for office lunches and team meetings
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-orange-200 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-orange-50">
                    Bulk orders with special corporate pricing
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-orange-200 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-orange-50">
                    Dedicated support for corporate clients
                  </span>
                </li>
              </ul>

              <button className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                <span>Get Started</span>
                <svg
                  className="w-5 h-5"
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
              </button>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  1000+
                </div>
                <div className="text-orange-100 text-sm">Home Chefs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  50K+
                </div>
                <div className="text-orange-100 text-sm">Happy Customers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  100K+
                </div>
                <div className="text-orange-100 text-sm">Orders Delivered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  16+
                </div>
                <div className="text-orange-100 text-sm">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Frequently Asked{" "}
              <span className="text-orange-500">Questions</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Everything you need to know about foodO
            </p>
          </div>

          <div className="space-y-4">
            <details className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <summary className="flex justify-between items-center cursor-pointer p-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                  How can I get foodO delivery?
                </h3>
                <svg
                  className="w-5 h-5 text-orange-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Simply enter your address, browse menus from local home chefs,
                  select your favorite dishes, and checkout. Your fresh homemade
                  meal will be delivered to your doorstep!
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <summary className="flex justify-between items-center cursor-pointer p-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                  Which home kitchens are open now near me?
                </h3>
                <svg
                  className="w-5 h-5 text-orange-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Type your address in the search bar and you'll see all
                  available kitchens ready to deliver to your area right now.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <summary className="flex justify-between items-center cursor-pointer p-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                  Does foodO deliver 24 hours?
                </h3>
                <svg
                  className="w-5 h-5 text-orange-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Yes! foodO operates 24/7. However, individual home chefs set
                  their own hours, so availability may vary by location and
                  time.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <summary className="flex justify-between items-center cursor-pointer p-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                  What payment methods do you accept?
                </h3>
                <svg
                  className="w-5 h-5 text-orange-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  We accept cash on delivery, credit/debit cards, and various
                  digital payment options for your convenience.
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <summary className="flex justify-between items-center cursor-pointer p-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                  Can I order for someone else?
                </h3>
                <svg
                  className="w-5 h-5 text-orange-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Absolutely! Just update the recipient's name and delivery
                  address during checkout. Perfect for sending a meal to loved
                  ones!
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <summary className="flex justify-between items-center cursor-pointer p-6">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                  How much does delivery cost?
                </h3>
                <svg
                  className="w-5 h-5 text-orange-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  Delivery fees vary based on your location and the kitchen.
                  You'll see the exact fee when placing your order. Many
                  kitchens offer free delivery!
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Export the function to get the selected city
export const getSelectedCity = () => getSelectedCity;

export default StartPage;
