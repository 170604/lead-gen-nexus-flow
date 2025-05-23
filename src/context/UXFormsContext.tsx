
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { FormValues, UXFormSubmission } from "@/pages/fields/UXForm/types";

interface UXFormsContextType {
  submissions: UXFormSubmission[];
  saveFormSubmission: (formType: string, leadId: string, formData: FormValues) => void;
  getSubmissionsByLeadId: (leadId: string) => UXFormSubmission[];
  getSubmissionsByFormType: (formType: string) => UXFormSubmission[];
  fetchSubmissions: () => void;
}

const UXFormsContext = createContext<UXFormsContextType | undefined>(undefined);

// Simulate a shared storage key for demo purposes
const SHARED_STORAGE_KEY = "shared_ux_form_submissions";

export function UXFormsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<UXFormSubmission[]>([]);

  // Load submissions from localStorage on initial render
  const fetchSubmissions = () => {
    try {
      // For demonstration purposes, we'll use localStorage
      // In a real application, this would be an API call to a database
      const storedSubmissions = localStorage.getItem(SHARED_STORAGE_KEY);
      
      if (storedSubmissions) {
        const parsedData = JSON.parse(storedSubmissions);
        // Convert ISO date strings back to Date objects
        const submissionsWithDates = parsedData.map((sub: any) => ({
          ...sub,
          submittedAt: new Date(sub.submittedAt)
        }));
        setSubmissions(submissionsWithDates);
        console.log("Fetched submissions:", submissionsWithDates);
      }
    } catch (error) {
      console.error("Error fetching UX form submissions:", error);
    }
  };

  // Load submissions on initial render
  useEffect(() => {
    fetchSubmissions();
    
    // Set up an interval to refresh submissions periodically (every 30 seconds)
    // This is a workaround for the demo to simulate real-time updates
    const intervalId = setInterval(fetchSubmissions, 30000);
    
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Save a new form submission
  const saveFormSubmission = (formType: string, leadId: string, formData: FormValues) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const username = currentUser?.username || "Anonymous";
      
      const newSubmission: UXFormSubmission = {
        ...formData,
        id: `form-${Date.now()}`,
        formType,
        leadId,
        submittedBy: username,
        submittedAt: new Date()
      };
      
      // First, get the latest submissions from storage
      const storedSubmissions = localStorage.getItem(SHARED_STORAGE_KEY);
      let existingSubmissions: UXFormSubmission[] = [];
      
      if (storedSubmissions) {
        const parsedData = JSON.parse(storedSubmissions);
        existingSubmissions = parsedData.map((sub: any) => ({
          ...sub,
          submittedAt: new Date(sub.submittedAt)
        }));
      }
      
      // Add the new submission
      const updatedSubmissions = [...existingSubmissions, newSubmission];
      
      // Update state
      setSubmissions(updatedSubmissions);
      
      // Store in the shared storage location with date converted to ISO string
      const submissionsForStorage = updatedSubmissions.map(sub => ({
        ...sub,
        submittedAt: sub.submittedAt.toISOString()
      }));
      
      localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(submissionsForStorage));
      
      toast.success("Form submitted and saved successfully!");
    } catch (error) {
      console.error("Error saving form submission:", error);
      toast.error("Failed to save form submission. Please try again.");
    }
  };

  // Get submissions by lead ID
  const getSubmissionsByLeadId = (leadId: string): UXFormSubmission[] => {
    return submissions.filter(sub => sub.leadId === leadId);
  };

  // Get submissions by form type
  const getSubmissionsByFormType = (formType: string): UXFormSubmission[] => {
    return submissions.filter(sub => sub.formType === formType);
  };

  return (
    <UXFormsContext.Provider 
      value={{ 
        submissions,
        saveFormSubmission,
        getSubmissionsByLeadId,
        getSubmissionsByFormType,
        fetchSubmissions
      }}
    >
      {children}
    </UXFormsContext.Provider>
  );
}

export const useUXForms = () => {
  const context = useContext(UXFormsContext);
  if (context === undefined) {
    throw new Error("useUXForms must be used within a UXFormsProvider");
  }
  return context;
};
