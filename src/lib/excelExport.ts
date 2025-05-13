
// This is a simplified version of Excel export functionality.
// In a real implementation, you would use a proper library like xlsx or filesaver.js

import { DetailedFormData } from "@/context/LeadContext";

// Helper function to convert leads data to CSV format
const convertToCSV = (leads: DetailedFormData[]): string => {
  const headers = [
    "Lead No", 
    "Date", 
    "State", 
    "Place", 
    "Employee Name", 
    "Company Name", 
    "Customer Details", 
    "Field Observation", 
    "Discussion", 
    "Insights", 
    "Remarks", 
    "Business Potential Value (in CR)"
  ];
  
  const rows = leads.map(lead => [
    lead.leadNo,
    lead.date,
    lead.state,
    lead.place,
    lead.employeeName,
    lead.newCompanyName || lead.companyName,
    lead.customerDetails,
    lead.fieldObservation,
    lead.discussion,
    lead.insights,
    lead.remarks,
    lead.businessPotential
  ]);
  
  return [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
};

// Export single lead as Excel/CSV file
export const exportLeadToExcel = (lead: DetailedFormData): void => {
  const csv = convertToCSV([lead]);
  downloadCSV(csv, `Lead_${lead.leadNo}.csv`);
};

// Export all leads as Excel/CSV file
export const exportAllLeadsToExcel = (leads: DetailedFormData[]): void => {
  const csv = convertToCSV(leads);
  downloadCSV(csv, `All_Leads_${new Date().toISOString().split('T')[0]}.csv`);
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
