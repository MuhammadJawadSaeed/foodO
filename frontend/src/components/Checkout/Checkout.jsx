import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import pakistanCities from "../../static/pakistanCities";
import PhoneInput from "../PhoneInput";
import { isValidPakistaniPhone } from "../../utils/phoneValidator";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("Pakistan");
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [useCustomCity, setUseCustomCity] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Initialize phone number from user if available
    if (user && user.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    }
  }, [user]);

  const paymentSubmit = () => {
    const finalCity = useCustomCity ? customCity : city;

    if (
      address1 === "" ||
      address2 === "" ||
      zipCode === null ||
      country === "" ||
      finalCity === ""
    ) {
      toast.error("Please choose your delivery address!");
    } else if (!phoneNumber || phoneNumber.trim() === "") {
      toast.error("Phone number is required!");
    } else if (!isValidPakistaniPhone(phoneNumber)) {
      toast.error("Please enter a valid Pakistani mobile number!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        city: finalCity,
        phoneNumber,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };

      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // Shipping is now handled separately (not charged at checkout)
  const shipping = 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!couponCode || couponCode.trim() === "") {
      toast.error("Please enter a coupon code!");
      return;
    }

    const name = couponCode.trim().toUpperCase();

    await axios
      .get(`${server}/coupon/get-coupon-value/${name}`)
      .then((res) => {
        const shopId = res.data.couponCode?.shopId;
        const couponCodeValue = res.data.couponCode?.value;
        const minAmount = res.data.couponCode?.minAmount;
        const maxAmount = res.data.couponCode?.maxAmount;
        const selectedProducts = res.data.couponCode?.selectedProducts || [];

        if (res.data.couponCode !== null) {
          const isCouponValid =
            cart && cart.filter((item) => item.shopId === shopId);

          if (isCouponValid.length === 0) {
            toast.error("Coupon code is not valid for items in your cart");
            setCouponCode("");
          } else {
            // Filter eligible items: if selectedProducts is empty, apply to all items
            // Otherwise, only apply to items that match selectedProducts
            const eligibleItems =
              selectedProducts.length > 0
                ? isCouponValid.filter((item) =>
                    selectedProducts.includes(item.name)
                  )
                : isCouponValid;

            if (eligibleItems.length === 0) {
              toast.error("No eligible products in your cart for this coupon");
              setCouponCode("");
              return;
            }

            const eligiblePrice = eligibleItems.reduce(
              (acc, item) => acc + item.qty * item.discountPrice,
              0
            );

            // Check minimum amount requirement
            if (minAmount && eligiblePrice < minAmount) {
              toast.error(
                `Minimum purchase of PKR ${minAmount} required for this coupon`
              );
              setCouponCode("");
              return;
            }

            let discountPrice = (eligiblePrice * couponCodeValue) / 100;

            // Apply maximum discount cap if specified
            if (maxAmount && discountPrice > maxAmount) {
              discountPrice = maxAmount;
            }

            setDiscountPrice(discountPrice);
            setCouponCodeData(res.data.couponCode);
            setCouponCode("");

            const productsText =
              selectedProducts.length > 0
                ? ` on selected products (${eligibleItems.length} item${
                    eligibleItems.length > 1 ? "s" : ""
                  })`
                : "";
            toast.success(
              `Coupon applied${productsText}! You saved PKR ${discountPrice.toFixed(
                2
              )}`
            );
          }
        } else {
          toast.error("Coupon code doesn't exist!");
          setCouponCode("");
        }
      })
      .catch((error) => {
        toast.error("Failed to apply coupon code");
        setCouponCode("");
      });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  const removeCoupon = () => {
    setCouponCodeData(null);
    setDiscountPrice(null);
    toast.info("Coupon removed");
  };

  console.log(discountPercentenge);

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            customCity={customCity}
            setCustomCity={setCustomCity}
            useCustomCity={useCustomCity}
            setUseCustomCity={setUseCustomCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        </div>
        <div className="lg:col-span-1">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
            couponCodeData={couponCodeData}
            removeCoupon={removeCoupon}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={paymentSubmit}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg w-full max-w-md"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  customCity,
  setCustomCity,
  useCustomCity,
  setUseCustomCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
  phoneNumber,
  setPhoneNumber,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <h2 className="text-white font-bold text-lg">Shipping Address</h2>
      </div>

      <div className="p-6">
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={user && user.name}
                disabled
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user && user.email}
                disabled
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                required={true}
                placeholder="300 123 4567"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="number"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                placeholder="Enter zip code"
              />
            </div>
          </div>

          {/* Country - Fixed to Pakistan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value="Pakistan"
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed text-sm"
            />
          </div>

          {/* City Selection - Choose from list or type custom */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>

            {/* Toggle between dropdown and custom input */}
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cityOption"
                  checked={!useCustomCity}
                  onChange={() => setUseCustomCity(false)}
                  className="cursor-pointer text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Select from list</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cityOption"
                  checked={useCustomCity}
                  onChange={() => setUseCustomCity(true)}
                  className="cursor-pointer text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Type your city</span>
              </label>
            </div>

            {!useCustomCity ? (
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="">Choose your city</option>
                {pakistanCities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Enter your city name"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                required
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                placeholder="Street, building, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                placeholder="Apartment, suite, etc."
              />
            </div>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-2"
            onClick={() => setUserInfo(!userInfo)}
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Choose from saved addresses
          </button>

          {userInfo && (
            <div className="mt-3 space-y-2">
              {user &&
                user.addresses.map((item, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 cursor-pointer text-orange-500 focus:ring-orange-500"
                      onChange={() => {
                        setAddress1(item.address1);
                        setAddress2(item.address2);
                        setZipCode(item.zipCode);
                        setCountry(item.country);
                        setCity(item.city);
                      }}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-900 block">
                        {item.addressType}
                      </span>
                      <span className="text-xs text-gray-600">
                        {item.address1}, {item.address2}, {item.city},{" "}
                        {item.country} - {item.zipCode}
                      </span>
                    </div>
                  </label>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
  couponCodeData,
  removeCoupon,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <h2 className="text-white font-bold text-lg">Order Summary</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Subtotal</span>
          <span className="text-base font-semibold text-gray-900">
            PKR {subTotalPrice}
          </span>
        </div>

        {discountPercentenge > 0 && (
          <div className="bg-green-50 -mx-6 px-6 py-3 border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-green-700 font-semibold">
                  Coupon "{couponCodeData?.name}" Applied
                </span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-red-600 hover:text-red-700 text-xs font-semibold"
              >
                Remove
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-600">Discount</span>
              <span className="text-base font-bold text-green-600">
                - PKR {discountPercentenge.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-orange-600">
              PKR {totalPrice}
            </span>
          </div>
        </div>

        {!couponCodeData && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Have a coupon code?
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm uppercase"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm shadow-md flex items-center justify-center gap-2"
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Apply Coupon
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
