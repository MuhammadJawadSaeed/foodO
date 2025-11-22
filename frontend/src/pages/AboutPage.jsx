import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { assets } from "../Assests/assets";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header activeHeading={0} />

      {/* Hero Section with animated background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-200 via-white to-gray-200 pt-[140px] pb-16 md:pb-24">
        {/* Animated decorative elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-300/10 rounded-full blur-2xl animate-pulse delay-700"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            Discover Our Story
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-800">
            Welcome to <span className="text-orange-600">foodO</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-600">
            Where homemade flavors meet modern convenience, connecting
            passionate chefs with food lovers across Pakistan
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>
              <img
                src={assets.food_2}
                alt="Our Story"
                className="relative w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-block mb-4 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
              Our Journey
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              From Kitchen to{" "}
              <span className="text-orange-500">Your Doorstep</span>
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                foodO was born from a simple yet powerful idea:{" "}
                <strong className="text-orange-600">
                  bring authentic homemade meals to everyone
                </strong>
                . We saw talented home chefs creating magic in their kitchens
                but lacking the platform to share it with the world.
              </p>
              <p>
                Today, we're proud to be Pakistan's fastest-growing platform for
                homemade food delivery, connecting thousands of passionate chefs
                with food lovers who crave the genuine taste of home.
              </p>
              <p>
                Every order tells a story of tradition, love, and culinary
                excellence. We're not just delivering food — we're delivering
                memories, culture, and the warmth of home-cooked meals.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-orange-600">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="font-semibold">Est. 2023</span>
              </div>
              <div className="flex items-center gap-2 text-orange-600">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="font-semibold">16+ Cities</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-pink-500 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydjJ6bTAtMnYyem0wLTJ2MnptMC0ydjJ6bTAtMnYyem0wLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-6 py-2 bg-orange-500/20 backdrop-blur-sm rounded-full text-orange-300 text-sm font-medium">
              What Drives Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl transform group-hover:scale-105 transition duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-orange-300/50 transition duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition duration-500">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  To empower home chefs by providing them with a reliable,
                  innovative platform to showcase their culinary skills, while
                  delivering authentic, delicious homemade meals to customers
                  who value quality, tradition, and the genuine taste of
                  home-cooked food.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl transform group-hover:scale-105 transition duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-orange-300/50 transition duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 transition duration-500">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  To become the most trusted and beloved platform for homemade
                  food across Pakistan and beyond, creating sustainable
                  opportunities for home chefs while preserving and celebrating
                  the rich culinary heritage of our diverse cultures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
            What We Believe In
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Core Values
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These principles guide everything we do at foodO
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              title: "Quality First",
              desc: "We ensure every meal meets our high standards of taste, freshness, and hygiene through rigorous verification.",
              color: "from-green-400 to-emerald-500",
            },
            {
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              title: "Community Driven",
              desc: "We build strong, meaningful relationships between home chefs and customers in local communities.",
              color: "from-blue-400 to-indigo-500",
            },
            {
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              title: "Fair Pricing",
              desc: "We ensure fair compensation for home chefs while keeping meals affordable and accessible for all customers.",
              color: "from-orange-400 to-red-500",
            },
            {
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              title: "Trust & Safety",
              desc: "Your safety is paramount. We verify all chefs and ensure secure transactions for peace of mind.",
              color: "from-purple-400 to-pink-500",
            },
            {
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              title: "Innovation",
              desc: "We continuously improve our platform with cutting-edge technology to enhance your experience.",
              color: "from-yellow-400 to-orange-500",
            },
            {
              icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
              title: "Passion",
              desc: "We're passionate about food, culture, and creating opportunities for talented home chefs to thrive.",
              color: "from-pink-400 to-rose-500",
            },
          ].map((value, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition duration-500`}
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
                    d={value.icon}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Growing Together
            </h2>
            <p className="text-white/90 text-lg">Our journey in numbers</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "1000+",
                label: "Home Chefs",
                icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
              },
              {
                num: "50K+",
                label: "Happy Customers",
                icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                num: "100K+",
                label: "Orders Delivered",
                icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
              },
              {
                num: "16+",
                label: "Cities",
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 transform hover:scale-105 transition duration-500"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                      d={stat.icon}
                    />
                  </svg>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.num}
                </div>
                <div className="text-white/90 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-6 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
            Meet The Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powered by Passion
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            A diverse team of food enthusiasts, tech experts, and customer
            service professionals working together to bring you the best
            homemade food experience
          </p>
        </div>

        <div className="relative bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-8 md:p-12 border-2 border-orange-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200 to-transparent rounded-full blur-3xl opacity-50"></div>
          <div className="relative text-center">
            <div className="flex justify-center mb-6 space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full border-4 border-white shadow-lg ${
                    i > 1 ? "-ml-6" : ""
                  }`}
                ></div>
              ))}
              <div className="w-12 h-12 bg-gray-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-sm font-bold text-gray-600 -ml-6">
                50+
              </div>
            </div>
            <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-3xl mx-auto leading-relaxed">
              Our passionate team works around the clock to ensure you get the{" "}
              <span className="text-orange-600 font-bold">freshest meals</span>,
              the{" "}
              <span className="text-orange-600 font-bold">best service</span>,
              and an{" "}
              <span className="text-orange-600 font-bold">
                unforgettable experience
              </span>{" "}
              every single time.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
