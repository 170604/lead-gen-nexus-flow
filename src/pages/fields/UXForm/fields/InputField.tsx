
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

interface InputFieldProps {
  form: UseFormReturn<FormValues>;
  name: keyof FormValues;
  label: string;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  type = "text",
  readOnly = false,
  className = "",
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              placeholder={placeholder}
              type={type}
              readOnly={readOnly}
              className={className}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
