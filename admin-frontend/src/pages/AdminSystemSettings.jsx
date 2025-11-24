import React, { useState, useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Layout/AdminSideBar";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../server";
import {
  AiOutlineSave,
  AiOutlineMail,
  AiOutlineDollar,
  AiOutlineSetting,
  AiOutlineGlobal,
  AiOutlineNotification,
  AiOutlineSafety,
  AiOutlineCloudUpload,
} from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { MdPayment } from "react-icons/md";

const AdminSystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // General Settings
  const [platformName, setPlatformName] = useState("FoodO");
  const [platformEmail, setPlatformEmail] = useState("support@foodo.com");
  const [platformPhone, setPlatformPhone] = useState("");
  const [platformAddress, setPlatformAddress] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Payment Settings
  const [platformFee, setPlatformFee] = useState(10);
  const [minWithdrawal, setMinWithdrawal] = useState(100);
  const [currency, setCurrency] = useState("PKR");
  const [taxRate, setTaxRate] = useState(0);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [paypalEnabled, setPaypalEnabled] = useState(false);
  const [codEnabled, setCodEnabled] = useState(true);

  // Email Settings
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Notification Settings
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [userNotifications, setUserNotifications] = useState(true);
  const [sellerNotifications, setSellerNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [ipWhitelist, setIpWhitelist] = useState([]);
  const [newIp, setNewIp] = useState("");

  // File Upload Settings
  const [maxFileSize, setMaxFileSize] = useState(5);
  const [allowedFormats, setAllowedFormats] = useState("jpg,jpeg,png,pdf");
  const [cloudStorage, setCloudStorage] = useState("local");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await axios.get(`${server}/admin/settings`, {
        withCredentials: true,
      });
      // Load settings from backend
      if (data.settings) {
        const s = data.settings;
        setPlatformName(s.platformName || "FoodO");
        setPlatformEmail(s.platformEmail || "");
        setPlatformFee(s.platformFee || 10);
        setMinWithdrawal(s.minWithdrawal || 100);
        setCurrency(s.currency || "PKR");
        // ... load other settings
      }
    } catch (error) {
      console.log("Settings not loaded, using defaults");
    }
  };

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${server}/admin/settings/general`,
        {
          platformName,
          platformEmail,
          platformPhone,
          platformAddress,
          maintenanceMode,
        },
        { withCredentials: true }
      );
      toast.success("General settings saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
    setLoading(false);
  };

  const handleSavePayment = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${server}/admin/settings/payment`,
        {
          platformFee,
          minWithdrawal,
          currency,
          taxRate,
          stripeEnabled,
          paypalEnabled,
          codEnabled,
        },
        { withCredentials: true }
      );
      toast.success("Payment settings saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
    setLoading(false);
  };

  const handleSaveEmail = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${server}/admin/settings/email`,
        {
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass,
          emailNotifications,
        },
        { withCredentials: true }
      );
      toast.success("Email settings saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
    setLoading(false);
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${server}/admin/settings/notifications`,
        {
          orderNotifications,
          userNotifications,
          sellerNotifications,
          marketingEmails,
        },
        { withCredentials: true }
      );
      toast.success("Notification settings saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
    setLoading(false);
  };

  const handleSaveSecurity = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${server}/admin/settings/security`,
        {
          twoFactorAuth,
          sessionTimeout,
          maxLoginAttempts,
          ipWhitelist,
        },
        { withCredentials: true }
      );
      toast.success("Security settings saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
    setLoading(false);
  };

  const handleSaveUpload = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${server}/admin/settings/upload`,
        {
          maxFileSize,
          allowedFormats,
          cloudStorage,
        },
        { withCredentials: true }
      );
      toast.success("Upload settings saved successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
    setLoading(false);
  };

  const handleAddIp = () => {
    if (newIp && !ipWhitelist.includes(newIp)) {
      setIpWhitelist([...ipWhitelist, newIp]);
      setNewIp("");
    }
  };

  const handleRemoveIp = (ip) => {
    setIpWhitelist(ipWhitelist.filter((i) => i !== ip));
  };

  const tabs = [
    { id: "general", name: "General", icon: AiOutlineSetting },
    { id: "payment", name: "Payment", icon: MdPayment },
    { id: "email", name: "Email", icon: AiOutlineMail },
    { id: "notifications", name: "Notifications", icon: AiOutlineNotification },
    { id: "security", name: "Security", icon: AiOutlineSafety },
    { id: "upload", name: "File Upload", icon: AiOutlineCloudUpload },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <AdminSideBar active={9} />
        </div>

        <div className="flex-1 w-full lg:w-auto flex justify-center">
          <div className="w-full max-w-7xl px-3 sm:px-4 md:px-8 my-4 sm:my-6 md:my-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              System Settings
            </h1>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex overflow-x-auto border-b">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                        activeTab === tab.id
                          ? "text-orange-500 border-b-2 border-orange-500"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <Icon size={20} />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* General Settings */}
            {activeTab === "general" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AiOutlineGlobal className="text-orange-500" />
                  General Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      value={platformName}
                      onChange={(e) => setPlatformName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={platformEmail}
                      onChange={(e) => setPlatformEmail(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Support Phone
                    </label>
                    <input
                      type="text"
                      value={platformPhone}
                      onChange={(e) => setPlatformPhone(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Platform Address
                    </label>
                    <textarea
                      value={platformAddress}
                      onChange={(e) => setPlatformAddress(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="maintenance"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="maintenance" className="font-semibold">
                      Enable Maintenance Mode
                    </label>
                  </div>

                  <button
                    onClick={handleSaveGeneral}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    <AiOutlineSave />
                    {loading ? "Saving..." : "Save General Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AiOutlineDollar className="text-orange-500" />
                  Payment Settings
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Platform Fee (%)
                      </label>
                      <input
                        type="number"
                        value={platformFee}
                        onChange={(e) => setPlatformFee(Number(e.target.value))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Min Withdrawal Amount
                      </label>
                      <input
                        type="number"
                        value={minWithdrawal}
                        onChange={(e) =>
                          setMinWithdrawal(Number(e.target.value))
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="PKR">PKR - Pakistani Rupee</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Payment Methods</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="stripe"
                          checked={stripeEnabled}
                          onChange={(e) => setStripeEnabled(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="stripe">Enable Stripe</label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="paypal"
                          checked={paypalEnabled}
                          onChange={(e) => setPaypalEnabled(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="paypal">Enable PayPal</label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="cod"
                          checked={codEnabled}
                          onChange={(e) => setCodEnabled(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="cod">Enable Cash on Delivery</label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePayment}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    <AiOutlineSave />
                    {loading ? "Saving..." : "Save Payment Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === "email" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AiOutlineMail className="text-orange-500" />
                  Email Settings
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        placeholder="smtp.gmail.com"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(Number(e.target.value))}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={smtpPass}
                      onChange={(e) => setSmtpPass(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="emailNotif"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="emailNotif" className="font-semibold">
                      Enable Email Notifications
                    </label>
                  </div>

                  <button
                    onClick={handleSaveEmail}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    <AiOutlineSave />
                    {loading ? "Saving..." : "Save Email Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AiOutlineNotification className="text-orange-500" />
                  Notification Settings
                </h2>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Order Notifications</h4>
                        <p className="text-sm text-gray-600">
                          Notify admin on new orders
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={orderNotifications}
                        onChange={(e) =>
                          setOrderNotifications(e.target.checked)
                        }
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">User Notifications</h4>
                        <p className="text-sm text-gray-600">
                          Notify admin on new user registrations
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={userNotifications}
                        onChange={(e) => setUserNotifications(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Seller Notifications</h4>
                        <p className="text-sm text-gray-600">
                          Notify admin on new seller applications
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={sellerNotifications}
                        onChange={(e) =>
                          setSellerNotifications(e.target.checked)
                        }
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold">Marketing Emails</h4>
                        <p className="text-sm text-gray-600">
                          Send promotional emails to users
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={marketingEmails}
                        onChange={(e) => setMarketingEmails(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveNotifications}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    <AiOutlineSave />
                    {loading ? "Saving..." : "Save Notification Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AiOutlineSafety className="text-orange-500" />
                  Security Settings
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="2fa"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="2fa" className="font-semibold">
                      Enable Two-Factor Authentication
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={sessionTimeout}
                        onChange={(e) =>
                          setSessionTimeout(Number(e.target.value))
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={maxLoginAttempts}
                        onChange={(e) =>
                          setMaxLoginAttempts(Number(e.target.value))
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      IP Whitelist
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="Enter IP address"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={handleAddIp}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-1">
                      {ipWhitelist.map((ip, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                        >
                          <span>{ip}</span>
                          <button
                            onClick={() => handleRemoveIp(ip)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSecurity}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    <AiOutlineSave />
                    {loading ? "Saving..." : "Save Security Settings"}
                  </button>
                </div>
              </div>
            )}

            {/* Upload Settings */}
            {activeTab === "upload" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AiOutlineCloudUpload className="text-orange-500" />
                  File Upload Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      value={maxFileSize}
                      onChange={(e) => setMaxFileSize(Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Allowed File Formats
                    </label>
                    <input
                      type="text"
                      value={allowedFormats}
                      onChange={(e) => setAllowedFormats(e.target.value)}
                      placeholder="jpg,jpeg,png,pdf"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Separate formats with commas
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Cloud Storage
                    </label>
                    <select
                      value={cloudStorage}
                      onChange={(e) => setCloudStorage(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="local">Local Storage</option>
                      <option value="cloudinary">Cloudinary</option>
                      <option value="s3">Amazon S3</option>
                      <option value="azure">Azure Blob</option>
                    </select>
                  </div>

                  <button
                    onClick={handleSaveUpload}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  >
                    <AiOutlineSave />
                    {loading ? "Saving..." : "Save Upload Settings"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemSettings;
