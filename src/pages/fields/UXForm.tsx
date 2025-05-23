
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { 
  getFormOptionsByType,
  formatFormType 
} from "@/lib/factoryUXData";

interface FormValues {
  heading: string;
  subheading: string;
  auditCategory: string;
  materialCode: string;
  hsnCode: string;
  height: string;
  uom: string;
  quantity: string;
  price: string;
  totalAmount: string;
}

const UXForm = () => {
  const { leadId, formType } = useParams<{ leadId: string; formType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subheadingOptions, setSubheadingOptions] = useState<string[]>([]);
  const [auditCategoryOptions, setAuditCategoryOptions] = useState<string[]>([]);
  const [materialCodeOptions, setMaterialCodeOptions] = useState<string[]>([]);

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

  // Update subheading options when heading changes
  useEffect(() => {
    if (!heading || !formOptions) return;

    if (formType === "organized-workplace" && formOptions.getSubheadingOptions) {
      // For organized workplace, subheadings depend on the heading
      const options = formOptions.getSubheadingOptions(heading);
      setSubheadingOptions(options);
      setValue("subheading", options[0]);
    } else if (formType === "productive-workplace" && formOptions.getSubheading) {
      // For productive workplace, we map the heading to a specific subheading
      const subheading = formOptions.getSubheading(heading);
      setSubheadingOptions([subheading]);
      setValue("subheading", subheading);
    } else {
      // For most forms, subheading is the same as heading
      setSubheadingOptions([heading]);
      setValue("subheading", heading);
    }
  }, [heading, formType, formOptions, setValue]);

  // Set audit category options
  useEffect(() => {
    if (!formOptions) return;

    if (formType === "matrix-display" && formOptions.getAuditCategory) {
      // For matrix-display, audit category depends on heading
      const category = formOptions.getAuditCategory(heading);
      setAuditCategoryOptions([category]);
      setValue("auditCategory", category);
    } else if (formOptions.auditCategory) {
      // Use fixed audit category (e.g., for inventory-matrix and productive-workplace)
      setAuditCategoryOptions(formOptions.auditCategory);
      setValue("auditCategory", formOptions.auditCategory[0]);
    } else if (formOptions.auditCategoryOptions) {
      // Use dropdown options (e.g., for change-rx, safe-workplace, organized-workplace)
      setAuditCategoryOptions(formOptions.auditCategoryOptions);
    } else {
      // Fallback to empty array
      setAuditCategoryOptions([]);
    }
  }, [formType, formOptions, heading, setValue]);

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

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    toast({
      title: "Form Submitted",
      description: `${formTitle} form submitted successfully!`,
    });
    navigate(`/fields/${leadId}/factory-ux`);
  };

  if (!formOptions) {
    return (
      <MainLayout title={`Invalid Form Type`}>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">Invalid form type selected.</p>
            <Button onClick={() => navigate(`/fields/${leadId}/factory-ux`)}>
              Return to Factory U/X
            </Button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`${formTitle} - Lead ${leadId}`}>
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Heading */}
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
                        {formOptions.headingOptions?.map((option) => (
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

              {/* Sub-heading */}
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

              {/* Audit Category */}
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

              {/* Material Code */}
              {formType === "safe-workplace" || formType === "organized-workplace" ? (
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
              ) : (
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
              )}

              {/* HSN Code */}
              <FormField
                control={form.control}
                name="hsnCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HSN Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter HSN code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Height */}
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter height" type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* UOM */}
              <FormField
                control={form.control}
                name="uom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UOM</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter UOM" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter quantity" 
                        type="number" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter price" 
                        type="number" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Amount (Read-only) */}
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        readOnly 
                        className="bg-gray-50" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(`/fields/${leadId}/factory-ux`)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </Card>
    </MainLayout>
  );
};

export default UXForm;
