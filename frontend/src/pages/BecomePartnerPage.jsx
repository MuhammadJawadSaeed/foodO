import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { Link } from "react-router-dom";

const BecomePartnerPage = () => {
  const benefits = [
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Earn Extra Income",
      desc: "Turn your passion into profit with flexible working hours",
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      title: "Reach More Customers",
      desc: "Access thousands of food lovers in your area",
    },
    {
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      title: "Easy Management",
      desc: "Simple dashboard to manage orders and menu",
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Quick Payments",
      desc: "Get paid weekly directly to your bank account",
    },
    {
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
      title: "Free Marketing",
      desc: "We promote your dishes to our growing user base",
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Quality Support",
      desc: "Dedicated support team to help you succeed",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Sign Up",
      desc: "Create your chef profile in minutes",
    },
    {
      number: "2",
      title: "Get Verified",
      desc: "Quick verification process for safety",
    },
    {
      number: "3",
      title: "Add Menu",
      desc: "Upload your delicious homemade dishes",
    },
    {
      number: "4",
      title: "Start Earning",
      desc: "Receive orders and start making money",
    },
  ];

  const requirements = [
    "Valid CNIC and contact number",
    "Clean and hygienic kitchen",
    "Passion for cooking authentic food",
    "Ability to fulfill orders on time",
    "Food safety awareness",
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
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
            Become a Partner
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Start Your Food Business Today
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join 1000+ home chefs earning with foodO
          </p>
          <Link
            to="/shop-create"
            className="inline-block bg-white text-orange-600 font-bold px-8 py-4 rounded-xl hover:bg-orange-50 transition shadow-2xl"
          >
            Register Now
          </Link>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Partner With Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4">
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
                    d={benefit.icon}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 border-2 border-white/30">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Basic Requirements
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ul className="space-y-4">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-700">
                <svg
                  className="w-6 h-6 text-orange-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-lg">{req}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link
              to="/shop-create"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg transition"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BecomePartnerPage;
