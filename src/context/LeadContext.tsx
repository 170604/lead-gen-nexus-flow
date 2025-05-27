
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  leadNo: string;
  date: string;
  state: string;
  place: string;
  employeeName: string;
  companyName?: string;
  newCompanyName?: string;
  businessPotential?: string;
  customerDetails?: string;
  fieldObservation?: string;
  discussion?: string;
  insights?: string;
  remarks?: string;
  submittedBy?: string;
  submittedAt?: Date;
}

// Export the type for external use
export interface DetailedFormData {
  leadNo: string;
  date: string;
  state: string;
  place: string;
  employeeName: string;
  companyName?: string;
  newCompanyName?: string;
  businessPotential?: string;
  customerDetails?: string;
  fieldObservation?: string;
  discussion?: string;
  insights?: string;
  remarks?: string;
  submittedBy?: string;
  submittedAt?: Date;
}

interface InitialFormData {
  leadNo: string;
  date: string;
  state: string;
  place: string;
  employeeName: string;
}

interface CompanyOption {
  id: string;
  name: string;
}

interface LeadContextType {
  leads: Lead[];
  currentForm: InitialFormData | null;
  currentLeadData: InitialFormData | null;
  saveInitialForm: (data: InitialFormData) => void;
  saveDetailedForm: (data: Partial<Lead>) => void;
  getAllLeads: () => Lead[];
  deleteLead: (leadNo: string) => void;
  fetchLeads: () => void;
  getNextLeadNumber: () => string;
  getCompanyOptions: () => CompanyOption[];
  getLeadById: (leadId: string) => Lead | undefined;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentForm, setCurrentForm] = useState<InitialFormData | null>(null);

  // Fetch leads from Supabase
  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('lead_forms')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        return;
      }

      const formattedLeads: Lead[] = data.map(lead => ({
        leadNo: lead.lead_no,
        date: lead.date,
        state: lead.state,
        place: lead.place,
        employeeName: lead.employee_name,
        companyName: lead.company_name || undefined,
        newCompanyName: lead.new_company_name || undefined,
        businessPotential: lead.business_potential || undefined,
        customerDetails: lead.customer_details || undefined,
        fieldObservation: lead.field_observation || undefined,
        discussion: lead.discussion || undefined,
        insights: lead.insights || undefined,
        remarks: lead.remarks || undefined,
        submittedBy: lead.submitted_by || undefined,
        submittedAt: new Date(lead.submitted_at)
      }));

      setLeads(formattedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Generate next lead number
  const getNextLeadNumber = (): string => {
    const leadCount = leads.length;
    return `LEAD-${String(leadCount + 1).padStart(3, '0')}`;
  };

  // Get company options from existing leads
  const getCompanyOptions = (): CompanyOption[] => {
    const companies = new Set<string>();
    leads.forEach(lead => {
      if (lead.companyName && lead.companyName !== "New") {
        companies.add(lead.companyName);
      }
      if (lead.newCompanyName) {
        companies.add(lead.newCompanyName);
      }
    });
    
    return Array.from(companies).map((name, index) => ({
      id: `company-${index}`,
      name
    }));
  };

  // Get lead by ID
  const getLeadById = (leadId: string): Lead | undefined => {
    return leads.find(lead => lead.leadNo === leadId);
  };

  const saveInitialForm = (data: InitialFormData) => {
    setCurrentForm(data);
    localStorage.setItem("currentForm", JSON.stringify(data));
  };

  const saveDetailedForm = async (data: Partial<Lead>) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const username = currentUser?.username || "Anonymous";
      
      if (!currentForm) {
        toast.error("No initial form data found");
        return;
      }

      const completeFormData = {
        ...currentForm,
        ...data
      };

      const { error } = await supabase
        .from('lead_forms')
        .insert([{
          lead_id: completeFormData.leadNo,
          lead_no: completeFormData.leadNo,
          date: completeFormData.date,
          state: completeFormData.state,
          place: completeFormData.place,
          employee_name: completeFormData.employeeName,
          company_name: completeFormData.companyName,
          new_company_name: completeFormData.newCompanyName,
          business_potential: completeFormData.businessPotential,
          customer_details: completeFormData.customerDetails,
          field_observation: completeFormData.fieldObservation,
          discussion: completeFormData.discussion,
          insights: completeFormData.insights,
          remarks: completeFormData.remarks,
          submitted_by: username
        }]);

      if (error) {
        console.error('Error saving lead:', error);
        toast.error('Failed to save lead. Please try again.');
        return;
      }

      await fetchLeads();
      setCurrentForm(null);
      localStorage.removeItem("currentForm");
      
      toast.success("Lead saved successfully!");
    } catch (error) {
      console.error("Error saving lead:", error);
      toast.error("Failed to save lead. Please try again.");
    }
  };

  const deleteLead = async (leadNo: string) => {
    try {
      const { error } = await supabase
        .from('lead_forms')
        .delete()
        .eq('lead_no', leadNo);

      if (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
        return;
      }

      await fetchLeads();
      toast.success("Lead deleted successfully");
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    }
  };

  const getAllLeads = () => leads;

  // Load current form from localStorage on init
  useEffect(() => {
    const savedForm = localStorage.getItem("currentForm");
    if (savedForm) {
      setCurrentForm(JSON.parse(savedForm));
    }
  }, []);

  return (
    <LeadContext.Provider 
      value={{ 
        leads, 
        currentForm,
        currentLeadData: currentForm,
        saveInitialForm, 
        saveDetailedForm, 
        getAllLeads, 
        deleteLead,
        fetchLeads,
        getNextLeadNumber,
        getCompanyOptions,
        getLeadById
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
