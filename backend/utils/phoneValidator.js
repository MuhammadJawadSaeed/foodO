// Phone number validation and formatting utility for Pakistan

/**
 * Validates and formats Pakistani phone numbers
 * Accepts formats:
 * - 03001234567 (11 digits)
 * - +923001234567 (with country code)
 * - 923001234567 (country code without +)
 * - 0300-1234567 (with dashes)
 * - +92-300-1234567 (with country code and dashes)
 */

module.exports.validateAndFormatPhone = (phoneNumber) => {
  if (!phoneNumber) {
    throw new Error("Phone number is required");
  }

  // Remove all spaces, dashes, and parentheses
  let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, "");

  // Remove + if present
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1);
  }

  // Check if it starts with 92 (Pakistan country code)
  if (cleaned.startsWith("92")) {
    // Remove country code to get local number
    cleaned = "0" + cleaned.substring(2);
  }

  // Validate format: Should be 11 digits starting with 0
  if (!/^0[0-9]{10}$/.test(cleaned)) {
    throw new Error(
      "Invalid Pakistani phone number. Must be 11 digits starting with 0 (e.g., 03001234567)"
    );
  }

  // Additional validation: Check if it's a valid mobile prefix
  const validPrefixes = [
    "0300",
    "0301",
    "0302",
    "0303",
    "0304",
    "0305",
    "0306",
    "0307",
    "0308",
    "0309", // Mobilink/Jazz
    "0310",
    "0311",
    "0312",
    "0313",
    "0314",
    "0315",
    "0316",
    "0317",
    "0318", // Ufone
    "0320",
    "0321",
    "0322",
    "0323",
    "0324",
    "0325", // Telenor
    "0330",
    "0331",
    "0332",
    "0333",
    "0334",
    "0335",
    "0336",
    "0337", // Zong
    "0340",
    "0341",
    "0342",
    "0343",
    "0344",
    "0345",
    "0346",
    "0347", // Warid (now Jazz)
  ];

  const prefix = cleaned.substring(0, 4);
  if (!validPrefixes.includes(prefix)) {
    throw new Error(
      "Invalid Pakistani mobile number prefix. Must start with a valid operator code (e.g., 0300, 0321, 0333)"
    );
  }

  return {
    local: cleaned, // 03001234567
    international: `+92${cleaned.substring(1)}`, // +923001234567
    formatted: `${cleaned.substring(0, 4)}-${cleaned.substring(4)}`, // 0300-1234567
    display: `+92 ${cleaned.substring(1, 4)} ${cleaned.substring(
      4,
      7
    )} ${cleaned.substring(7)}`, // +92 300 123 4567
  };
};

/**
 * Check if phone number is valid without throwing error
 */
module.exports.isValidPakistaniPhone = (phoneNumber) => {
  try {
    this.validateAndFormatPhone(phoneNumber);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Express middleware for validating phone numbers in request body
 */
module.exports.validatePhoneMiddleware = (field = "phoneNumber") => {
  return (req, res, next) => {
    const phoneNumber = req.body[field];

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`,
      });
    }

    try {
      const formatted = this.validateAndFormatPhone(phoneNumber);
      // Replace with formatted local number
      req.body[field] = formatted.local;
      // Add formatted versions to request for use in response
      req.formattedPhone = formatted;
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
};
