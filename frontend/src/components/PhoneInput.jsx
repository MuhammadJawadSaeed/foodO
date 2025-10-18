import React, { useState } from "react";

/**
 * Professional Phone Input Component
 * Country code in separate box + Number input
 * Like WhatsApp, Google Forms style
 */

const PhoneInput = ({
  value = "",
  onChange,
  error = "",
  required = true,
  disabled = false,
  placeholder = "3001234567",
  className = "",
}) => {
  // Split existing value into country code and number
  const getInitialValues = () => {
    if (!value) return { countryCode: "+92", number: "" };

    if (value.startsWith("+92")) {
      return { countryCode: "+92", number: value.substring(3) };
    } else if (value.startsWith("92")) {
      return { countryCode: "+92", number: value.substring(2) };
    } else if (value.startsWith("0")) {
      return { countryCode: "+92", number: value.substring(1) };
    }

    return { countryCode: "+92", number: value };
  };

  const initial = getInitialValues();
  const [countryCode] = useState(initial.countryCode);
  const [localNumber, setLocalNumber] = useState(initial.number);

  // Handle number input change
  const handleNumberChange = (e) => {
    let input = e.target.value;

    // Remove all non-digit characters
    input = input.replace(/\D/g, "");

    // Limit to 10 digits (Pakistani mobile without leading 0)
    input = input.slice(0, 10);

    setLocalNumber(input);

    // Combine and send back in format: 03001234567
    const fullNumber = input ? `0${input}` : "";
    onChange(fullNumber);
  };

  // Format number for display (add spaces for readability)
  const formatNumberForDisplay = (num) => {
    if (!num) return "";
    // Format: 300 1234567 or 300 123 4567
    if (num.length <= 3) return num;
    if (num.length <= 6) return `${num.slice(0, 3)} ${num.slice(3)}`;
    return `${num.slice(0, 3)} ${num.slice(3, 6)} ${num.slice(6)}`;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-2">
        {/* Country Code Box */}
        <div className="flex-shrink-0 w-16 sm:w-18">
          <input
            type="text"
            value={countryCode}
            disabled
            className="w-full bg-gray-100 rounded-md px-1.5 sm:px-2 py-1 border border-gray-300 text-center text-sm sm:text-base font-semibold text-gray-700 cursor-not-allowed"
            title="Pakistan Country Code"
          />
        </div>

        {/* Phone Number Input */}
        <div className="flex-1">
          <input
            type="tel"
            value={formatNumberForDisplay(localNumber)}
            onChange={handleNumberChange}
            disabled={disabled}
            required={required}
            className={`w-full appearance-none block px-3 py-[6px] border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${
              error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "bg-gray-100 text-gray-600" : ""}`}
            placeholder={placeholder}
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Display Format Guide */}
      <div className="flex items-center justify-between mt-1 px-1">
        <p className="text-xs text-gray-500">
          {countryCode}{" "}
          {localNumber ? formatNumberForDisplay(localNumber) : "300 123 4567"}
        </p>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Success Indicator */}
      {!error && localNumber.length === 10 && (
        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
          <span>✓</span>
          <span>Valid Pakistani mobile number</span>
        </p>
      )}

      {/* Length Indicator */}
      {!error && localNumber.length > 0 && localNumber.length < 10 && (
        <p className="text-xs text-gray-500 mt-1">
          {localNumber.length}/10 digits
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
