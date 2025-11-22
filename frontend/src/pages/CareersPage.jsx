import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const CareersPage = () => {
  const positions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Lahore, Pakistan",
      type: "Full-time",
      description:
        "Build scalable solutions for our growing food delivery platform.",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      description: "Lead product strategy and roadmap for customer experience.",
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Karachi, Pakistan",
      type: "Full-time",
      description:
        "Drive growth through creative campaigns and user acquisition.",
    },
    {
      title: "Customer Support Lead",
      department: "Operations",
      location: "Islamabad, Pakistan",
      type: "Full-time",
      description:
        "Ensure exceptional customer experience and support quality.",
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Lahore, Pakistan",
      type: "Full-time",
      description: "Design beautiful and intuitive experiences for our users.",
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      description:
        "Turn data into actionable insights to drive business decisions.",
    },
  ];

  const benefits = [
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Competitive Salary",
      desc: "Market-leading compensation packages",
    },
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Flexible Hours",
      desc: "Work-life balance that works for you",
    },
    {
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      title: "Office Perks",
      desc: "Modern workspace with free meals",
    },
    {
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      title: "Learning Budget",
      desc: "Continuous learning opportunities",
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Health Insurance",
      desc: "Comprehensive health coverage",
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      title: "Team Events",
      desc: "Regular team building activities",
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
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Join Our Team
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Build the Future of Food
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join a passionate team revolutionizing homemade food delivery
          </p>
        </div>
      </div>

      {/* Why Join */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Why Work With Us?
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

      {/* Open Positions */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Open Positions
          </h2>
          <div className="space-y-4">
            {positions.map((position, idx) => (
              <div
                key={idx}
                className="border-2 border-orange-100 rounded-2xl p-6 hover:border-orange-300 hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {position.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{position.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {position.department}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {position.location}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CareersPage;
