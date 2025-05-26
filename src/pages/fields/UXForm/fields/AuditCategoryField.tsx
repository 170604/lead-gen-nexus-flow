
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "../types";

interface AuditCategoryFieldProps {
  form: UseFormReturn<FormValues>;
  auditCategoryOptions: string[];
}

const AuditCategoryField: React.FC<AuditCategoryFieldProps> = ({
  form,
  auditCategoryOptions,
}) => {
  return (
    <FormField
      control={form.control}
      name="auditCategory"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Audit Category</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              readOnly 
              className="bg-gray-50"
              placeholder="Auto-filled based on heading"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AuditCategoryField;
