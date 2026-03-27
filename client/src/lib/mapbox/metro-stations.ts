// Metro stations data for major Indian cities
// Expanded with recent line extensions (2024-2026)
export interface MetroStation {
  name: string;
  lat: number;
  lng: number;
  line?: string;
  city: string;
}

// ==========================================
// BANGALORE (Namma Metro)
// ==========================================
export const BANGALORE_METRO_STATIONS: MetroStation[] = [
  // Purple Line (East-West: Whitefield to Challaghatta)
  {
    name: "Whitefield (Kadugodi)",
    lat: 12.9965,
    lng: 77.761,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Hopefarm Channasandra",
    lat: 12.984,
    lng: 77.7505,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Garudacharapalya",
    lat: 12.986,
    lng: 77.7015,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "KR Puram",
    lat: 13.0035,
    lng: 77.6738,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Baiyappanahalli",
    lat: 12.9887,
    lng: 77.6474,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Indiranagar",
    lat: 12.9784,
    lng: 77.6408,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Halasuru",
    lat: 12.9785,
    lng: 77.6252,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Trinity",
    lat: 12.9826,
    lng: 77.6242,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "MG Road",
    lat: 12.9756,
    lng: 77.6075,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Cubbon Park",
    lat: 12.9779,
    lng: 77.5919,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Vidhana Soudha",
    lat: 12.9795,
    lng: 77.5905,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Kempegowda (Majestic)",
    lat: 12.9762,
    lng: 77.5715,
    line: "Purple/Green",
    city: "Bangalore",
  },
  {
    name: "Vijayanagar",
    lat: 12.9719,
    lng: 77.5348,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Mysore Road",
    lat: 12.9475,
    lng: 77.5332,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Kengeri",
    lat: 12.915,
    lng: 77.4839,
    line: "Purple",
    city: "Bangalore",
  },
  {
    name: "Challaghatta",
    lat: 12.909,
    lng: 77.4725,
    line: "Purple",
    city: "Bangalore",
  },

  // Green Line (North-South: Madavara to Silk Institute)
  {
    name: "Nagasandra",
    lat: 13.0475,
    lng: 77.499,
    line: "Green",
    city: "Bangalore",
  },
  {
    name: "Peenya",
    lat: 13.0285,
    lng: 77.536,
    line: "Green",
    city: "Bangalore",
  },
  {
    name: "Yeshwanthpur",
    lat: 13.0232,
    lng: 77.5498,
    line: "Green",
    city: "Bangalore",
  },
  {
    name: "Mantri Square Sampige Road",
    lat: 12.9904,
    lng: 77.5705,
    line: "Green",
    city: "Bangalore",
  },
  {
    name: "National College",
    lat: 12.9515,
    lng: 77.5732,
    line: "Green",
    city: "Bangalore",
  },
  {
    name: "Lalbagh",
    lat: 12.9458,
    lng: 77.5794,
    line: "Green",
    city: "Bangalore",
  },
  {
    name: "Jayanagar",
    lat: 12.9345,
    lng: 77.5853,
    line: "Green",
    city: "Bangalore",
  },
  {
    name: "RV Road",
    lat: 12.9214,
    lng: 77.58,
    line: "Green/Yellow",
    city: "Bangalore",
  },
  {
    name: "Banashankari",
    lat: 12.9257,
    lng: 77.5629,
    line: "Green",
    city: "Bangalore",
  },
  {
    name: "Yelachenahalli",
    lat: 12.9007,
    lng: 77.5613,
    line: "Green",
    city: "Bangalore",
  },
  {
    name: "Silk Institute",
    lat: 12.8625,
    lng: 77.534,
    line: "Green",
    city: "Bangalore",
  },

  // Yellow Line (RV Road to Bommasandra)
  {
    name: "Central Silk Board",
    lat: 12.9175,
    lng: 77.6225,
    line: "Yellow",
    city: "Bangalore",
  },
  {
    name: "BTM Layout",
    lat: 12.9152,
    lng: 77.6063,
    line: "Yellow",
    city: "Bangalore",
  },
  {
    name: "HSR Layout",
    lat: 12.91,
    lng: 77.635,
    line: "Yellow",
    city: "Bangalore",
  },
  {
    name: "Electronic City",
    lat: 12.848,
    lng: 77.6685,
    line: "Yellow",
    city: "Bangalore",
  },
  {
    name: "Bommasandra",
    lat: 12.8155,
    lng: 77.6815,
    line: "Yellow",
    city: "Bangalore",
  },
];

