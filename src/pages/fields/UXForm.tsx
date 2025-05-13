
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { headingOptions, subheadingOptions, auditCategoryOptions, materialCodeOptions } from "@/lib/data";

const UXForm = () => {
  const { leadId, formType } = useParams<{ leadId: string; formType: string }>();
  const navigate = useNavigate();
  
  // Convert formType from kebab-case to display text
  const formTitle = formType
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [formData, setFormData] = useState({
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
  });

  const calculateTotalAmount = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price) || 0;
    return (quantity * price).toFixed(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Recalculate total if quantity or price changes
      if (name === 'quantity' || name === 'price') {
        const quantity = parseFloat(name === 'quantity' ? value : prev.quantity) || 0;
        const price = parseFloat(name === 'price' ? value : prev.price) || 0;
        newData.totalAmount = (quantity * price).toFixed(2);
      }
      
      return newData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally save the data
    // For this demo, we just show a success message and navigate back
    
    toast.success(`${formTitle} data saved successfully!`);
    navigate(`/fields/${leadId}/factory-ux`);
  };

  return (
    <MainLayout title={formTitle || "Factory UX"}>
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{formTitle} Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heading">Heading</Label>
                <Select 
                  value={formData.heading} 
                  onValueChange={(value) => handleSelectChange("heading", value)}
                >
                  <SelectTrigger id="heading">
                    <SelectValue placeholder="Select heading" />
                  </SelectTrigger>
                  <SelectContent>
                    {headingOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subheading">Sub-heading</Label>
                <Select 
                  value={formData.subheading} 
                  onValueChange={(value) => handleSelectChange("subheading", value)}
                >
                  <SelectTrigger id="subheading">
                    <SelectValue placeholder="Select sub-heading" />
                  </SelectTrigger>
                  <SelectContent>
                    {subheadingOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="auditCategory">Audit Category</Label>
                <Select 
                  value={formData.auditCategory} 
                  onValueChange={(value) => handleSelectChange("auditCategory", value)}
                >
                  <SelectTrigger id="auditCategory">
                    <SelectValue placeholder="Select audit category" />
                  </SelectTrigger>
                  <SelectContent>
                    {auditCategoryOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="materialCode">Material Code</Label>
                <Select 
                  value={formData.materialCode} 
                  onValueChange={(value) => handleSelectChange("materialCode", value)}
                >
                  <SelectTrigger id="materialCode">
                    <SelectValue placeholder="Select material code" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialCodeOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hsnCode">HSN Code</Label>
              <Input
                id="hsnCode"
                name="hsnCode"
                placeholder="Enter HSN code"
                value={formData.hsnCode}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  name="height"
                  placeholder="Enter height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="uom">UOM</Label>
                <Input
                  id="uom"
                  name="uom"
                  placeholder="Unit of Measurement"
                  value={formData.uom}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  placeholder="Enter quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  placeholder="Enter price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  placeholder="0.00"
                  value={formData.totalAmount}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/fields/${leadId}/factory-ux`)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </MainLayout>
  );
};

export default UXForm;
