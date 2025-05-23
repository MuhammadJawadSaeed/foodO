import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);
  
  const location = useLocation();
  const selectedCityFromLocalStorage = localStorage.getItem("selectedCity");
  const selectedCity = location.state?.selectedCity || selectedCityFromLocalStorage || "";

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      let filteredProducts = allProducts;

      // Apply category filter if category is provided
      if (categoryData) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category === categoryData
        );
      }

      // Apply city filter if a city is selected
      if (selectedCity) {
        filteredProducts = filteredProducts.filter(
          (product) => product.shop.city === selectedCity
        );
      }

      setData(filteredProducts);
    }
  }, [allProducts, categoryData, selectedCity]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={3} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-4 xl:gap-[30px] mb-12">
              {data && data.length > 0 ? (
                data.map((i, index) => <ProductCard data={i} key={index} />)
              ) : (
                <h1 className="text-center w-full pb-[100px] text-[20px]">
                  No products found!
                </h1>
              )}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;
