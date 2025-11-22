import React from "react";
import Header from "../components/Layout/Header";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Checkout from "../components/Checkout/Checkout";
import Footer from "../components/Layout/Footer";

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CheckoutSteps active={1} />
        <Checkout />
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
