import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
  footerLegalLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">food</h1>
              <h1 className="text-3xl font-bold text-orange-500">O</h1>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Bringing homemade flavors to your doorstep. Fresh, authentic, and
              delicious.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300"
              >
                <AiFillFacebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300"
              >
                <AiOutlineTwitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300"
              >
                <AiFillInstagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition duration-300"
              >
                <AiFillYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerProductLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-gray-600 hover:text-orange-600 transition duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footercompanyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-gray-600 hover:text-orange-600 transition duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerSupportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="text-gray-600 hover:text-orange-600 transition duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-600 text-sm">
                <HiLocationMarker
                  className="text-orange-500 mt-1 flex-shrink-0"
                  size={18}
                />
                <span>Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 text-sm">
                <HiPhone className="text-orange-500 flex-shrink-0" size={18} />
                <span>+92 300 0000000</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 text-sm">
                <HiMail className="text-orange-500 flex-shrink-0" size={18} />
                <span>support@foodo.pk</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Download Our App</p>
              <div className="flex gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                  alt="Google Play"
                  className="h-10 cursor-pointer hover:opacity-80 transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:justify-between md:items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © 2025{" "}
                <span className="text-orange-600 font-semibold">foodO</span>.
                All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
              {footerLegalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.link}
                  className="text-gray-600 hover:text-orange-600 transition duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-center md:justify-end">
            <img
              src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
              alt="Payment Methods"
              className="h-8 opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
