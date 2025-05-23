
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an audit category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {auditCategoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AuditCategoryField;
