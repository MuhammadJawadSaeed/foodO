import React, { useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import Loader from "../components/Layout/Loader";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import { useSelector } from "react-redux";
import Footer from "../components/Layout/Footer";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);

  return (
    <div>
      {loading ? (
        <Loader fullScreen={true} />
      ) : (
        <>
          <Header />
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    <ProfileSideBar active={active} setActive={setActive} />
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <ProfileContent active={active} />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
