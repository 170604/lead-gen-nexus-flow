
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import FormFieldsGrid from "./FormFieldsGrid";
import { exportFormToExcel } from "@/lib/uxFormExcelExport";
import { Download } from "lucide-react";

interface FormContentProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
  formType: string;
  leadId: string;
  headingOptions: string[];
  subheadingOptions: string[];
  auditCategoryOptions: string[];
  materialCodeOptions: string[];
  isSubmitting?: boolean;
}

const FormContent: React.FC<FormContentProps> = ({
  form,
  onSubmit,
  formType,
  leadId,
  headingOptions,
  subheadingOptions,
  auditCategoryOptions,
  materialCodeOptions,
  isSubmitting = false,
}) => {
  const navigate = useNavigate();

  const handleDownloadExcel = () => {
    const formData = form.getValues();
    exportFormToExcel(formData, formType, leadId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFieldsGrid
          form={form}
          formType={formType}
          headingOptions={headingOptions}
          subheadingOptions={subheadingOptions}
          auditCategoryOptions={auditCategoryOptions}
          materialCodeOptions={materialCodeOptions}
        />

        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleDownloadExcel}
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Excel
          </Button>
          
          <div className="flex space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/fields/${leadId}/factory-ux`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FormContent;
