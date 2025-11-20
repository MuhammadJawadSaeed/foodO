import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeHeading={0} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 md:py-16 mt-[70px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 text-center">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-center">Last Updated: November 13, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white rounded-lg md:rounded-xl shadow-md p-6 md:p-10">
          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              1. Introduction
            </h2>
            <p className="text-sm sm:text-base text-sm sm:text-base text-gray-600 leading-relaxed">
              At foodO, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our platform. Please read this policy
              carefully to understand our practices regarding your personal
              data.
            </p>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              2. Information We Collect
            </h2>

            <div className="space-y-3 md:space-y-4 md:space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">
                  2.1 Personal Information
                </h3>
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    We collect information that you provide directly to us,
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 md:space-y-2 text-sm sm:text-base text-gray-600">
                    <li>Name, email address, and phone number</li>
                    <li>Delivery addresses</li>
                    <li>
                      Payment information (processed securely through
                      third-party providers)
                    </li>
                    <li>Account credentials</li>
                    <li>Profile information and preferences</li>
                    <li>Order history and communication with Home Chefs</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">
                  2.2 Automatically Collected Information
                </h3>
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-600 mb-3">
                    When you use our platform, we automatically collect:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 md:space-y-2 text-sm sm:text-base text-gray-600">
                    <li>
                      Device information (IP address, browser type, operating
                      system)
                    </li>
                    <li>Location data (with your permission)</li>
                    <li>Usage data (pages visited, time spent, clicks)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3">
                  2.3 Information from Third Parties
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We may receive information from third-party services you use
                  to access our platform, such as social media platforms if you
                  choose to connect them to your foodO account.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              3. How We Use Your Information
            </h2>
            <div className="space-y-3 md:space-y-4">
              <div className="bg-orange-50 p-6 rounded-lg">
                <p className="text-sm sm:text-base text-gray-600 mb-3 font-semibold">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-1.5 md:space-y-2 text-sm sm:text-base text-gray-600">
                  <li>Process and deliver your orders</li>
                  <li>
                    Communicate with you about orders, services, and updates
                  </li>
                  <li>
                    Personalize your experience and provide recommendations
                  </li>
                  <li>Process payments and prevent fraud</li>
                  <li>Improve our platform and services</li>
                  <li>Send promotional materials (with your consent)</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce our policies</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              4. Information Sharing and Disclosure
            </h2>
            <div className="space-y-3 md:space-y-4 text-sm sm:text-base text-gray-600">
              <p className="leading-relaxed">
                <strong className="text-gray-800">4.1 Home Chefs:</strong> We
                share necessary order information with Home Chefs to fulfill
                your orders (name, delivery address, phone number, order
                details).
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">
                  4.2 Service Providers:
                </strong>{" "}
                We may share information with third-party service providers who
                perform services on our behalf (payment processing, delivery,
                analytics, customer support).
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">
                  4.3 Legal Requirements:
                </strong>{" "}
                We may disclose information if required by law, legal process,
                or government request.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">
                  4.4 Business Transfers:
                </strong>{" "}
                Information may be transferred in connection with a merger,
                acquisition, or sale of assets.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">
                  4.5 With Your Consent:
                </strong>{" "}
                We may share information for other purposes with your explicit
                consent.
              </p>
            </div>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              5. Data Security
            </h2>
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
                We implement appropriate technical and organizational security
                measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
                These measures include:
              </p>
              <ul className="list-disc list-inside space-y-1.5 md:space-y-2 text-sm sm:text-base text-gray-600">
                <li>
                  Encryption of sensitive data during transmission (SSL/TLS)
                </li>
                <li>
                  Secure storage of payment information through PCI-DSS
                  compliant providers
                </li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-4">
                However, no method of transmission over the internet or
                electronic storage is 100% secure. While we strive to protect
                your data, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              6. Your Rights and Choices
            </h2>
            <div className="space-y-3 md:space-y-4">
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Access and Update
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  You can access and update your account information at any time
                  through your profile settings.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Delete Account
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  You may request deletion of your account by contacting us.
                  Some information may be retained for legal or legitimate
                  business purposes.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Marketing Communications
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  You can opt out of promotional emails by clicking the
                  unsubscribe link or updating your preferences.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Location Data
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  You can control location permissions through your device
                  settings.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Cookies
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  You can manage cookie preferences through your browser
                  settings.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              7. Cookies and Tracking Technologies
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your
              experience, analyze usage, and deliver personalized content.
              Cookies are small data files stored on your device.
            </p>
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
              <p className="text-sm sm:text-base text-gray-600 mb-3 font-semibold">
                Types of cookies we use:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                <li>
                  <strong className="text-gray-800">Essential Cookies:</strong>{" "}
                  Required for platform functionality
                </li>
                <li>
                  <strong className="text-gray-800">
                    Performance Cookies:
                  </strong>{" "}
                  Help us understand how visitors use our platform
                </li>
                <li>
                  <strong className="text-gray-800">Functional Cookies:</strong>{" "}
                  Remember your preferences and settings
                </li>
                <li>
                  <strong className="text-gray-800">
                    Advertising Cookies:
                  </strong>{" "}
                  Deliver relevant advertisements (with your consent)
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              8. Data Retention
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required by law. When information is no
              longer needed, we will securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Our services are not directed to individuals under the age of 18.
              We do not knowingly collect personal information from children. If
              we become aware that we have collected information from a child,
              we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              different data protection laws. We ensure appropriate safeguards
              are in place to protect your information.
            </p>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes by posting the new policy on our
              platform and updating the "Last Updated" date. Your continued use
              of the platform after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
              12. Contact Us
            </h2>
            <div className="bg-orange-50 p-6 rounded-lg">
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                If you have questions, concerns, or requests regarding this
                Privacy Policy or your personal data, please contact us:
              </p>
              <ul className="space-y-2 text-sm sm:text-base text-gray-600">
                <li>
                  <strong className="text-gray-800">Email:</strong>{" "}
                  privacy@foodo.com
                </li>
                <li>
                  <strong className="text-gray-800">Phone:</strong>{" "}
                  +92-XXX-XXXXXXX
                </li>
                <li>
                  <strong className="text-gray-800">Address:</strong> Data
                  Protection Officer, foodO Headquarters, Pakistan
                </li>
              </ul>
            </div>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              By using foodO, you acknowledge that you have read and understood
              this Privacy Policy and agree to the collection, use, and
              disclosure of your information as described herein.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
