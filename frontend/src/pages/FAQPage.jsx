import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    {
      id: "all",
      name: "All Questions",
      icon: "M4 6h16M4 12h16M4 18h16",
      color: "from-gray-400 to-gray-600",
    },
    {
      id: "general",
      name: "General",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "from-blue-400 to-cyan-500",
    },
    {
      id: "orders",
      name: "Orders",
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      color: "from-orange-400 to-red-500",
    },
    {
      id: "payments",
      name: "Payments",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      color: "from-green-400 to-emerald-500",
    },
    {
      id: "delivery",
      name: "Delivery",
      icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
      color: "from-purple-400 to-pink-500",
    },
    {
      id: "account",
      name: "Account",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      color: "from-indigo-400 to-blue-500",
    },
  ];

  const faqs = [
    {
      category: "general",
      question: "What is FoodO?",
      answer:
        "FoodO is a comprehensive food delivery platform connecting customers with local restaurants and home chefs. We offer fresh, delicious meals delivered right to your doorstep with exceptional service.",
    },
    {
      category: "general",
      question: "How does FoodO work?",
      answer:
        "Simply browse our restaurant and chef partners, add items to your cart, checkout, and track your order in real-time. Our delivery partners ensure your food arrives fresh and on time.",
    },
    {
      category: "general",
      question: "Is FoodO available in my area?",
      answer:
        "We're currently operating in major cities across Pakistan. Enter your location on our app or website to check availability in your area.",
    },
    {
      category: "orders",
      question: "How do I place an order?",
      answer:
        "Browse restaurants, select items, add to cart, proceed to checkout, enter delivery details, and confirm your order. You'll receive instant confirmation and tracking updates.",
    },
    {
      category: "orders",
      question: "Can I modify my order after placing it?",
      answer:
        "Yes, you can modify or cancel orders within 2 minutes of placement. After that, please contact our support team for assistance.",
    },
    {
      category: "orders",
      question: "How can I track my order?",
      answer:
        "Track your order in real-time through our app or website. You'll see when the restaurant confirms, when it's being prepared, and live tracking when out for delivery.",
    },
    {
      category: "orders",
      question: "What if my order is incorrect?",
      answer:
        "Contact our support immediately if you receive an incorrect order. We'll arrange a replacement or provide a full refund based on your preference.",
    },
    {
      category: "payments",
      question: "What payment methods do you accept?",
      answer:
        "We accept cash on delivery, credit/debit cards, mobile wallets (JazzCash, EasyPaisa), and bank transfers for a seamless checkout experience.",
    },
    {
      category: "payments",
      question: "Is my payment information secure?",
      answer:
        "Absolutely! We use industry-standard encryption and secure payment gateways. Your financial information is never stored on our servers.",
    },
    {
      category: "payments",
      question: "Can I get a refund?",
      answer:
        "Yes, refunds are processed for cancelled orders, missing items, or quality issues. Refunds typically take 5-7 business days to reflect in your account.",
    },
    {
      category: "payments",
      question: "Do you offer any discounts or promo codes?",
      answer:
        "Yes! Check our app regularly for exclusive deals, first-order discounts, and seasonal promotions. Subscribe to our newsletter for special offers.",
    },
    {
      category: "delivery",
      question: "What are the delivery charges?",
      answer:
        "Delivery fees vary by distance and restaurant. Most orders have a minimal delivery charge, and we often offer free delivery on orders above a certain amount.",
    },
    {
      category: "delivery",
      question: "How long does delivery take?",
      answer:
        "Typical delivery time is 30-45 minutes. Exact timing depends on restaurant preparation time, distance, and traffic conditions. You'll see an estimated time before checkout.",
    },
    {
      category: "delivery",
      question: "Can I schedule a delivery for later?",
      answer:
        "Yes! You can schedule orders up to 24 hours in advance. Select your preferred delivery time during checkout.",
    },
    {
      category: "delivery",
      question: "What if my delivery is late?",
      answer:
        "We strive for on-time delivery. If your order is significantly delayed, contact support for real-time updates. We may offer compensation for excessive delays.",
    },
    {
      category: "account",
      question: "How do I create an account?",
      answer:
        "Download our app or visit our website, click 'Sign Up', enter your phone number and email, verify with OTP, and complete your profile. It takes less than a minute!",
    },
    {
      category: "account",
      question: "Can I save my favorite restaurants?",
      answer:
        "Yes! Add restaurants and dishes to your favorites for quick access. We'll also send you notifications about special offers from your favorites.",
    },
    {
      category: "account",
      question: "How do I update my delivery address?",
      answer:
        "Go to your profile, select 'Addresses', and add/edit/delete addresses. You can save multiple addresses for home, work, and other locations.",
    },
    {
      category: "account",
      question: "I forgot my password. What should I do?",
      answer:
        "Click 'Forgot Password' on the login screen, enter your registered phone number or email, and follow the OTP verification process to reset your password.",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeHeading={0} />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-pink-50 pt-[140px] pb-24 md:pb-32">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-2.5 bg-orange-100 rounded-full text-sm font-semibold text-orange-700 border border-orange-200 shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            Frequently Asked Questions
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            How Can We Help You?
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
            Find instant answers to common questions about FoodO's services,
            orders, and more
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                placeholder="Type your question here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-5 pl-14 text-gray-900 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-200 border-2 border-orange-100 placeholder-gray-400 text-base transition-all"
              />
              <svg
                className="w-6 h-6 text-orange-500 absolute left-5 top-1/2 transform -translate-y-1/2 group-focus-within:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="relative z-[5] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-200 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300"
                }`}
              >
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
                    d={cat.icon}
                  />
                </svg>
                <span className="whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => {
              const categoryData = categories.find(
                (c) => c.id === faq.category
              );
              return (
                <div
                  key={index}
                  className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all duration-300 ${
                    openIndex === index
                      ? "border-orange-300 shadow-lg"
                      : "border-gray-100 hover:border-orange-200 hover:shadow-lg"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-orange-50/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={categoryData?.icon}
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                        openIndex === index
                          ? "bg-orange-500 shadow-lg"
                          : "bg-gray-100"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transform transition-all duration-300 ${
                          openIndex === index
                            ? "rotate-180 text-white"
                            : "text-gray-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-5 pt-2">
                      <div className="ml-14 pl-4 border-l-3 border-orange-300 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-6">
              <svg
                className="w-12 h-12 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              Try adjusting your search or category filter
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Still Need Help */}
      <div className="relative z-[5] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-orange-50 to-pink-50 rounded-3xl shadow-lg p-10 md:p-12 text-center border-2 border-orange-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-200 rounded-2xl mb-6 shadow-md">
              <svg
                className="w-10 h-10 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Still Need Help?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Can't find what you're looking for? Our dedicated support team is
              ready to assist you 24/7!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Support
              </a>
              <a
                href="tel:+923000000000"
                className="inline-flex items-center justify-center gap-2.5 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-orange-50 transition-all duration-300 border-2 border-orange-300 hover:border-orange-400 shadow-sm hover:shadow-md transform hover:scale-105"
              >
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQPage;
