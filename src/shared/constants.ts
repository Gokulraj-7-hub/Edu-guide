// Single source of truth for shared constants across the app

export const DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
  "Trichy", "Vellore", "Viluppuram", "Virudhunagar"
] as const;

export const COLLEGE_TYPES = ['Government', 'Aided', 'Self-Financing'] as const;

export const COLLEGE_CATEGORIES = [
  'Engineering',
  'Arts and Science',
  'Medical',
  'Pharmacy',
  'Nursing',
  'Dental',
  'Polytechnic',
  'Physiotherapy',
  'Education (B.Ed)',
] as const;

// Mapping of college category to the degree IDs it offers
export const CATEGORY_DEGREE_MAP: Record<string, string[]> = {
  'Engineering': ['d1', 'd5'],
  'Arts and Science': ['d2', 'd3', 'd4'],
  'Medical': ['d6'],
  'Pharmacy': ['d7'],
  'Nursing': ['d8'],
  'Physiotherapy': ['d9'],
  'Education (B.Ed)': ['d10'],
  'Polytechnic': ['d11'],
  'Dental': ['d12'],
};
