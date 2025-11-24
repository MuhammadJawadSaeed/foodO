import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Branding Section - hidden on xs, visible from sm and above */}
      <div
        className={`${styles.section} hidden sm:block -mt-10 relative px-4 sm:px-6 lg:px-12`}
      >
        <div className="mb-6 flex justify-between w-full border shadow-lg bg-white p-4 sm:p-6 rounded-md">
          {brandingData &&
            brandingData.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 sm:space-x-4"
              >
                {item.icon}
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm">{item.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div
        className={`${styles.section} bg-white p-4 sm:p-6 rounded-lg mb-12`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 xl:grid-cols-4 xl:gap-10">
          {categoriesData &&
            categoriesData.map((item) => {
              const handleSubmit = () => {
                navigate(
                  `/products?category=${encodeURIComponent(item.title)}`
                );
              };

              return (
                <div
                  key={item.id}
                  onClick={handleSubmit}
                  className="w-full h-[100px] sm:h-[100px] md:h-[100px] lg:h-[120px] border rounded-lg p-4 flex items-center justify-between cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg focus:shadow-lg"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleSubmit();
                  }}
                  role="button"
                  aria-label={`Category ${item.title}`}
                >
                  <h5 className="text-base sm:text-lg md:text-lg font-sm leading-tight">
                    {item.title}
                  </h5>
                  <img
                    src={item.image_Url}
                    alt={item.title}
                    className="w-[90px] sm:w-[110px] md:w-[120px] object-cover rounded-md"
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
