import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for selectedCity from localStorage or location state
  const selectedCityFromLocalStorage = localStorage.getItem("selectedCity");
  const selectedCity = location.state?.selectedCity || selectedCityFromLocalStorage || "";

  useEffect(() => {
    // Save the selected city to localStorage so it persists after page refresh
    if (selectedCity) {
      localStorage.setItem("selectedCity", selectedCity);
    }

    if (allProducts && allProducts.length > 0) {
      const allProductsData = [...allProducts];

      // Filter products based on selected city
      const filteredData = selectedCity
        ? allProductsData.filter((product) => product.shop.city === selectedCity)
        : allProductsData;

      // Update the state with filtered data
      setData(filteredData);
    }
  }, [allProducts, selectedCity]);

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Best Deals in {selectedCity}</h1>
      </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12 border-0">
        {data && data.length !== 0 ? (
          data.map((i, index) => <ProductCard data={i} key={index} />)
        ) : (
          <p>No products available in this city.</p>
        )}
      </div>
    </div>
  );
};

export default BestDeals;
