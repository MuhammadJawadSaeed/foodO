import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeHeading={0} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
            Terms and Conditions
          </h1>
          <p className="text-lg text-center">Last Updated: November 13, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to foodO. These Terms and Conditions govern your use of
              our platform, website, and services. By accessing or using foodO,
              you agree to be bound by these terms. If you do not agree with any
              part of these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              2. Definitions
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-3 text-gray-600">
                <li>
                  <strong className="text-gray-800">"Platform"</strong> - refers
                  to the foodO website and mobile application
                </li>
                <li>
                  <strong className="text-gray-800">"User"</strong> - any person
                  who accesses or uses the Platform
                </li>
                <li>
                  <strong className="text-gray-800">"Home Chef"</strong> -
                  registered sellers offering food through our Platform
                </li>
                <li>
                  <strong className="text-gray-800">"Customer"</strong> - users
                  who purchase food from Home Chefs
                </li>
                <li>
                  <strong className="text-gray-800">"Services"</strong> - all
                  services provided by foodO including order placement, payment
                  processing, and delivery coordination
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. User Accounts
            </h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                <strong className="text-gray-800">3.1 Registration:</strong> To
                access certain features, you must create an account. You agree
                to provide accurate, current, and complete information during
                registration.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">3.2 Account Security:</strong>{" "}
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities under your account.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">3.3 Age Requirement:</strong>{" "}
                You must be at least 18 years old to create an account and use
                our services.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              4. Home Chef Terms
            </h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                <strong className="text-gray-800">4.1 Registration:</strong>{" "}
                Home Chefs must provide valid business information, including
                necessary food handling certifications where applicable.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">4.2 Food Quality:</strong>{" "}
                Home Chefs are responsible for ensuring food quality, safety,
                and hygiene standards are maintained at all times.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">4.3 Pricing:</strong> Home
                Chefs set their own prices but must ensure they are reasonable
                and competitive. foodO reserves the right to moderate pricing.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">4.4 Commission:</strong> foodO
                charges a commission on each order as outlined in the Home Chef
                agreement.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              5. Orders and Payments
            </h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                <strong className="text-gray-800">5.1 Order Placement:</strong>{" "}
                Orders are confirmed only when payment is successfully processed
                and Home Chef accepts the order.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">5.2 Payment Methods:</strong>{" "}
                We accept various payment methods including credit/debit cards
                and cash on delivery where available.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">5.3 Pricing:</strong> All
                prices are in Pakistani Rupees (PKR) and include applicable
                taxes.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">5.4 Refunds:</strong> Refund
                requests are handled on a case-by-case basis according to our
                refund policy.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              6. Delivery
            </h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                <strong className="text-gray-800">6.1 Delivery Times:</strong>{" "}
                Estimated delivery times are approximate and may vary due to
                factors beyond our control.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">6.2 Delivery Areas:</strong>{" "}
                We deliver to specified areas. Service availability depends on
                your location.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">6.3 Failed Delivery:</strong>{" "}
                If delivery cannot be completed due to incorrect address or
                customer unavailability, additional charges may apply.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              7. Cancellations and Refunds
            </h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                <strong className="text-gray-800">
                  7.1 Customer Cancellation:
                </strong>{" "}
                Orders can be cancelled before Home Chef acceptance.
                Post-acceptance cancellations may incur charges.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">
                  7.2 Home Chef Cancellation:
                </strong>{" "}
                If a Home Chef cancels an order, full refund will be processed
                to the customer.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-800">
                  7.3 Refund Processing:
                </strong>{" "}
                Refunds typically take 5-7 business days to reflect in your
                account.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              8. User Conduct
            </h2>
            <div className="bg-orange-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>
                  Use the Platform for any illegal or unauthorized purpose
                </li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe upon the rights of others</li>
                <li>Submit false or misleading information</li>
                <li>Interfere with or disrupt the Platform's functionality</li>
                <li>
                  Attempt to gain unauthorized access to any part of the
                  Platform
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              9. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content on the Platform, including text, graphics, logos,
              images, and software, is the property of foodO or its content
              suppliers and is protected by intellectual property laws. You may
              not reproduce, distribute, or create derivative works without our
              express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              10. Liability Limitation
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              foodO acts as an intermediary platform connecting customers with
              Home Chefs. We do not prepare, handle, or deliver food directly.
              While we strive to maintain quality standards, we are not liable
              for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>
                Food quality, taste, or safety issues arising from Home Chef
                preparation
              </li>
              <li>
                Allergic reactions or health issues related to food consumption
              </li>
              <li>
                Delays in delivery due to circumstances beyond our control
              </li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              11. Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your use of the Platform is also governed by our Privacy Policy,
              which explains how we collect, use, and protect your personal
              information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              12. Modifications
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any
              time. Changes will be effective immediately upon posting. Your
              continued use of the Platform after changes constitutes acceptance
              of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              13. Termination
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may terminate or suspend your account and access to the
              Platform immediately, without prior notice, for any breach of
              these Terms and Conditions or for any other reason at our sole
              discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              14. Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms and Conditions are governed by the laws of Pakistan.
              Any disputes arising from these terms shall be subject to the
              exclusive jurisdiction of the courts in Pakistan.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              15. Contact Us
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-3">
                If you have questions about these Terms and Conditions, please
                contact us:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <strong className="text-gray-800">Email:</strong>{" "}
                  support@foodo.com
                </li>
                <li>
                  <strong className="text-gray-800">Phone:</strong>{" "}
                  +92-XXX-XXXXXXX
                </li>
                <li>
                  <strong className="text-gray-800">Address:</strong> foodO
                  Headquarters, Pakistan
                </li>
              </ul>
            </div>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              By using foodO, you acknowledge that you have read, understood,
              and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsPage;
