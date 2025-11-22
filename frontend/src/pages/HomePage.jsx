import React, { useEffect, useState } from "react";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate page load
    setTimeout(() => setLoading(false), 600);
  }, []);

  if (loading) {
    return <Loader fullScreen={true} />;
  }

  return (
    <div>
      <Header activeHeading={1} />
      <Hero />
      <Categories />
      <BestDeals />
      {/* <FeaturedProduct /> */}
      <Footer />
    </div>
  );
};

export default HomePage;
