
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

interface SubheadingFieldProps {
  form: UseFormReturn<FormValues>;
  subheadingOptions: string[];
}

const SubheadingField: React.FC<SubheadingFieldProps> = ({
  form,
  subheadingOptions,
}) => {
  return (
    <FormField
      control={form.control}
      name="subheading"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sub-heading</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a sub-heading" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {subheadingOptions.map((option) => (
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

export default SubheadingField;
