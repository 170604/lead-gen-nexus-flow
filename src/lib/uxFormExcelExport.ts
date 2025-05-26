
import { FormValues } from "@/pages/fields/UXForm/types";
import { formatFormType } from "./factoryUXData";

// Helper function to convert form data to CSV format
const convertFormToCSV = (formData: FormValues, formType: string, leadId: string): string => {
  const headers = [
    "Form Type",
    "Lead ID", 
    "Heading", 
    "Sub-heading", 
    "Audit Category", 
    "Material Code", 
    "HSN Code", 
    "Height", 
    "UOM", 
    "Quantity", 
    "Price", 
    "Total Amount"
  ];
  
  const row = [
    formatFormType(formType),
    leadId,
    formData.heading,
    formData.subheading,
    formData.auditCategory,
    formData.materialCode,
    formData.hsnCode,
    formData.height,
    formData.uom,
    formData.quantity,
    formData.price,
    formData.totalAmount
  ];
  
  return [
    headers.join(','),
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ].join('\n');
};

// Export form data as Excel/CSV file
export const exportFormToExcel = (formData: FormValues, formType: string, leadId: string): void => {
  const csv = convertFormToCSV(formData, formType, leadId);
  const fileName = `${formatFormType(formType)}_${leadId}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(csv, fileName);
};

// Helper function to trigger CSV download
const downloadCSV = (csv: string, fileName: string): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
