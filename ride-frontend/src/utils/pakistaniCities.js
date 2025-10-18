/**
 * Pakistani Cities List
 * Major cities in Pakistan for Captain and User selection
 */

export const PAKISTANI_CITIES = [
  // Major Cities (Most Popular)
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",

  // Punjab Cities
  "Bahawalpur",
  "Sargodha",
  "Sheikhupura",
  "Jhang",
  "Rahim Yar Khan",
  "Gujrat",
  "Kasur",
  "Sahiwal",
  "Okara",
  "Wah Cantonment",
  "Dera Ghazi Khan",
  "Mirpur Khas",
  "Nawabshah",
  "Mingora",
  "Chiniot",
  "Kamoke",
  "Mandi Burewala",
  "Jhelum",
  "Sadiqabad",
  "Jacobabad",
  "Shikarpur",
  "Khanewal",
  "Hafizabad",
  "Kohat",
  "Muzaffargarh",
  "Khanpur",
  "Gojra",
  "Mandi Bahauddin",
  "Abbottabad",
  "Muridke",
  "Pakpattan",
  "Khushab",
  "Daska",
  "Jaranwala",
  "Chishtian",

  // Sindh Cities
  "Hyderabad",
  "Sukkur",
  "Larkana",
  "Mirpurkhas",
  "Nawabshah",
  "Shikarpur",
  "Jacobabad",
  "Khairpur",
  "Dadu",
  "Badin",
  "Tando Adam",
  "Tando Allahyar",
  "Umerkot",
  "Thatta",

  // Khyber Pakhtunkhwa Cities
  "Mardan",
  "Mansehra",
  "Swat",
  "Dera Ismail Khan",
  "Bannu",
  "Charsadda",
  "Nowshera",
  "Swabi",
  "Haripur",
  "Timergara",
  "Karak",

  // Balochistan Cities
  "Gwadar",
  "Khuzdar",
  "Turbat",
  "Chaman",
  "Dera Murad Jamali",
  "Sibi",
  "Zhob",
  "Loralai",

  // Azad Kashmir Cities
  "Muzaffarabad",
  "Mirpur",
  "Kotli",
  "Rawalakot",
  "Bagh",

  // Gilgit-Baltistan Cities
  "Gilgit",
  "Skardu",
  "Hunza",
  "Ghanche",
  "Chilas",
];

/**
 * Get cities grouped by province
 */
export const CITIES_BY_PROVINCE = {
  Punjab: [
    "Lahore",
    "Faisalabad",
    "Rawalpindi",
    "Multan",
    "Gujranwala",
    "Sialkot",
    "Bahawalpur",
    "Sargodha",
    "Sheikhupura",
    "Jhang",
    "Rahim Yar Khan",
    "Gujrat",
    "Kasur",
    "Sahiwal",
    "Okara",
    "Dera Ghazi Khan",
    "Chiniot",
    "Jhelum",
    "Khanewal",
    "Hafizabad",
    "Muzaffargarh",
    "Mandi Bahauddin",
    "Pakpattan",
    "Khushab",
    "Daska",
  ],
  Sindh: [
    "Karachi",
    "Hyderabad",
    "Sukkur",
    "Larkana",
    "Mirpurkhas",
    "Nawabshah",
    "Shikarpur",
    "Jacobabad",
    "Khairpur",
    "Dadu",
    "Badin",
    "Umerkot",
    "Thatta",
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar",
    "Mardan",
    "Abbottabad",
    "Mansehra",
    "Swat",
    "Mingora",
    "Dera Ismail Khan",
    "Bannu",
    "Kohat",
    "Charsadda",
    "Nowshera",
    "Swabi",
    "Haripur",
  ],
  Balochistan: [
    "Quetta",
    "Gwadar",
    "Khuzdar",
    "Turbat",
    "Chaman",
    "Dera Murad Jamali",
    "Sibi",
    "Zhob",
  ],
  Islamabad: ["Islamabad", "Rawalpindi"],
  "Azad Kashmir": ["Muzaffarabad", "Mirpur", "Kotli", "Rawalakot", "Bagh"],
  "Gilgit-Baltistan": ["Gilgit", "Skardu", "Hunza", "Ghanche", "Chilas"],
};

/**
 * Search cities by name (case-insensitive)
 * @param {string} query - Search query
 * @returns {Array} - Matching cities
 */
export function searchCities(query) {
  if (!query) return PAKISTANI_CITIES;

  const lowerQuery = query.toLowerCase();
  return PAKISTANI_CITIES.filter((city) =>
    city.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Validate if city exists in list
 * @param {string} city - City name to validate
 * @returns {boolean} - True if valid city
 */
export function isValidCity(city) {
  if (!city) return false;
  return PAKISTANI_CITIES.some(
    (c) => c.toLowerCase() === city.toLowerCase().trim()
  );
}
