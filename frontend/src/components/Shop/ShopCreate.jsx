// import { React, useState } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import styles from "../../styles/styles";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { server } from "../../server";
// import { toast } from "react-toastify";
// import { RxAvatar } from "react-icons/rx";

// const ShopCreate = () => {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState();
//   const [address, setAddress] = useState("");
//   const [zipCode, setZipCode] = useState();
//   const [avatar, setAvatar] = useState();
//   const [password, setPassword] = useState("");
//   const [visible, setVisible] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     axios
//       .post(`${server}/shop/create-shop`, {
//         name,
//         email,
//         password,
//         avatar,
//         zipCode,
//         address,
//         phoneNumber,
//       })
//       .then((res) => {
//         toast.success(res.data.message);
//         setName("");
//         setEmail("");
//         setPassword("");
//         setAvatar();
//         setZipCode();
//         setAddress("");
//         setPhoneNumber();
//       })
//       .catch((error) => {
//         toast.error(error.response.data.message);
//       });
//   };

//   const handleFileInputChange = (e) => {
//     const reader = new FileReader();

//     reader.onload = () => {
//       if (reader.readyState === 2) {
//         setAvatar(reader.result);
//       }
//     };

//     reader.readAsDataURL(e.target.files[0]);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Register as a seller
//         </h2>
//       </div>
//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Shop Name
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="name"
//                   name="name"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Phone Number
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="phone-number"
//                   required
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="email"
//                   name="email"
//                   autoComplete="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Address
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="address"
//                   name="address"
//                   required
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Zip Code
//               </label>
//               <div className="mt-1">
//                 <input
//                   type="number"
//                   name="zipcode"
//                   required
//                   value={zipCode}
//                   onChange={(e) => setZipCode(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <div className="mt-1 relative">
//                 <input
//                   type={visible ? "text" : "password"}
//                   name="password"
//                   autoComplete="current-password"
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//                 {visible ? (
//                   <AiOutlineEye
//                     className="absolute right-2 top-2 cursor-pointer"
//                     size={25}
//                     onClick={() => setVisible(false)}
//                   />
//                 ) : (
//                   <AiOutlineEyeInvisible
//                     className="absolute right-2 top-2 cursor-pointer"
//                     size={25}
//                     onClick={() => setVisible(true)}
//                   />
//                 )}
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="avatar"
//                 className="block text-sm font-medium text-gray-700"
//               ></label>
//               <div className="mt-2 flex items-center">
//                 <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
//                   {avatar ? (
//                     <img
//                       src={avatar}
//                       alt="avatar"
//                       className="h-full w-full object-cover rounded-full"
//                     />
//                   ) : (
//                     <RxAvatar className="h-8 w-8" />
//                   )}
//                 </span>
//                 <label
//                   htmlFor="file-input"
//                   className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   <span>Upload a file</span>
//                   <input
//                     type="file"
//                     name="avatar"
//                     id="file-input"
//                     onChange={handleFileInputChange}
//                     className="sr-only"
//                   />
//                 </label>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             </div>
//             <div className={`${styles.noramlFlex} w-full`}>
//               <h4>Already have an account?</h4>
//               <Link to="/shop-login" className="text-blue-600 pl-2">
//                 Sign in
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShopCreate;

import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";
import { State } from "country-state-city"; // Import for handling cities
import pakistanCities from "../../static/pakistanCities";
import PhoneInput from "../PhoneInput";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState(""); // City from dropdown
  const [customCity, setCustomCity] = useState(""); // Custom typed city
  const [useCustomCity, setUseCustomCity] = useState(false); // Toggle between dropdown and custom
  const [country, setCountry] = useState("Pakistan"); // Pakistan as default country
  const [avatar, setAvatar] = useState(null); // Avatar for shop
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCity = useCustomCity ? customCity : city;

    if (!finalCity) {
      toast.error("Please select or enter your city");
      return;
    }

    try {
      const res = await axios.post(`${server}/shop/create-shop`, {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
        city: finalCity,
        country,
      });
      toast.success(res.data.message);
      // Clear the form after submission
      setName("");
      setEmail("");
      setPassword("");
      setAvatar(null);
      setZipCode("");
      setAddress("");
      setPhoneNumber("");
      setCity("");
      setCustomCity("");
      setUseCustomCity(false);
      setCountry("Pakistan");
    } catch (error) {
      // Check if the error response exists and handle accordingly
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleFileInputChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result); // Set avatar URL after loading file
      }
    };
    reader.readAsDataURL(e.target.files[0]); // Read file
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a seller
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shop Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Phone Number - Professional Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder="300 123 4567"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <input
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            {/* Country (Only Pakistan) */}
            <div className="w-full pb-2">
              <label className="block pb-2 text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                value="Pakistan"
                disabled
                className="w-full border h-[40px] rounded-[5px] bg-gray-100 text-gray-700 px-3 cursor-not-allowed"
              />
            </div>

            {/* City - Select from list or type custom */}
            <div className="w-full pb-2">
              <label className="block pb-2 text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>

              {/* Toggle between dropdown and custom input */}
              <div className="flex items-center gap-3 mb-2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="shopCityOption"
                    checked={!useCustomCity}
                    onChange={() => setUseCustomCity(false)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">
                    Select from list
                  </span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="shopCityOption"
                    checked={useCustomCity}
                    onChange={() => setUseCustomCity(true)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Type your city</span>
                </label>
              </div>

              {!useCustomCity ? (
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full border h-[40px] rounded-[5px] px-3"
                >
                  <option value="">Choose your city</option>
                  {pakistanCities.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="Enter your city name"
                  required
                  className="w-full border h-[40px] rounded-[5px] px-3"
                />
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label className="ml-5 flex items-center px-4 py-2 border border-orange-500 rounded-md shadow-sm text-sm font-medium text-orange-500 bg-white hover:bg-orange-200">
                  Upload
                  <input
                    type="file"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
              >
                Submit
              </button>
            </div>

            {/* Sign In Link */}
            <div className="flex w-full items-center justify-center">
              <h4>Already have an account?</h4>
              <Link to="/shop-login" className="text-orange-500 pl-2">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;
