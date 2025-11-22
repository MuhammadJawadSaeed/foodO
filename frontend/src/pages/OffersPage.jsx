import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const OffersPage = () => {
  const activeOffers = [
    {
      title: "First Order Special",
      discount: "50% OFF",
      code: "FIRST50",
      description: "Get 50% off on your first order. Minimum order PKR 500.",
      validTill: "Dec 31, 2025",
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "Weekend Feast",
      discount: "30% OFF",
      code: "WEEKEND30",
      description:
        "Every Saturday & Sunday, enjoy 30% off on all orders above PKR 1000.",
      validTill: "Ongoing",
      color: "from-orange-500 to-orange-700",
    },
    {
      title: "Free Delivery",
      discount: "FREE",
      code: "FREEDEL",
      description: "Free delivery on orders above PKR 1500.",
      validTill: "Limited Time",
      color: "from-orange-400 to-orange-500",
    },
    {
      title: "Student Special",
      discount: "25% OFF",
      code: "STUDENT25",
      description: "Students get 25% off with valid student ID verification.",
      validTill: "Dec 31, 2025",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Lunch Deal",
      discount: "20% OFF",
      code: "LUNCH20",
      description: "Get 20% off on orders placed between 12 PM - 3 PM.",
      validTill: "Weekdays Only",
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "Refer & Earn",
      discount: "PKR 200",
      code: "REFER",
      description: "Refer a friend and both get PKR 200 credit on next order.",
      validTill: "Ongoing",
      color: "from-orange-500 to-orange-700",
    },
  ];

  const howToUse = [
    { step: "1", text: "Browse and add items to your cart" },
    { step: "2", text: "Proceed to checkout" },
    { step: "3", text: "Enter promo code in the coupon field" },
    { step: "4", text: "Click apply and enjoy your discount!" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header activeHeading={0} />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-200 via-white to-gray-200 pt-[140px] pb-16 md:pb-24">
        <div className="absolute top-10 right-10 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-orange-50/10 rounded-full blur-2xl animate-pulse delay-700"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-orange-100/50 backdrop-blur-sm rounded-full text-sm font-medium text-orange-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            Special Offers
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Amazing Deals & Offers
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Save more on every order with our exclusive discounts
          </p>
        </div>
      </div>

      {/* Active Offers */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Active Offers
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOffers.map((offer, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className={`bg-gradient-to-r ${offer.color} p-6 text-white`}>
                <div className="text-4xl font-bold mb-2">{offer.discount}</div>
                <h3 className="text-xl font-bold">{offer.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{offer.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    Valid till: {offer.validTill}
                  </span>
                </div>
                <div className="bg-orange-50 border-2 border-orange-200 border-dashed rounded-lg p-3 flex items-center justify-between">
                  <code className="text-orange-600 font-bold text-lg">
                    {offer.code}
                  </code>
                  <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How to Use Promo Codes
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {howToUse.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 border-2 border-white/30">
                  {item.step}
                </div>
                <p className="text-white">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Terms & Conditions
        </h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Promo codes cannot be combined with other offers unless specified
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Minimum order value applies as mentioned in offer details
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              foodO reserves the right to modify or cancel offers anytime
            </span>
          </li>
          <li className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>One promo code per order</span>
          </li>
        </ul>
      </div>

      <Footer />
    </div>
  );
};

export default OffersPage;
