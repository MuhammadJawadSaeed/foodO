import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const { allProducts, isLoading } = useSelector((state) => state.products);

  const location = useLocation();
  const selectedCityFromLocalStorage = localStorage.getItem("selectedCity");
  const selectedCity =
    location.state?.selectedCity || selectedCityFromLocalStorage || "";

  useEffect(() => {
    // Save the selected city to localStorage so it persists after page refresh
    if (selectedCity) {
      localStorage.setItem("selectedCity", selectedCity);
    }

    if (allProducts && allProducts.length > 0) {
      // Filter allProducts based on the selectedCity
      const allProductsData = selectedCity
        ? allProducts.filter((product) => product.shop.city === selectedCity)
        : allProducts;

      // Create a shallow copy of the filtered data before sorting
      const sortedData = [...allProductsData].sort(
        (a, b) => b.sold_out - a.sold_out
      );

      setData(sortedData);
    }
  }, [allProducts, selectedCity]);

  return (
    <>
      {isLoading ? (
        <Loader fullScreen={true} />
      ) : (
        <div>
          <Header activeHeading={2} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12">
              {data && data.length > 0 ? (
                data.map((i, index) => <ProductCard data={i} key={index} />)
              ) : (
                <p>No products available for this city.</p>
              )}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default BestSellingPage;
