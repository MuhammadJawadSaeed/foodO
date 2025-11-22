import React from "react";
import styles from "../../styles/styles";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
const ShopPreviewPage = () => {
  return (
    <>
      <Header activeHeading={1} />
      <div className="w-full bg-gradient-to-br from-gray-50 to-orange-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ShopInfo isOwner={false} />
            </div>
            <div className="lg:col-span-2">
              <ShopProfileData isOwner={false} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopPreviewPage;
