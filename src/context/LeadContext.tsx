
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";

export interface CompanyOption {
  id: string;
  name: string;
}

export interface InitialFormData {
  leadNo: string;
  date: string;
  state: string;
  place: string;
  employeeName: string;
}

export interface DetailedFormData extends InitialFormData {
  companyName: string;
  newCompanyName?: string;
  customerDetails: string;
  fieldObservation: string;
  discussion: string;
  insights: string;
  remarks: string;
  businessPotential: string;
}

interface LeadContextType {
  getNextLeadNumber: () => string;
  saveInitialForm: (data: InitialFormData) => void;
  currentLeadData: InitialFormData | null;
  saveDetailedForm: (data: DetailedFormData) => void;
  getAllLeads: () => DetailedFormData[];
  getLeadById: (leadNo: string) => DetailedFormData | undefined;
  updateLead: (data: DetailedFormData) => void;
  deleteLead: (leadNo: string) => void;
  getCompanyOptions: () => CompanyOption[];
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [currentLeadData, setCurrentLeadData] = useState<InitialFormData | null>(null);

  // Return all leads from localStorage
  const getAllLeads = (): DetailedFormData[] => {
    try {
      return JSON.parse(localStorage.getItem("leads") || "[]");
    } catch (error) {
      console.error("Error getting leads:", error);
      return [];
    }
  };

  // Generate next lead number
  const getNextLeadNumber = (): string => {
    const leads = getAllLeads();
    const nextNumber = leads.length + 1;
    return `LEAD-${String(nextNumber).padStart(3, "0")}`;
  };

  // Save initial form data
  const saveInitialForm = (data: InitialFormData) => {
    setCurrentLeadData(data);
  };

  // Save detailed form data
  const saveDetailedForm = (data: DetailedFormData) => {
    try {
      const leads = getAllLeads();
      
      // Check if lead already exists
      const existingLeadIndex = leads.findIndex(lead => lead.leadNo === data.leadNo);
      
      if (existingLeadIndex >= 0) {
        // Update existing lead
        leads[existingLeadIndex] = data;
      } else {
        // Add new lead
        leads.push(data);
      }
      
      localStorage.setItem("leads", JSON.stringify(leads));
      toast.success("Lead saved successfully!");
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Failed to save lead. Please try again.");
    }
  };

  // Get lead by ID
  const getLeadById = (leadNo: string): DetailedFormData | undefined => {
    const leads = getAllLeads();
    return leads.find(lead => lead.leadNo === leadNo);
  };

  // Update lead
  const updateLead = (data: DetailedFormData) => {
    try {
      const leads = getAllLeads();
      const index = leads.findIndex(lead => lead.leadNo === data.leadNo);
      
      if (index !== -1) {
        leads[index] = data;
        localStorage.setItem("leads", JSON.stringify(leads));
        toast.success("Lead updated successfully!");
      } else {
        toast.error("Lead not found!");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead. Please try again.");
    }
  };

  // Delete lead
  const deleteLead = (leadNo: string) => {
    try {
      const leads = getAllLeads().filter(lead => lead.leadNo !== leadNo);
      localStorage.setItem("leads", JSON.stringify(leads));
      toast.success("Lead deleted successfully!");
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead. Please try again.");
    }
  };

  // Get unique company options from leads
  const getCompanyOptions = (): CompanyOption[] => {
    const leads = getAllLeads();
    const companies = new Map<string, CompanyOption>();
    
    leads.forEach(lead => {
      const companyName = lead.newCompanyName || lead.companyName;
      if (companyName && !companies.has(companyName)) {
        companies.set(companyName, { id: companyName, name: companyName });
      }
    });
    
    return Array.from(companies.values());
  };

  return (
    <LeadContext.Provider 
      value={{ 
        getNextLeadNumber,
        saveInitialForm,
        currentLeadData,
        saveDetailedForm,
        getAllLeads,
        getLeadById,
        updateLead,
        deleteLead,
        getCompanyOptions
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export const useLead = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error("useLead must be used within a LeadProvider");
  }
  return context;
};
