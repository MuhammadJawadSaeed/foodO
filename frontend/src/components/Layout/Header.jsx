import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  let ticking = false;
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setActive(window.scrollY > 70);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <Link to="/">
            <div className="flex items-center">
              <h1 className="text-[36px] font-semibold text-gray-700">food</h1>
              <h1 className="text-[38px] font-semibold text-orange-500">O</h1>
            </div>
          </Link>
          <h1 className="font-bold text-gray-600 text-[24px]">
            Do you want business account ?
          </h1>
          <div className={`${styles.button}`}>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
              <h1 className="text-[#fff] font-semibold flex items-center">
                {isSeller ? "Go Dashboard" : "FoodO for Business"}{" "}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`shadow-xl ${
          active ? "fixed top-0 left-0 z-10" : ""
        } transition hidden 800px:flex items-center justify-between w-full bg-orange-500 h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          <Navbar active={activeHeading} />
          <div className="flex">
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setShowSearch(true)}
              >
                <AiOutlineSearch size={30} color="rgb(255, 255, 255)" />
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255, 255, 255)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#ffffff] w-4 h-4 text-orange-500 font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart size={30} color="rgb(255, 255, 255)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#ffffff] w-4 h-4 text-orange-500 font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full bg-white"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255, 255, 255)" />
                  </Link>
                )}
              </div>
            </div>
            {openCart && <Cart setOpenCart={setOpenCart} />}
            {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <BiMenuAltLeft
            size={40}
            className="ml-4"
            onClick={() => setOpen(true)}
          />
          <Link to="/">
            <div className="flex items-center">
              <h1 className="text-[36px] font-semibold text-gray-700">food</h1>
              <h1 className="text-[38px] font-semibold text-orange-500">O</h1>
            </div>
          </Link>
          <div className="relative mr-[20px]" onClick={() => setOpenCart(true)}>
            <AiOutlineShoppingCart size={30} />
            <span className="absolute right-0 top-0 rounded-full bg-orange-500 w-4 h-4 text-white font-mono text-[12px] leading-tight text-center">
              {cart && cart.length}
            </span>
          </div>
          {openCart && <Cart setOpenCart={setOpenCart} />}
          {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
        </div>

        {/* Sidebar */}
        {open && (
          <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div
                  className="relative mr-[15px]"
                  onClick={() => {
                    setOpenWishlist(true);
                    setOpen(false);
                  }}
                >
                  <AiOutlineHeart size={30} className="mt-5 ml-3" />
                  <span className="absolute right-0 top-0 rounded-full bg-orange-500 w-4 h-4 text-white font-mono text-[12px] leading-tight text-center">
                    {wishlist && wishlist.length}
                  </span>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5"
                  onClick={() => setOpen(false)}
                />
              </div>

              {/* Clickable Search Heading */}
              <div
                className="my-8 w-[92%] m-auto h-[40px] flex items-center justify-center border-2 border-gray-300 rounded-md cursor-pointer"
                ref={mobileSearchRef}
                onClick={() => {
                  setShowSearch(true);
                  setOpen(false);
                }}
              >
                <span className="text-[16px] flex text-gray-600">
                  <AiOutlineSearch size={30} color="rgb(0,0,0)" /> Search
                  Products
                </span>
              </div>

              <Navbar active={activeHeading} />
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>

              <div className="flex w-full justify-center mb-2 mt-4">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user.avatar?.url}`}
                      alt=""
                      className="w-[60px] h-[60px] rounded-full border-[3px] border-orange-500"
                    />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login /
                    </Link>
                    <Link
                      to="/sign-up"
                      className="text-[18px] text-[#000000b7]"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔍 Big Search Popup */}
      {showSearch && (
        <div
          ref={searchRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[80%] lg:w-[60%] h-[80%] bg-white z-[100] p-6 shadow-2xl rounded-lg flex flex-col items-center justify-start overflow-auto"
        >
          <div className="w-full flex justify-end">
            <RxCross1
              size={30}
              className="cursor-pointer"
              onClick={() => {
                setShowSearch(false);
                setSearchTerm(""); // Clear input
                setSearchData([]); // Clear search results
              }}
            />
          </div>
          <input
            type="text"
            placeholder="Search Food..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-[50px] w-full max-w-[600px] px-4 border border-gray-400 rounded-md bg-white text-black mt-4 text-[18px]"
          />
          {searchData && searchData.length !== 0 && (
            <div className="mt-6 w-full max-w-[600px]">
              {searchData.map((i, index) => (
                <Link
                  to={`/product/${i._id}`}
                  key={index}
                  onClick={() => setShowSearch(false)}
                >
                  <div className="flex items-center p-3 hover:bg-gray-200 rounded-md bg-gray-100">
                    <img
                      src={`${i.images[0]?.url}`}
                      alt={i.name}
                      className="w-[50px] h-[50px] mr-4 object-cover"
                    />
                    <h1 className="text-lg font-semibold">{i.name}</h1>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