// ==========================================
// DELHI NCR (DMRC)
// ==========================================
export const DELHI_METRO_STATIONS: MetroStation[] = [
  // Yellow Line
  {
    name: "Vishwavidyalaya (DU)",
    lat: 28.6943,
    lng: 77.2144,
    line: "Yellow",
    city: "Delhi",
  },
  {
    name: "Kashmere Gate",
    lat: 28.6665,
    lng: 77.2285,
    line: "Yellow/Red/Violet",
    city: "Delhi",
  },
  {
    name: "New Delhi",
    lat: 28.6426,
    lng: 77.2201,
    line: "Yellow/Airport",
    city: "Delhi",
  },
  {
    name: "Rajiv Chowk (CP)",
    lat: 28.6328,
    lng: 77.2193,
    line: "Yellow/Blue",
    city: "Delhi",
  },
  {
    name: "INA",
    lat: 28.5746,
    lng: 77.2104,
    line: "Yellow/Pink",
    city: "Delhi",
  },
  {
    name: "Hauz Khas",
    lat: 28.5484,
    lng: 77.2066,
    line: "Yellow/Magenta",
    city: "Delhi",
  },
  { name: "Saket", lat: 28.5278, lng: 77.2082, line: "Yellow", city: "Delhi" },
  {
    name: "Qutub Minar",
    lat: 28.5211,
    lng: 77.1869,
    line: "Yellow",
    city: "Delhi",
  },
  {
    name: "MG Road",
    lat: 28.4795,
    lng: 77.0801,
    line: "Yellow",
    city: "Gurgaon",
  },
  {
    name: "Millennium City Centre",
    lat: 28.4593,
    lng: 77.0724,
    line: "Yellow",
    city: "Gurgaon",
  },

  // Blue Line
  {
    name: "Dwarka Sector 21",
    lat: 28.5523,
    lng: 77.0583,
    line: "Blue/Airport",
    city: "Delhi",
  },
  {
    name: "Janakpuri West",
    lat: 28.6295,
    lng: 77.0776,
    line: "Blue/Magenta",
    city: "Delhi",
  },
  {
    name: "Rajouri Garden",
    lat: 28.6493,
    lng: 77.1215,
    line: "Blue/Pink",
    city: "Delhi",
  },
  {
    name: "Karol Bagh",
    lat: 28.6441,
    lng: 77.1895,
    line: "Blue",
    city: "Delhi",
  },
  {
    name: "Mandi House",
    lat: 28.6258,
    lng: 77.2343,
    line: "Blue/Violet",
    city: "Delhi",
  },
  {
    name: "Mayur Vihar 1",
    lat: 28.6042,
    lng: 77.2893,
    line: "Blue/Pink",
    city: "Delhi",
  },
  {
    name: "Noida Sector 18",
    lat: 28.5706,
    lng: 77.3204,
    line: "Blue",
    city: "Noida",
  },
  {
    name: "Botanical Garden",
    lat: 28.564,
    lng: 77.3206,
    line: "Blue/Magenta",
    city: "Noida",
  },
  {
    name: "Noida Electronic City",
    lat: 28.6294,
    lng: 77.3752,
    line: "Blue",
    city: "Noida",
  },

  // Pink / Magenta / Violet Interchanges
  {
    name: "Lajpat Nagar",
    lat: 28.5678,
    lng: 77.2433,
    line: "Pink/Violet",
    city: "Delhi",
  },
  {
    name: "Kalkaji Mandir",
    lat: 28.5393,
    lng: 77.2625,
    line: "Violet/Magenta",
    city: "Delhi",
  },
];

