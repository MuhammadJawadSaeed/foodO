import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState("all");

  const sections = [
    { id: "all", label: "All Sections", icon: "M4 6h16M4 12h16M4 18h16" },
    {
      id: "user",
      label: "User Terms",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      id: "chef",
      label: "Chef Terms",
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
      id: "payment",
      label: "Payments",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
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
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            Legal Information
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Terms & Conditions
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using foodO
          </p>
          <p className="text-sm mt-4 text-gray-500">
            Last Updated: November 22, 2025
          </p>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-2 flex flex-wrap gap-2 justify-center">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
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
                  d={section.icon}
                />
              </svg>
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 space-y-8">
          {/* Introduction */}
          {(activeSection === "all" || activeSection === "user") && (
            <section className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to foodO! By accessing or using our platform, you agree
                to be bound by these Terms and Conditions. If you do not agree
                with any part of these terms, please do not use our services.
              </p>
            </section>
          )}

          {/* User Accounts */}
          {(activeSection === "all" || activeSection === "user") && (
            <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    2. User Accounts
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong className="text-blue-600">Registration:</strong>{" "}
                      You must provide accurate information during registration.
                    </p>
                    <p>
                      <strong className="text-blue-600">Security:</strong> You
                      are responsible for maintaining account confidentiality.
                    </p>
                    <p>
                      <strong className="text-blue-600">Age:</strong> You must
                      be at least 18 years old to create an account.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Chef Terms */}
          {(activeSection === "all" || activeSection === "chef") && (
            <section className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    3. Home Chef Terms
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong className="text-orange-600">
                        Quality Standards:
                      </strong>{" "}
                      Chefs must maintain high food quality and hygiene
                      standards.
                    </p>
                    <p>
                      <strong className="text-orange-600">Pricing:</strong>{" "}
                      Chefs set their own prices but must ensure they are
                      reasonable.
                    </p>
                    <p>
                      <strong className="text-orange-600">Commission:</strong>{" "}
                      foodO charges a commission on each order as outlined in
                      agreements.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Orders & Payments */}
          {(activeSection === "all" || activeSection === "payment") && (
            <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    4. Orders & Payments
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong className="text-green-600">
                        Order Confirmation:
                      </strong>{" "}
                      Orders are confirmed when payment is processed and chef
                      accepts.
                    </p>
                    <p>
                      <strong className="text-green-600">
                        Payment Methods:
                      </strong>{" "}
                      We accept cards, cash on delivery, and digital payments.
                    </p>
                    <p>
                      <strong className="text-green-600">Refunds:</strong>{" "}
                      Handled case-by-case according to our refund policy.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Important Notice
                </h3>
                <p className="text-gray-700 text-sm">
                  These terms may be updated. Continued use of foodO after
                  changes constitutes acceptance of modified terms. For
                  questions, contact{" "}
                  <a
                    href="mailto:legal@foodo.pk"
                    className="text-blue-600 hover:underline"
                  >
                    legal@foodo.pk
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;
