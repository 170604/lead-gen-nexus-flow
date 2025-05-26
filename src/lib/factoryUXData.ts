
// Factory UX form data configuration

// Type definitions to ensure consistency
interface FormOptions {
  headingOptions: string[];
  getSubheadingOptions?: (heading: string) => string[];
  getSubheading?: (heading: string) => string;
  auditCategory?: string[];
  auditCategoryOptions?: string[];
  getAuditCategory?: (heading: string) => string;
  materialCodeOptions?: string[];
}

// Inventory Matrix Page options
export const inventoryMatrixOptions: FormOptions = {
  headingOptions: [
    "Rack ID",
    "Warehouse Layout",
    "Warehouse Load Capacity",
    "Experience Center",
    "QR Load of Material Tracking"
  ],
  getSubheading: (heading: string) => heading,
  getAuditCategory: () => "Process Audit",
  materialCodeOptions: ["E-327", "E-627", "E-425-P"]
};

// Change RX Page options
export const changeRxOptions: FormOptions = {
  headingOptions: [
    "LOGO",
    "Milestones",
    "Safety Park",
    "Experience",
    "DOJO Board",
    "Wall Graphics",
    "Glass Graphics",
    "Decorative Sign",
    "Policy",
    "Large Customized",
    "Employee Engagement Signs",
    "Employee of the Month",
    "Leadership Communication",
    "New Initiatives",
    "Motivational Signs",
    "Employee Engagement"
  ],
  getSubheading: (heading: string) => heading,
  getAuditCategory: (heading: string) => {
    const aestheticHeadings = ["LOGO", "Wall Graphics", "Glass Graphics", "Decorative Sign", "Employee Engagement Signs", "Employee of the Month", "Motivational Signs"];
    return aestheticHeadings.includes(heading) ? "Aesthetic Audit" : "Periphery";
  },
  materialCodeOptions: [
    "E-318",
    "E-323",
    "E-314",
    "E-215",
    "E-421",
    "E-423-A4",
    "E-423-A3",
    "E-622-B"
  ]
};

// Matrix Display Page options
export const matrixDisplayOptions: FormOptions = {
  headingOptions: [
    "GMP Score Board",
    "LTIFER Display",
    "DWN",
    "KPIs",
    "Q Cube",
    "PDSCQM",
    "HR Corner",
    "R&R"
  ],
  getSubheading: (heading: string) => heading,
  getAuditCategory: (heading: string) => {
    return heading === "LTIFER Display" ? "Safety Audit" : "Process Audit";
  },
  materialCodeOptions: [
    "E-314",
    "E-622-B",
    "E-421",
    "E-421-M",
    "E-318",
    "E-412-P",
    "E-323"
  ]
};

// Productive Workplace Page options
export const productiveWorkplaceOptions: FormOptions = {
  headingOptions: [
    "Pipe Marking",
    "Valve/Pressure Joints",
    "Visual SOP",
    "SOP",
    "Know Your Equipment",
    "Process Flow Diagram",
    "5S Floor Marking",
    "Process Checklist/Attention Point",
    "Waste Management Instruction",
    "Line Diagram",
    "OPL",
    "TPM",
    "AM",
    "I Maintain This Area",
    "KANBAN",
    "KAIZEN", 
    "CLIT Display",
    "Lubrication Guide"
  ],
  getSubheading: (heading: string) => {
    const mapping: Record<string, string> = {
      "Pipe Marking": "Pipe Marking",
      "Valve/Pressure Joints": "Energy Tag",
      "Visual SOP": "Visual SOP",
      "Know Your Equipment": "Know Your Equipment",
      "Process Flow Diagram": "P&ID"
    };
    return mapping[heading] || heading;
  },
  getAuditCategory: () => "Process Audit",
  materialCodeOptions: ["E-314", "E-622-P", "E-421-P", "E-421"]
};

// Safe Workplace Page options
export const safeWorkplaceOptions: FormOptions = {
  headingOptions: [
    "Pollution Control Display",
    "DO's & Don'ts",
    "Large Customized Safety Signage",
    "Points of Hazards",
    "Emergency Evacuation Plans",
    "Emergency Response Team",
    "SIS",
    "GHS",
    "GHS Label",
    "NFPA",
    "Visual SDS",
    "Q Sign",
    "Single Line Diagram",
    "Safety Static Display",
    "Life Saving Rule",
    "IRC",
    "PPE Matrix"
  ],
  getSubheading: (heading: string) => heading,
  getAuditCategory: (heading: string) => {
    const safetyHeadings = ["Large Customized Safety Signage", "Points of Hazards", "SIS", "GHS", "GHS Label", "NFPA", "Visual SDS", "Safety Static Display", "Life Saving Rule", "IRC", "PPE Matrix"];
    const evacuationHeadings = ["Emergency Evacuation Plans", "Emergency Response Team"];
    const processHeadings = ["Pollution Control Display", "Single Line Diagram", "Q Sign"];
    
    if (safetyHeadings.includes(heading)) return "Safety Audit";
    if (evacuationHeadings.includes(heading)) return "Emergency Evacuation Audit";
    if (processHeadings.includes(heading)) return "Process Audit";
    return "Periphery";
  }
};

// Organized Workplace Page options
export const organizedWorkplaceOptions: FormOptions = {
  headingOptions: [
    "Pylons",
    "Plant Layouts",
    "Indoor Navigation",
    "Equipment ID",
    "Large Navigation Signs"
  ],
  getSubheadingOptions: (heading: string) => {
    switch (heading) {
      case "Pylons":
        return [
          "Navigation Gateway Pylon",
          "Navigation Jumbo Pylon",
          "Destination Pylon",
          "Wayfinding Pylon",
          "Others"
        ];
      case "Plant Layouts":
        return [
          "General Plant Layout",
          "Traffic Layout",
          "GMP Layout",
          "Housekeeping Layout",
          "Fire Layout"
        ];
      case "Indoor Navigation":
        return ["Desk ID", "Section ID", "Cabin", "Flow Directory"];
      case "Equipment ID":
      case "Large Navigation Signs":
      default:
        return [heading];
    }
  },
  getSubheading: (heading: string) => heading,
  getAuditCategory: (heading: string) => {
    const peripheryHeadings = ["Pylons", "Large Navigation Signs", "Indoor Navigation"];
    return peripheryHeadings.includes(heading) ? "Periphery" : "Process Audit";
  }
};

// Helper function to get options based on formType
export const getFormOptionsByType = (formType: string): FormOptions | null => {
  switch (formType) {
    case "inventory-matrix":
      return inventoryMatrixOptions;
    case "change-rx":
      return changeRxOptions;
    case "matrix-display":
      return matrixDisplayOptions;
    case "productive-workplace":
      return productiveWorkplaceOptions;
    case "safe-workplace":
      return safeWorkplaceOptions;
    case "organized-workplace":
      return organizedWorkplaceOptions;
    default:
      return null;
  }
};

// Format form type to display name
export const formatFormType = (formType: string): string => {
  return formType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