// ==========================================
// MUMBAI (Maha Mumbai Metro)
// ==========================================
export const MUMBAI_METRO_STATIONS: MetroStation[] = [
  // Line 1 (Blue - East/West)
  { name: "Versova", lat: 19.1344, lng: 72.8259, line: "Blue", city: "Mumbai" },
  { name: "Andheri", lat: 19.1197, lng: 72.8478, line: "Blue", city: "Mumbai" },
  {
    name: "WEH (Western Express Highway)",
    lat: 19.1158,
    lng: 72.8542,
    line: "Blue",
    city: "Mumbai",
  },
  {
    name: "Saki Naka",
    lat: 19.103,
    lng: 72.8805,
    line: "Blue",
    city: "Mumbai",
  },
  {
    name: "Ghatkopar",
    lat: 19.0898,
    lng: 72.9128,
    line: "Blue",
    city: "Mumbai",
  },

  // Line 2A (Yellow - Western Suburbs)
  {
    name: "Dahisar East",
    lat: 19.2562,
    lng: 72.8658,
    line: "Yellow/Red",
    city: "Mumbai",
  },
  {
    name: "Borivali West",
    lat: 19.2315,
    lng: 72.8465,
    line: "Yellow",
    city: "Mumbai",
  },
  {
    name: "Kandivali West",
    lat: 19.2085,
    lng: 72.838,
    line: "Yellow",
    city: "Mumbai",
  },
  {
    name: "Andheri West",
    lat: 19.135,
    lng: 72.8335,
    line: "Yellow",
    city: "Mumbai",
  },

  // Line 7 (Red - Highway corridor)
  {
    name: "Goregaon East",
    lat: 19.165,
    lng: 72.855,
    line: "Red",
    city: "Mumbai",
  },
  {
    name: "Malad East",
    lat: 19.1865,
    lng: 72.8585,
    line: "Red",
    city: "Mumbai",
  },
  {
    name: "Gundavali (Andheri East)",
    lat: 19.1155,
    lng: 72.854,
    line: "Red/Blue",
    city: "Mumbai",
  },

  // Line 3 (Aqua - Underground)
  {
    name: "Aarey JVLR",
    lat: 19.1415,
    lng: 72.872,
    line: "Aqua",
    city: "Mumbai",
  },
  { name: "SEEPZ", lat: 19.122, lng: 72.8765, line: "Aqua", city: "Mumbai" },
  {
    name: "BKC (Bandra Kurla Complex)",
    lat: 19.062,
    lng: 72.864,
    line: "Aqua",
    city: "Mumbai",
  },
];

// ==========================================
// HYDERABAD (Hyderabad Metro)
// ==========================================
export const HYDERABAD_METRO_STATIONS: MetroStation[] = [
  // Red Line
  {
    name: "Miyapur",
    lat: 17.4968,
    lng: 78.3614,
    line: "Red",
    city: "Hyderabad",
  },
  {
    name: "KPHB Colony",
    lat: 17.4842,
    lng: 78.389,
    line: "Red",
    city: "Hyderabad",
  },
  {
    name: "Ameerpet",
    lat: 17.4357,
    lng: 78.4446,
    line: "Red/Blue",
    city: "Hyderabad",
  },
  {
    name: "MG Bus Station",
    lat: 17.3789,
    lng: 78.4813,
    line: "Red/Green",
    city: "Hyderabad",
  },
  {
    name: "LB Nagar",
    lat: 17.3465,
    lng: 78.5521,
    line: "Red",
    city: "Hyderabad",
  },

  // Blue Line
  {
    name: "Raidurg (HITEC City)",
    lat: 17.441,
    lng: 78.3813,
    line: "Blue",
    city: "Hyderabad",
  },
  {
    name: "HITEC City",
    lat: 17.4478,
    lng: 78.3792,
    line: "Blue",
    city: "Hyderabad",
  },
  {
    name: "Jubilee Hills Check Post",
    lat: 17.4304,
    lng: 78.4079,
    line: "Blue",
    city: "Hyderabad",
  },
  {
    name: "Secunderabad East",
    lat: 17.4332,
    lng: 78.502,
    line: "Blue",
    city: "Hyderabad",
  },
  {
    name: "Nagole",
    lat: 17.3804,
    lng: 78.5594,
    line: "Blue",
    city: "Hyderabad",
  },
];

// ==========================================
// HELPER FUNCTION
// ==========================================
export const getMetroStationsByCity = (city: string): MetroStation[] => {
  if (!city) return [];

  const cityLower = city.toLowerCase();

  if (cityLower.includes("bangalore") || cityLower.includes("bengaluru")) {
    return BANGALORE_METRO_STATIONS;
  }
  if (
    cityLower.includes("delhi") ||
    cityLower.includes("noida") ||
    cityLower.includes("gurgaon") ||
    cityLower.includes("gurugram")
  ) {
    return DELHI_METRO_STATIONS;
  }
  if (cityLower.includes("mumbai")) {
    return MUMBAI_METRO_STATIONS;
  }
  if (cityLower.includes("hyderabad")) {
    return HYDERABAD_METRO_STATIONS;
  }

  return []; // Return empty for unsupported cities
};
