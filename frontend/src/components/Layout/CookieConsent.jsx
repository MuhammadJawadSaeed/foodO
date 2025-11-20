import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    advertising: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Delay showing banner slightly for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      advertising: true,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      advertising: false,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(necessaryOnly));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handlePreferenceChange = (key) => {
    if (key === "necessary") return; // Necessary cookies cannot be disabled
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t-4 border-orange-500 transform transition-transform duration-500 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {!showPreferences ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="hidden sm:block">
                  <svg
                    className="w-12 h-12 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    🍪 We Value Your Privacy
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    We use cookies to enhance your browsing experience, serve
                    personalized content, and analyze our traffic. By clicking
                    "Accept All", you consent to our use of cookies. You can
                    customize your preferences or learn more in our{" "}
                    <a
                      href="/privacy"
                      className="text-orange-500 hover:text-orange-600 font-semibold underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Customize
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-300"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div className="max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      Necessary Cookies
                    </h4>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">
                        Always Active
                      </span>
                      <div className="w-12 h-6 bg-orange-500 rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-6"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Essential for the website to function properly. These
                    cookies enable core functionality such as security, network
                    management, and accessibility.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      Functional Cookies
                    </h4>
                    <button
                      onClick={() => handlePreferenceChange("functional")}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.functional ? "bg-orange-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                          preferences.functional ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Allow us to remember choices you make (such as your
                    username, language, or region) and provide enhanced
                    features.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      Analytics Cookies
                    </h4>
                    <button
                      onClick={() => handlePreferenceChange("analytics")}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? "bg-orange-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                          preferences.analytics ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Help us understand how visitors interact with our website by
                    collecting and reporting information anonymously.
                  </p>
                </div>

                {/* Advertising Cookies */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">
                      Advertising Cookies
                    </h4>
                    <button
                      onClick={() => handlePreferenceChange("advertising")}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.advertising
                          ? "bg-orange-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                          preferences.advertising ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Used to deliver advertisements more relevant to you and your
                    interests. They also limit the number of times you see an
                    advertisement.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40 backdrop-blur-sm"></div>
    </>
  );
};

export default CookieConsent;
