/**
 * Pakistani Phone Number Validator
 * Validates Pakistani mobile numbers with proper formatting
 */

// Valid Pakistani mobile number patterns
const VALID_PATTERNS = [
  /^03[0-4][0-9]{8}$/, // Format: 03001234567 (11 digits starting with 03)
];

// Valid operator prefixes for Pakistan
const VALID_PREFIXES = [
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
  "0325", // Zong
  "0330",
  "0331",
  "0332",
  "0333",
  "0334",
  "0335",
  "0336",
  "0337", // Telenor
  "0340",
  "0341",
  "0342",
  "0343",
  "0344",
  "0345",
  "0346",
  "0347", // Warid/Jazz
];

/**
 * Clean phone number by removing all non-digit characters
 * @param {string} phone - Phone number to clean
 * @returns {string} - Cleaned phone number
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
};

/**
 * Check if phone number is valid Pakistani mobile number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPakistaniPhone = (phone) => {
  if (!phone) return false;

  // Clean the number
  const cleaned = cleanPhoneNumber(phone);

  // Handle different formats
  let localFormat = cleaned;

  // If starts with +92 or 92, remove it
  if (cleaned.startsWith("92") && cleaned.length === 12) {
    localFormat = "0" + cleaned.substring(2);
  } else if (!cleaned.startsWith("0") && cleaned.length === 10) {
    localFormat = "0" + cleaned;
  }

  // Check if matches any valid pattern
  const isValidPattern = VALID_PATTERNS.some((pattern) =>
    pattern.test(localFormat)
  );

  if (!isValidPattern) return false;

  // Check if has valid operator prefix
  const prefix = localFormat.substring(0, 4);
  return VALID_PREFIXES.includes(prefix);
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number (e.g., "0300 123 4567")
 */
export const formatPhoneForDisplay = (phone) => {
  if (!phone) return "";

  const cleaned = cleanPhoneNumber(phone);

  // Convert to local format (0XXXXXXXXXX)
  let localFormat = cleaned;
  if (cleaned.startsWith("92") && cleaned.length === 12) {
    localFormat = "0" + cleaned.substring(2);
  } else if (!cleaned.startsWith("0") && cleaned.length === 10) {
    localFormat = "0" + cleaned;
  }

  // Format: 0300 123 4567
  if (localFormat.length === 11) {
    return `${localFormat.substring(0, 4)} ${localFormat.substring(
      4,
      7
    )} ${localFormat.substring(7)}`;
  }

  return localFormat;
};

/**
 * Format phone number for storage (always stores as 03001234567)
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number for storage
 */
export const formatPhoneForStorage = (phone) => {
  if (!phone) return "";

  const cleaned = cleanPhoneNumber(phone);

  // Convert to local format (0XXXXXXXXXX)
  if (cleaned.startsWith("92") && cleaned.length === 12) {
    return "0" + cleaned.substring(2);
  } else if (!cleaned.startsWith("0") && cleaned.length === 10) {
    return "0" + cleaned;
  }

  return cleaned;
};

/**
 * Get validation error message for phone number
 * @param {string} phone - Phone number to validate
 * @returns {string} - Error message or empty string if valid
 */
export const getPhoneValidationError = (phone) => {
  if (!phone || phone.trim() === "") {
    return "Phone number is required";
  }

  const cleaned = cleanPhoneNumber(phone);

  if (cleaned.length < 10) {
    return "Phone number is too short";
  }

  if (cleaned.length > 12) {
    return "Phone number is too long";
  }

  if (!isValidPakistaniPhone(phone)) {
    return "Please enter a valid Pakistani mobile number";
  }

  return "";
};

/**
 * Validate and format phone number
 * Returns object with validation status and formatted values
 * @param {string} phone - Phone number to validate
 * @returns {object} - { isValid, error, local, international, display }
 */
export const validateAndFormatPhone = (phone) => {
  const error = getPhoneValidationError(phone);
  const isValid = !error;

  const local = formatPhoneForStorage(phone);
  const cleaned = cleanPhoneNumber(phone);
  const international = cleaned.startsWith("92")
    ? `+${cleaned}`
    : `+92${cleaned.substring(1)}`;
  const display = formatPhoneForDisplay(phone);

  return {
    isValid,
    error,
    local, // 03001234567
    international, // +923001234567
    display, // 0300 123 4567
  };
};
