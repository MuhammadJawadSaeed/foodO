import React, { useEffect,useState } from "react";
import { assets } from "../Assests/assets";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";
import Header2 from "../components/Layout/Header2";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const { isSeller } = useSelector((state) => state.seller);
  // State to track if device is mobile (width < 640px)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind sm breakpoint = 640px
    };

    handleResize(); // Initial check on mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigate = useNavigate();

  const handleCityClick = (city) => {
    setSelectedCity(city);
    navigate("/home", { state: { selectedCity: city } }); // Navigate to HomePage with prop
  };

  return (
    <div className="">
      <Header2 activeHeading={1} />
      <div
        className={`relative min-h-[50vh] 800px:min-h-[70vh] w-full bg-[#f1efef] bg-no-repeat ${styles.noramlFlex}`}
         style={{
          backgroundImage: isMobile ? "none" : "url('/images/grill.png')",
          backgroundPosition: "right center", // Move image to the right
          backgroundSize: "contain", // Ensure the image fits properly
        }}
      >
        <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
          <h1
            className={`text-[20px]  leading-[1.2] 800px:ml-[-74px] 800px:text-[34px] text-[#272727] font-[700] capitalize`}
          >
            Delicious home-cooked food, made <br />
            fresh & delivered fast
          </h1>
        </div>
      </div>
      <div className="">
        <div className="">
          <h1 className="font-bold text-xl sm:text-3xl sm:px-16 p-4 sm:pt-12 sm:pb-6">
            You handle the kitchen, we handle the rest
          </h1>
        </div>
        <img className="" src={assets.food_2} alt="" />
        <div className="sm:ml-20  sm:w-2/5 w-3/4 bg-white relative shadow-[0px_5px_10px_#babecc] -mt-48 rounded-3xl">
          <h1 className="font-semibold  p-5 text-xl sm:text-2xl ">
            List your Kitchen on foodO
          </h1>
          <p className=" px-6">
            Would you like millions of new customers to enjoy your amazing food?
            So would we! <br /> <br />
            It's simple: we list your menu and product lists online, help you
            process orders, pick them up, and deliver them to hungry foodies –
            in a heartbeat! <br />
            <br />
            Interested? Let's start our partnership today!
          </p>
          <div className="p-6">
            <Link
              to={`${isSeller ? "/dashboard" : "/shop-create"}`}
              className=" items-center font-medium signup p-2.5 sm:p-3 rounded-[8px] text-white bg-orange-500"
            >
              Get started
            </Link>
          </div>
        </div>
        <div className="flex items-start flex-col">
          <h1 className="font-bold ml-20 m-10 mt-16 text-xl text-gray-700 sm:text-3xl">
            Find us in these cities and many more!
          </h1>
          <div className="flex justify-center p-10 flex-wrap gap-5">
            {[
              "Lahore",
              "Karachi",
              "Islamabad",
              "Rawalpindi",
              "Faisalabad",
              "Multan",
              "Peshawar",
              "Quetta",
              "Gujranwala",
              "Sialkot",
              "Bahawalpur",
              "Sargodha",
              "Abbottabad",
              "Hyderabad",
              "Mirpur",
              "Muzaffarabad",
            ].map((city) => (
              <div
                key={city}
                className="h-[230px] w-[260px] rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => handleCityClick(city)}
              >
                <img
                  className="w-full h-full rounded-xl"
                  src={assets[city]}
                  alt={city}
                />
                <h3 className="bg-white relative -mt-12 w-fit ml-2 text-gray-600 font-bold px-3 py-1 rounded shadow">
                  {city}
                </h3>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="">
            <h1 className="font-bold text-xl sm:text-3xl sm:px-16 p-4 sm:pt-12 sm:pb-6">
              Homemade flavors, delivered straight to your office
            </h1>
          </div>
          <img className="h-[550px] w-full" src={assets.food_3} alt="" />
          <div className="sm:ml-20  sm:w-2/5 w-3/4 bg-white relative -mt-28 shadow-[0px_5px_10px_#babecc] rounded-3xl">
            <h1 className="font-semibold  p-5 text-xl sm:text-2xl ">
              foodO for business
            </h1>
            <p className=" px-6">
              Order lunch or fuel for work-from-home, late nights in the office,
              corporate events, client meetings, and much more.
            </p>
            <div className="p-6">
              <button className=" items-center font-medium signup p-2.5 sm:p-3 rounded-[8px] text-white bg-orange-500">
                Get started
              </button>
            </div>
          </div>
        </div>
        <div className=" w-[90%] justify-center flex flex-col">
          <div className="p-2">
            <h1 className="font-bold text-xl sm:text-3xl sm:px-16 p-4 sm:pt-12 sm:pb-6">
              Order Homemade Food Online from the Best Home Kitchens on foodO
            </h1>
            <p className="md:px-12">
              Are you hungry? Did you have a long and stressful day? Craving a
              warm, home-cooked meal to satisfy your hunger? Or looking to avoid
              the hassle of cooking after a busy day? Then foodO is the perfect
              destination for you! foodO connects you to a variety of passionate
              home chefs offering delicious, fresh, and wholesome meals to make
              your everyday life easier.
            </p>
            <h1 className="font-bold text-xl sm:text-3xl sm:px-16 p-4 sm:pt-12 sm:pb-6">
              What's New?
            </h1>
            <p className="md:px-12">
              ✓ Wide variety of home kitchens: Explore an abundance of cuisines
              and homemade specialties, freshly prepared just for you. <br />
              ✓ High-quality delivery service: Enjoy fast, reliable delivery of
              home-cooked meals from kitchens near you. <br />
              ✓ Live chat feature: Get instant help whenever you need it. <br />
              ✓ NEW: Homemade grocery essentials! Discover local kitchens
              offering freshly made snacks, traditional sweets, and more.
            </p>
          </div>
          <div className="p-2 mb-14">
            <hr className="w-[98%] m-2 mt-6" />
            <h1 className="font-bold md:px-12 p-5 text-2xl sm:text-2xl">
              Frequently Asked Questions
            </h1>
            <h1 className="font-bold md:px-12 p-5 text-xl sm:text-xl">
              How can I get foodO delivery?
            </h1>
            <p className="md:px-12">
              To get foodO delivery, simply enter your address to locate home
              kitchens near you. Browse through their menus, check prices,
              choose your favorite dishes, and add them to the basket. Once you
              checkout and complete the payment, your freshly prepared homemade
              meal will be on its way to your doorstep!
            </p>
            <h1 className="font-bold md:px-12 p-5 text-xl sm:text-xl">
              Which home kitchens are open now near me?
            </h1>
            <p className="md:px-12">
              You can check which home kitchens are currently open near you by
              typing your address in the location bar on foodO and pressing
              search. You’ll see a list of available kitchens ready to deliver
              to your area.
            </p>
            <h1 className="font-bold md:px-12 p-5 text-xl sm:text-xl">
              Does foodO deliver 24 hours?
            </h1>
            <p className="md:px-12">
              Yes, foodO delivers 24 hours a day! However, home kitchens operate
              on their own schedules, so some may not be available for
              late-night deliveries. Use your address to check which kitchens
              are open near you at any time.
            </p>
            <h1 className="font-bold md:px-12 p-5 text-xl sm:text-xl">
              Can you pay cash for foodO?
            </h1>
            <p className="md:px-12">
              Yes, you can pay cash on delivery for foodO orders.
            </p>
            <h1 className="font-bold md:px-12 p-5 text-xl sm:text-xl">
              How can I pay foodO online?
            </h1>
            <p className="md:px-12">
              You can pay online while ordering from foodO using a credit or
              debit card or other digital payment options.
            </p>
            <h1 className="font-bold md:px-12 p-5 text-xl sm:text-xl">
              Can I order foodO for someone else?
            </h1>
            <p className="md:px-12">
              Yes, foodO allows you to place orders for someone else. During
              checkout, simply update the recipient’s name and delivery address.
              Whether it’s a surprise meal for a loved one or help for a friend,
              foodO makes it easy to share the joy of homemade food.
            </p>
            <h1 className="font-bold md:px-12 p-5 text-xl sm:text-xl">
              How much does foodO charge for delivery?
            </h1>
            <p className="md:px-12">
              The delivery fee for foodO depends on various factors, such as
              your location and the kitchen you're ordering from. You can always
              see the delivery fee while forming your order. Look for home
              kitchens offering Free Delivery to save more.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

// Export the function to get the selected city
export const getSelectedCity = () => getSelectedCity;

export default StartPage;
