
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../types";

interface MaterialCodeFieldProps {
  form: UseFormReturn<FormValues>;
  formType: string;
  materialCodeOptions: string[];
}

const MaterialCodeField: React.FC<MaterialCodeFieldProps> = ({
  form,
  formType,
  materialCodeOptions,
}) => {
  // For safe-workplace or organized-workplace, we use a text input
  if (formType === "safe-workplace" || formType === "organized-workplace") {
    return (
      <FormField
        control={form.control}
        name="materialCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Material Code</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter material code" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // For other form types, we use a dropdown
  return (
    <FormField
      control={form.control}
      name="materialCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Material Code</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a material code" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {materialCodeOptions.map((option) => (
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

export default MaterialCodeField;
