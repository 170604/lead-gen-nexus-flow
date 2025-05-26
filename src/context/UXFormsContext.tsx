
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/sonner";
import { FormValues, UXFormSubmission } from "@/pages/fields/UXForm/types";
import { supabase } from "@/integrations/supabase/client";

interface UXFormsContextType {
  submissions: UXFormSubmission[];
  saveFormSubmission: (formType: string, leadId: string, formData: FormValues) => void;
  getSubmissionsByLeadId: (leadId: string) => UXFormSubmission[];
  getSubmissionsByFormType: (formType: string) => UXFormSubmission[];
  fetchSubmissions: () => void;
  deleteSubmission: (submissionId: string) => Promise<void>;
}

const UXFormsContext = createContext<UXFormsContextType | undefined>(undefined);

export function UXFormsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<UXFormSubmission[]>([]);

  // Fetch submissions from Supabase
  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('ux_form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to fetch submissions');
        return;
      }

      // Convert the database format to our UXFormSubmission format
      const formattedSubmissions: UXFormSubmission[] = data.map(sub => ({
        id: sub.id,
        formType: sub.form_type,
        leadId: sub.lead_id,
        heading: sub.heading || '',
        subheading: sub.subheading || '',
        auditCategory: sub.audit_category || '',
        materialCode: sub.material_code || '',
        hsnCode: sub.hsn_code || '',
        height: sub.height || '',
        uom: sub.uom || '',
        quantity: sub.quantity || '',
        price: sub.price || '',
        totalAmount: sub.total_amount || '0',
        submittedBy: sub.submitted_by || 'Anonymous',
        submittedAt: new Date(sub.submitted_at || Date.now())
      }));

      setSubmissions(formattedSubmissions);
      console.log("Fetched submissions from Supabase:", formattedSubmissions);
    } catch (error) {
      console.error("Error fetching UX form submissions:", error);
      toast.error("Failed to fetch submissions");
    }
  };

  // Load submissions on initial render
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Save a new form submission to Supabase
  const saveFormSubmission = async (formType: string, leadId: string, formData: FormValues) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const username = currentUser?.username || "Anonymous";
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('ux_form_submissions')
        .insert([{
          form_type: formType,
          lead_id: leadId,
          heading: formData.heading,
          subheading: formData.subheading,
          audit_category: formData.auditCategory,
          material_code: formData.materialCode,
          hsn_code: formData.hsnCode,
          height: formData.height,
          uom: formData.uom,
          quantity: formData.quantity,
          price: formData.price,
          total_amount: formData.totalAmount,
          submitted_by: username
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving submission:', error);
        toast.error('Failed to save form submission. Please try again.');
        return;
      }

      // Refresh submissions to get the latest data
      await fetchSubmissions();
      
      toast.success("Form submitted and saved successfully!");
    } catch (error) {
      console.error("Error saving form submission:", error);
      toast.error("Failed to save form submission. Please try again.");
    }
  };

  // Delete a form submission
  const deleteSubmission = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('ux_form_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) {
        console.error('Error deleting submission:', error);
        toast.error('Failed to delete submission');
        return;
      }

      // Refresh submissions after deletion
      await fetchSubmissions();
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
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
        fetchSubmissions,
        deleteSubmission
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
