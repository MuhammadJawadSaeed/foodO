import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { assets } from "../Assests/assets";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeHeading={0} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 md:py-16 mt-[70px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-center">
            About foodO
          </h1>
          <p className="text-base sm:text-lg text-center max-w-3xl mx-auto">
            Connecting home chefs with food lovers across Pakistan
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6 md:p-8 md:gap-6 md:p-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">Our Story</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">
              foodO was born from a simple idea: to bring the warmth and
              authenticity of home-cooked meals to everyone, everywhere. We
              recognized that talented home chefs were creating amazing food but
              lacked a platform to reach customers who craved authentic,
              homemade flavors.
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">
              Today, foodO has grown into Pakistan's leading platform for
              homemade food delivery, connecting thousands of passionate home
              chefs with food lovers who appreciate the taste of tradition and
              quality.
            </p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Every meal ordered through foodO tells a story – of heritage,
              passion, and the joy of sharing good food with good people.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="/images/food_2.png"
              alt="Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:p-8">
            <div className="bg-orange-50 p-6 md:p-8 rounded-xl">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
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
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To empower home chefs by providing them with a reliable platform
                to showcase their culinary skills, while delivering authentic,
                delicious, and homemade meals to customers who value quality and
                tradition.
              </p>
            </div>
            <div className="bg-orange-50 p-6 md:p-8 rounded-xl">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
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
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted platform for homemade food across
                Pakistan and beyond, creating opportunities for home chefs while
                preserving the rich culinary heritage of our culture.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:p-8">
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-orange-500"
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
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Quality First
            </h3>
            <p className="text-gray-600">
              We ensure every meal meets our high standards of taste, freshness,
              and hygiene.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Community Driven
            </h3>
            <p className="text-gray-600">
              We build strong relationships between home chefs and customers in
              local communities.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-orange-500"
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
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Fair Pricing
            </h3>
            <p className="text-gray-600">
              We ensure fair compensation for home chefs while keeping meals
              affordable for customers.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:p-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-orange-100">Home Chefs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-orange-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">16+</div>
              <div className="text-orange-100">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-orange-100">Orders Delivered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Meet Our Team
        </h2>
        <p className="text-center text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
          Passionate individuals working together to revolutionize home-cooked
          food delivery
        </p>
        <div className="text-center bg-orange-50 rounded-xl p-12">
          <p className="text-gray-600 text-lg">
            Our diverse team of food enthusiasts, tech experts, and customer
            service professionals work tirelessly to connect you with the best
            homemade meals in your area.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
