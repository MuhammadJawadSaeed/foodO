import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../../styles/styles";

const Hero = () => {
  const location = useLocation();
  const selectedCityFromLocalStorage = localStorage.getItem("selectedCity");
  const selectedCity = location.state?.selectedCity || selectedCityFromLocalStorage || "Your City";

  return (
    <div
      className={`relative min-h-[50vh] 800px:min-h-[70vh] w-full bg-[#f1efef] bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage: "url('/images/grill.png')",
        backgroundPosition: "right center", // Move image to the right
        backgroundSize: "contain", // Ensure the image fits properly
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1
          className={`text-[30px] leading-[1.2] 800px:text-[40px] text-[#272727] font-[700] capitalize`}
        >
          Food delivery from {selectedCity}'s<br /> home kitchens
        </h1>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Order Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
