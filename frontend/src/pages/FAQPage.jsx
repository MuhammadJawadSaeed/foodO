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
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            Frequently Asked Questions
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            How Can We Help?
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions about FoodO
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 text-gray-900 bg-white rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200 border-2 border-orange-100"
              />
              <svg
                className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 transform -translate-y-1/2"
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
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition transform hover:scale-105 ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => {
              const categoryData = categories.find(
                (c) => c.id === faq.category
              );
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:shadow-xl transition"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${categoryData?.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <svg
                          className="w-5 h-5 text-white"
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
                      <h3 className="text-lg font-bold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-6 h-6 text-gray-500 transform transition ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
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
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-20 h-20 text-gray-300 mx-auto mb-4"
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
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>

      {/* Still Need Help */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-orange-500 via-pink-600 to-rose-500 text-white rounded-2xl shadow-xl p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-90"
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
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Still Need Help?
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to
            help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition"
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
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition"
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
              Call Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQPage;
