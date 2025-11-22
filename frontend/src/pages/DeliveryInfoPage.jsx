import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const DeliveryInfoPage = () => {
  const deliveryZones = [
    {
      city: "Lahore",
      time: "30-45 min",
      fee: "PKR 50",
      areas: "DHA, Gulberg, Johar Town, Model Town, Cantt",
    },
    {
      city: "Karachi",
      time: "35-50 min",
      fee: "PKR 60",
      areas: "Clifton, DHA, Gulshan, North Nazimabad",
    },
    {
      city: "Islamabad",
      time: "30-40 min",
      fee: "PKR 50",
      areas: "F-6, F-7, F-8, F-10, G-6 to G-11",
    },
    {
      city: "Faisalabad",
      time: "35-45 min",
      fee: "PKR 40",
      areas: "Peoples Colony, Model Town, Allama Iqbal Colony",
    },
    {
      city: "Multan",
      time: "30-45 min",
      fee: "PKR 40",
      areas: "Cantt, Gulgasht, Model Town",
    },
    {
      city: "Rawalpindi",
      time: "30-45 min",
      fee: "PKR 50",
      areas: "Bahria Town, Satellite Town, Chaklala",
    },
  ];

  const deliveryFeatures = [
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Real-Time Tracking",
      desc: "Track your order from kitchen to doorstep with live GPS",
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Safe Delivery",
      desc: "Contactless delivery option and safety measures followed",
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "No Hidden Charges",
      desc: "Transparent pricing with all costs shown upfront",
    },
    {
      icon: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6",
      title: "Easy Returns",
      desc: "Hassle-free return policy for quality issues",
    },
  ];

  const deliverySteps = [
    {
      step: "Order Placed",
      desc: "Your order is confirmed and sent to chef",
      time: "Instant",
    },
    {
      step: "Preparing",
      desc: "Chef is preparing your fresh meal",
      time: "15-25 min",
    },
    {
      step: "Out for Delivery",
      desc: "Rider picked up and heading to you",
      time: "10-20 min",
    },
    { step: "Delivered", desc: "Enjoy your delicious meal!", time: "0 min" },
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
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            Delivery Information
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Fast & Reliable Delivery
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Fresh food delivered to your doorstep with care
          </p>
        </div>
      </div>

      {/* Delivery Features */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose Our Delivery
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliveryFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Steps */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Delivery Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {deliverySteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.step}
                </h3>
                <p className="text-white/80 text-sm mb-2">{step.desc}</p>
                <p className="text-orange-200 text-xs font-medium">
                  {step.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Zones */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Delivery Coverage
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveryZones.map((zone, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-bold text-orange-600 mb-4">
                {zone.city}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    <strong>Delivery Time:</strong> {zone.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
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
                  <span className="text-gray-700">
                    <strong>Fee:</strong> {zone.fee}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-orange-500 mt-0.5"
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
                  </svg>
                  <span className="text-gray-600 text-xs">{zone.areas}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Common Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What are delivery charges?",
                a: "Delivery charges vary by location, typically PKR 40-60. Free delivery on orders above PKR 1500.",
              },
              {
                q: "How can I track my order?",
                a: "Use the order tracking feature in the app or website with your order ID for real-time updates.",
              },
              {
                q: "Can I schedule delivery?",
                a: "Yes! You can schedule delivery up to 24 hours in advance during checkout.",
              },
              {
                q: "What if I'm not home?",
                a: "Contact our rider via app or call support to arrange safe delivery with someone else.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeliveryInfoPage;
