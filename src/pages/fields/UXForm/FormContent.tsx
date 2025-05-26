
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

        <div className="flex justify-end space-x-4">
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
      </form>
    </Form>
  );
};

export default FormContent;
