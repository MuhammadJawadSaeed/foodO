import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState([]);
  const location = useLocation();

  // Get selected city from localStorage or location state
  const selectedCityFromLocalStorage = localStorage.getItem("selectedCity");
  const selectedCity = location.state?.selectedCity || selectedCityFromLocalStorage || "";

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Filter based on category
      const filteredByCategory = allProducts.filter((i) => i.category === data.category);

      // Further filter based on selected city
      const filteredByCity = selectedCity
        ? filteredByCategory.filter((product) => product.shop.city === selectedCity)
        : filteredByCategory;

      setProductData(filteredByCity);
    }
  }, [allProducts, selectedCity, data.category]);

  return (
    <div>
      {data ? (
        <div className={`p-4 ${styles.section}`}>
          <h2 className={`${styles.heading} text-[25px] font-[500] mb-5`}>
            Related food item in {selectedCity}
          </h2>
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12">
            {productData && productData.length > 0 ? (
              productData.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))
            ) : (
              <p>No related products available for this city.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SuggestedProduct;
