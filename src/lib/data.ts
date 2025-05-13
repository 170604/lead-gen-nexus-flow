
// List of Indian states and union territories
export const indianStates = [
  "Andhra Pradesh", 
  "Arunachal Pradesh", 
  "Assam", 
  "Bihar", 
  "Chhattisgarh", 
  "Goa", 
  "Gujarat", 
  "Haryana", 
  "Himachal Pradesh", 
  "Jharkhand", 
  "Karnataka", 
  "Kerala", 
  "Madhya Pradesh", 
  "Maharashtra", 
  "Manipur", 
  "Meghalaya", 
  "Mizoram", 
  "Nagaland", 
  "Odisha", 
  "Punjab", 
  "Rajasthan", 
  "Sikkim", 
  "Tamil Nadu", 
  "Telangana", 
  "Tripura", 
  "Uttar Pradesh", 
  "Uttarakhand", 
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands", 
  "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", 
  "Jammu and Kashmir", 
  "Ladakh", 
  "Lakshadweep", 
  "Puducherry"
];

// Dropdown options for Factory UX forms
export const headingOptions = [
  "Production", 
  "Safety", 
  "Inventory", 
  "Quality", 
  "Maintenance",
  "Operations",
  "Training"
];

export const subheadingOptions = [
  "Audit", 
  "Review", 
  "Assessment", 
  "Inspection", 
  "Evaluation", 
  "Analysis"
];

export const auditCategoryOptions = [
  "Compliance", 
  "Operational", 
  "Safety", 
  "Environmental", 
  "Quality", 
  "Financial"
];

export const materialCodeOptions = [
  "MAT001", 
  "MAT002", 
  "MAT003", 
  "MAT004", 
  "MAT005", 
  "MAT006"
];

// Dropdown options for Factory OS Knowledge form
export const subjectOptions = [
  "Training", 
  "Consulting", 
  "Support", 
  "Implementation", 
  "Audit", 
  "Review"
];

// Format date as DD-MM-YYYY
export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Get today's date in DD-MM-YYYY format
export const getTodayDate = (): string => {
  return formatDate(new Date());
};
