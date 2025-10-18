/**
 * Pakistani CNIC Validator for Frontend
 * Validates and formats Pakistani CNIC numbers in React applications
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
export function validateAndFormatCNIC(cnic) {
  if (!cnic) {
    throw new Error("CNIC number is required");
  }

  // Remove all non-digit characters
  const digitsOnly = cnic.replace(/\D/g, "");

  // Check if it has exactly 13 digits
  if (digitsOnly.length !== 13) {
    throw new Error(
      `CNIC must be 13 digits. Currently ${digitsOnly.length} digits.`
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
export function isValidCNIC(cnic) {
  try {
    validateAndFormatCNIC(cnic);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Handles CNIC input with auto-formatting and validation for React
 * Use this in onChange handler
 *
 * @param {string} value - The input value
 * @param {Function} setValue - State setter for CNIC
 * @param {Function} setError - State setter for error message
 * @returns {void}
 *
 * @example
 * const [cnic, setCnic] = useState("");
 * const [cnicError, setCnicError] = useState("");
 *
 * <input
 *   value={cnic}
 *   onChange={(e) => handleCNICInput(e.target.value, setCnic, setCnicError)}
 * />
 */
export function handleCNICInput(value, setValue, setError) {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, "");

  // Limit to 13 digits
  const limitedDigits = digitsOnly.slice(0, 13);

  // Auto-format as user types: XXXXX-XXXXXXX-X
  let formatted = limitedDigits;
  if (limitedDigits.length > 5) {
    formatted = `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(5)}`;
  }
  if (limitedDigits.length > 12) {
    formatted = `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(
      5,
      12
    )}-${limitedDigits.slice(12)}`;
  }

  setValue(formatted);

  // Validate and set error
  if (limitedDigits.length === 0) {
    setError("");
  } else if (limitedDigits.length < 13) {
    setError(`CNIC must be 13 digits (${limitedDigits.length}/13)`);
  } else {
    setError(""); // Valid
  }
}

/**
 * Formats CNIC for display (with dashes)
 * @param {string} cnic - CNIC to format
 * @returns {string} - Formatted CNIC
 */
export function formatCNICForDisplay(cnic) {
  try {
    const validated = validateAndFormatCNIC(cnic);
    return validated.formatted;
  } catch (error) {
    return cnic; // Return as-is if invalid
  }
}
