import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const SafetyPage = () => {
  const safetyMeasures = [
    {
      title: "Chef Verification",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      points: [
        "Strict CNIC verification for all chefs",
        "Kitchen hygiene inspection before approval",
        "Regular quality checks and audits",
        "Customer reviews and ratings system",
      ],
    },
    {
      title: "Food Safety",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      points: [
        "Fresh ingredients quality standards",
        "Temperature-controlled delivery bags",
        "Tamper-proof packaging for all orders",
        "Food safety training for chefs",
      ],
    },
    {
      title: "Contactless Delivery",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      points: [
        "Leave-at-door delivery option",
        "Digital payment to minimize contact",
        "Sanitized delivery bags and equipment",
        "Masked riders with sanitizers",
      ],
    },
    {
      title: "Customer Protection",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      points: [
        "Secure payment gateway encryption",
        "Personal data privacy protection",
        "24/7 customer support",
        "Money-back guarantee for issues",
      ],
    },
  ];

  const guidelines = [
    {
      category: "For Customers",
      color: "orange",
      items: [
        "Check food temperature upon delivery",
        "Report any quality concerns immediately",
        "Provide accurate delivery instructions",
        "Rate and review your experience",
      ],
    },
    {
      category: "For Chefs",
      color: "orange",
      items: [
        "Maintain clean kitchen environment",
        "Use fresh, quality ingredients only",
        "Follow proper food handling procedures",
        "Package food securely and safely",
      ],
    },
  ];

  const certifications = [
    {
      name: "Food Safety Certified",
      desc: "All chefs receive food safety training",
    },
    {
      name: "Hygiene Standards",
      desc: "Regular kitchen inspections maintained",
    },
    { name: "Quality Assured", desc: "Continuous monitoring and improvement" },
    { name: "Customer First", desc: "Your safety is our top priority" },
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
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Safety & Hygiene
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Your Safety is Our Priority
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Strict safety measures to ensure you get fresh, safe food every time
          </p>
        </div>
      </div>

      {/* Safety Measures */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Our Safety Measures
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {safetyMeasures.map((measure, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
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
                      d={measure.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {measure.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {measure.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
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
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Safety Guidelines
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {guidelines.map((guideline, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <h3 className="text-2xl font-bold text-white mb-6">
                  {guideline.category}
                </h3>
                <ul className="space-y-3">
                  {guideline.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white">
                      <svg
                        className="w-5 h-5 text-orange-200 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Our Commitment
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{cert.name}</h3>
              <p className="text-gray-600 text-sm">{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Report Section */}
      <div className="bg-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Report Safety Concerns
          </h2>
          <p className="text-gray-600 mb-6">
            If you notice any safety or hygiene issues, please report
            immediately to our support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition"
          >
            Contact Support
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SafetyPage;
