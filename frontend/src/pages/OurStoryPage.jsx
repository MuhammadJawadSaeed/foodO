import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const OurStoryPage = () => {
  const milestones = [
    {
      year: "2023",
      title: "The Beginning",
      desc: "foodO was founded with a vision to connect home chefs with food lovers",
    },
    {
      year: "2023",
      title: "First 100 Chefs",
      desc: "Onboarded passionate home chefs across Lahore",
    },
    {
      year: "2024",
      title: "Expansion",
      desc: "Expanded to 10+ cities across Pakistan",
    },
    {
      year: "2024",
      title: "50K Orders",
      desc: "Delivered 50,000+ homemade meals with love",
    },
    {
      year: "2025",
      title: "1000+ Chefs",
      desc: "Growing community of verified home chefs",
    },
    {
      year: "2025",
      title: "Future Vision",
      desc: "Becoming Pakistan's #1 homemade food platform",
    },
  ];

  const values = [
    {
      title: "Quality First",
      desc: "Only the freshest ingredients and verified chefs",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Community Driven",
      desc: "Building strong connections between chefs and customers",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      title: "Innovation",
      desc: "Using technology to make food delivery better",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    },
    {
      title: "Sustainability",
      desc: "Supporting local chefs and reducing food waste",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
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
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            Our Story
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            The foodO Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            From a simple idea to Pakistan's fastest-growing homemade food
            platform
          </p>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            It started with a simple observation: talented home chefs were
            creating amazing food, but had no way to reach customers beyond
            their immediate circle. Meanwhile, food lovers craved authentic,
            homemade meals but had limited options.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            In 2023, we launched foodO to bridge this gap. We believed that
            technology could empower home chefs to turn their passion into a
            business, while giving customers access to diverse, authentic
            homemade cuisine.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Today, foodO is more than just a food delivery platform. We're a
            community of passionate chefs, food enthusiasts, and innovators
            working together to celebrate Pakistan's rich culinary heritage
            while embracing modern convenience.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our Journey
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {milestones.map((milestone, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
              >
                <div className="text-4xl font-bold text-orange-200 mb-2">
                  {milestone.year}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {milestone.title}
                </h3>
                <p className="text-white/80">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                    d={value.icon}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OurStoryPage;
