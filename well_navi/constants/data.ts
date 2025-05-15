export const tamilNaduDistricts = [
  "Ariyalur",
  // ...existing districts...
];

export const casteCategories = [
  "BC", "MBC", "SC", "ST", "OBC", "FC", "DNC"
];

export const religionCategories = [
  "Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Others"
];

export const educationLevels = [
  "Diploma/ITI", "Undergraduate (UG)", "Postgraduate (PG)", "Others"
];

export const employmentStatus = [
  "Government Organization", "Private Organization", "Self Employed", "Not Applicable"
];

export const indianStates = ["Tamil Nadu"];

export const graduationYears = Array.from(
  { length: new Date().getFullYear() - 1980 + 1 },
  (_, i) => (1980 + i).toString()
).reverse();

export const occupationsList = [
  "Government Employee",
  // ...existing occupations...
];
