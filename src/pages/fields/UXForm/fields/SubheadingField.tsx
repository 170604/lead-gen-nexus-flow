
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
import { Input } from "@/components/ui/input";
import { FormValues } from "../types";

interface SubheadingFieldProps {
  form: UseFormReturn<FormValues>;
  subheadingOptions: string[];
  formType: string;
}

const SubheadingField: React.FC<SubheadingFieldProps> = ({
  form,
  subheadingOptions,
  formType,
}) => {
  // For organized-workplace, show dropdown as it has multiple options
  // For all others, show as read-only input
  const showDropdown = formType === "organized-workplace" && subheadingOptions.length > 1;

  return (
    <FormField
      control={form.control}
      name="subheading"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sub-heading</FormLabel>
          {showDropdown ? (
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
          ) : (
            <FormControl>
              <Input 
                {...field} 
                readOnly 
                className="bg-gray-50"
                placeholder="Auto-filled based on heading"
              />
            </FormControl>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SubheadingField;
