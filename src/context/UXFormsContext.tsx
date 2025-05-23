
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { FormValues } from "@/pages/fields/UXForm/types";

interface UXFormSubmission extends FormValues {
  id: string;
  formType: string;
  leadId: string;
  submittedBy: string;
  submittedAt: Date;
}

interface UXFormsContextType {
  submissions: UXFormSubmission[];
  saveFormSubmission: (formType: string, leadId: string, formData: FormValues) => void;
  getSubmissionsByLeadId: (leadId: string) => UXFormSubmission[];
  getSubmissionsByFormType: (formType: string) => UXFormSubmission[];
}

const UXFormsContext = createContext<UXFormsContextType | undefined>(undefined);

export function UXFormsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<UXFormSubmission[]>([]);

  // Load submissions from localStorage on initial render
  useEffect(() => {
    const storedSubmissions = localStorage.getItem("uxFormSubmissions");
    if (storedSubmissions) {
      try {
        const parsedData = JSON.parse(storedSubmissions);
        // Convert ISO date strings back to Date objects
        const submissionsWithDates = parsedData.map((sub: any) => ({
          ...sub,
          submittedAt: new Date(sub.submittedAt)
        }));
        setSubmissions(submissionsWithDates);
      } catch (error) {
        console.error("Error parsing stored UX form submissions:", error);
        localStorage.removeItem("uxFormSubmissions");
      }
    }
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
      
      const updatedSubmissions = [...submissions, newSubmission];
      setSubmissions(updatedSubmissions);
      
      // Store in localStorage with date converted to ISO string
      const submissionsForStorage = updatedSubmissions.map(sub => ({
        ...sub,
        submittedAt: sub.submittedAt.toISOString()
      }));
      localStorage.setItem("uxFormSubmissions", JSON.stringify(submissionsForStorage));
      
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
        getSubmissionsByFormType
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
