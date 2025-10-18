/**
 * Pakistani CNIC Validator
 * Validates and formats Pakistani CNIC numbers
 */

/**
 * Validates and formats a Pakistani CNIC number
 * Accepts formats:
 * - 1234567890123 (13 digits)
 * - 12345-6789012-3 (with dashes)
 * - 12345 6789012 3 (with spaces)
 *
 * @param {string} cnic - The CNIC number to validate
 * @returns {Object} - Object with formatted CNIC
 * @throws {Error} - If CNIC is invalid
 */
function validateAndFormatCNIC(cnic) {
  if (!cnic) {
    throw new Error("CNIC number is required");
  }

  // Remove all non-digit characters
  const digitsOnly = cnic.replace(/\D/g, "");

  // Check if it has exactly 13 digits
  if (digitsOnly.length !== 13) {
    throw new Error(
      `Invalid CNIC format. Must be 13 digits. Got ${digitsOnly.length} digits.`
    );
  }

  // Format: XXXXX-XXXXXXX-X
  const formatted = `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(
    5,
    12
  )}-${digitsOnly.slice(12)}`;

  return {
    digits: digitsOnly, // 1234567890123
    formatted: formatted, // 12345-6789012-3
    display: formatted, // For UI display
  };
}

/**
 * Checks if a CNIC is valid without throwing errors
 * @param {string} cnic - The CNIC to check
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidCNIC(cnic) {
  try {
    validateAndFormatCNIC(cnic);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Express middleware to validate CNIC in request body
 * @param {string} fieldName - The field name to validate (default: 'cnicNumber')
 */
function validateCNICMiddleware(fieldName = "cnicNumber") {
  return (req, res, next) => {
    try {
      const cnic = req.body[fieldName];
      const validated = validateAndFormatCNIC(cnic);

      // Replace with digits-only format for database
      req.body[fieldName] = validated.digits;

      next();
    } catch (error) {
      return res.status(400).json({
        message: error.message,
        field: fieldName,
      });
    }
  };
}

module.exports = {
  validateAndFormatCNIC,
  isValidCNIC,
  validateCNICMiddleware,
};
