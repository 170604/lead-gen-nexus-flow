
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import HeadingField from "./fields/HeadingField";
import SubheadingField from "./fields/SubheadingField";
import AuditCategoryField from "./fields/AuditCategoryField";
import MaterialCodeField from "./fields/MaterialCodeField";
import InputField from "./fields/InputField";

interface FormFieldsGridProps {
  form: UseFormReturn<FormValues>;
  formType: string;
  headingOptions: string[];
  subheadingOptions: string[];
  auditCategoryOptions: string[];
  materialCodeOptions: string[];
}

const FormFieldsGrid: React.FC<FormFieldsGridProps> = ({
  form,
  formType,
  headingOptions,
  subheadingOptions,
  auditCategoryOptions,
  materialCodeOptions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <HeadingField 
        form={form} 
        headingOptions={headingOptions} 
      />

      <SubheadingField 
        form={form} 
        subheadingOptions={subheadingOptions} 
      />

      <AuditCategoryField 
        form={form} 
        auditCategoryOptions={auditCategoryOptions} 
      />

      <MaterialCodeField 
        form={form} 
        formType={formType} 
        materialCodeOptions={materialCodeOptions} 
      />

      <InputField
        form={form}
        name="hsnCode"
        label="HSN Code"
        placeholder="Enter HSN code"
      />

      <InputField
        form={form}
        name="height"
        label="Height"
        placeholder="Enter height"
        type="number"
      />

      <InputField
        form={form}
        name="uom"
        label="UOM"
        placeholder="Enter UOM"
      />

      <InputField
        form={form}
        name="quantity"
        label="Quantity"
        placeholder="Enter quantity"
        type="number"
      />

      <InputField
        form={form}
        name="price"
        label="Price"
        placeholder="Enter price"
        type="number"
      />

      <InputField
        form={form}
        name="totalAmount"
        label="Total Amount"
        readOnly
        className="bg-gray-50"
      />
    </div>
  );
};

export default FormFieldsGrid;
