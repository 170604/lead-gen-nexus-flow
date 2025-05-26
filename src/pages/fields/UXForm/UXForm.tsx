import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { 
  getFormOptionsByType,
  formatFormType 
} from "@/lib/factoryUXData";
import FormContent from "./FormContent";
import InvalidFormType from "./InvalidFormType";
import { FormValues } from "./types";
import { useUXForms } from "@/context/UXFormsContext";

const UXForm = () => {
  const { leadId, formType } = useParams<{ leadId: string; formType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveFormSubmission, fetchSubmissions } = useUXForms();
  const [subheadingOptions, setSubheadingOptions] = useState<string[]>([]);
  const [auditCategoryOptions, setAuditCategoryOptions] = useState<string[]>([]);
  const [materialCodeOptions, setMaterialCodeOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formOptions = formType ? getFormOptionsByType(formType) : null;
  const formTitle = formType ? formatFormType(formType) : "Factory UX Form";

  const form = useForm<FormValues>({
    defaultValues: {
      heading: "",
      subheading: "",
      auditCategory: "",
      materialCode: "",
      hsnCode: "",
      height: "",
      uom: "",
      quantity: "",
      price: "",
      totalAmount: "0",
    },
  });

  const { watch, setValue } = form;
  const heading = watch("heading");
  const quantity = watch("quantity");
  const price = watch("price");

  // Update subheading when heading changes
  useEffect(() => {
    if (!heading || !formOptions) return;

    if (formType === "organized-workplace" && formOptions.getSubheadingOptions) {
      const options = formOptions.getSubheadingOptions(heading);
      setSubheadingOptions(options);
      setValue("subheading", options[0]);
    } else if (formOptions.getSubheading) {
      const subheading = formOptions.getSubheading(heading);
      setSubheadingOptions([subheading]);
      setValue("subheading", subheading);
    } else {
      setSubheadingOptions([heading]);
      setValue("subheading", heading);
    }
  }, [heading, formType, formOptions, setValue]);

  // Set audit category when heading changes
  useEffect(() => {
    if (!heading || !formOptions) return;

    if (formOptions.getAuditCategory) {
      const category = formOptions.getAuditCategory(heading);
      setAuditCategoryOptions([category]);
      setValue("auditCategory", category);
    } else if (formOptions.auditCategory) {
      setAuditCategoryOptions(formOptions.auditCategory);
      setValue("auditCategory", formOptions.auditCategory[0]);
    } else {
      setAuditCategoryOptions([]);
    }
  }, [heading, formType, formOptions, setValue]);

  // Set material code options
  useEffect(() => {
    if (!formOptions) return;

    if (formOptions.materialCodeOptions) {
      setMaterialCodeOptions(formOptions.materialCodeOptions);
    } else {
      setMaterialCodeOptions([]);
    }
  }, [formOptions]);

  // Calculate total amount
  useEffect(() => {
    const qtyNum = parseFloat(quantity) || 0;
    const priceNum = parseFloat(price) || 0;
    const total = qtyNum * priceNum;
    setValue("totalAmount", total.toFixed(2));
  }, [quantity, price, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log("Form submitted:", data);
    
    try {
      if (formType && leadId) {
        await saveFormSubmission(formType, leadId, data);
        
        toast({
          title: "Form Submitted",
          description: `${formTitle} form submitted successfully!`,
        });
        
        navigate(`/fields/${leadId}/factory-ux-submissions`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formOptions) {
    return (
      <InvalidFormType leadId={leadId} />
    );
  }

  return (
    <MainLayout title={`${formTitle} - Lead ${leadId}`}>
      <Card className="p-6">
        <FormContent 
          form={form}
          onSubmit={onSubmit}
          formType={formType || ''}
          leadId={leadId || ''}
          headingOptions={formOptions.headingOptions}
          subheadingOptions={subheadingOptions}
          auditCategoryOptions={auditCategoryOptions}
          materialCodeOptions={materialCodeOptions}
          isSubmitting={isSubmitting}
        />
      </Card>
    </MainLayout>
  );
};

export default UXForm;
