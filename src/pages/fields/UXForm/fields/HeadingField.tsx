
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

interface HeadingFieldProps {
  form: UseFormReturn<FormValues>;
  headingOptions: string[];
}

const HeadingField: React.FC<HeadingFieldProps> = ({
  form,
  headingOptions,
}) => {
  return (
    <FormField
      control={form.control}
      name="heading"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Heading</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a heading" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {headingOptions.map((option) => (
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

export default HeadingField;
