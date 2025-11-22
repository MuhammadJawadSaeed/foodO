import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const PrivacyPage = () => {
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
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Your Privacy Matters
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Learn how we protect and handle your personal information
          </p>
          <p className="text-sm mt-4 text-gray-500">
            Last Updated: November 22, 2025
          </p>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
              title: "Secure Data",
              color: "from-green-400 to-emerald-500",
            },
            {
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              title: "Verified Partners",
              color: "from-blue-400 to-indigo-500",
            },
            {
              icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
              title: "Transparent",
              color: "from-purple-400 to-pink-500",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Information We Collect
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                  1
                </span>
                Personal Information
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">●</span>
                  <span>Name, email, phone number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">●</span>
                  <span>Delivery addresses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">●</span>
                  <span>Payment information (securely encrypted)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">●</span>
                  <span>Order history and preferences</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center">
                  2
                </span>
                Automatic Data
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Device information & IP address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Location data (with permission)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Usage patterns and analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">●</span>
                  <span>Cookies and tracking data</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Data */}
        <div className="bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            How We Use Your Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Process and deliver orders",
              "Personalize your experience",
              "Send order updates & notifications",
              "Improve our services",
              "Prevent fraud & ensure security",
              "Comply with legal obligations",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3"
              >
                <svg
                  className="w-5 h-5 text-yellow-300 flex-shrink-0"
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
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Your Privacy Rights
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Access & Update",
                desc: "View and modify your personal information anytime",
                icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                color: "from-blue-400 to-indigo-500",
              },
              {
                title: "Delete Account",
                desc: "Request complete deletion of your data",
                icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
                color: "from-red-400 to-pink-500",
              },
              {
                title: "Control Sharing",
                desc: "Manage how your data is shared",
                icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                color: "from-green-400 to-emerald-500",
              },
            ].map((right, idx) => (
              <div
                key={idx}
                className="border-2 border-gray-100 rounded-xl p-5 hover:border-purple-300 transition"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${right.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={right.icon}
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{right.title}</h3>
                <p className="text-sm text-gray-600">{right.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Questions About Privacy?
          </h3>
          <p className="text-gray-700 mb-4">
            Contact our Data Protection Officer
          </p>
          <a
            href="mailto:privacy@foodo.pk"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition"
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
            Email Us
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
