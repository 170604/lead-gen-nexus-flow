
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLead } from "@/context/LeadContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

const DetailedLeadForm = () => {
  const navigate = useNavigate();
  const { currentLeadData, saveDetailedForm, getCompanyOptions, getLeadById } = useLead();
  
  const [formData, setFormData] = useState({
    leadNo: "",
    date: "",
    state: "",
    place: "",
    employeeName: "",
    companyName: "",
    newCompanyName: "",
    customerDetails: "",
    fieldObservation: "",
    discussion: "",
    insights: "",
    remarks: "",
    businessPotential: ""
  });

  const [companyType, setCompanyType] = useState<"new" | "existing">("new");
  
  // Get company options for dropdown
  const companyOptions = getCompanyOptions();

  // Initialize form with data from previous step or existing lead data for edit
  useEffect(() => {
    if (currentLeadData) {
      // Check if this is an edit of an existing lead
      const existingLead = getLeadById(currentLeadData.leadNo);
      
      if (existingLead) {
        // If editing existing lead, provide default values for optional properties
        setFormData({
          leadNo: existingLead.leadNo,
          date: existingLead.date,
          state: existingLead.state,
          place: existingLead.place,
          employeeName: existingLead.employeeName,
          companyName: existingLead.companyName || "",
          newCompanyName: existingLead.newCompanyName || "",
          customerDetails: existingLead.customerDetails || "",
          fieldObservation: existingLead.fieldObservation || "",
          discussion: existingLead.discussion || "",
          insights: existingLead.insights || "",
          remarks: existingLead.remarks || "",
          businessPotential: existingLead.businessPotential || ""
        });
        setCompanyType(existingLead.companyName === "New" ? "new" : "existing");
      } else {
        // New lead from initial form
        setFormData(prev => ({
          ...prev,
          leadNo: currentLeadData.leadNo,
          date: currentLeadData.date,
          state: currentLeadData.state,
          place: currentLeadData.place,
          employeeName: currentLeadData.employeeName
        }));
      }
    } else {
      // If no current lead data, redirect back to initial form
      navigate("/lead-form");
    }
  }, [currentLeadData, getLeadById, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (
      !formData.leadNo ||
      (companyType === "new" && !formData.newCompanyName) ||
      (companyType === "existing" && !formData.companyName)
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Save the lead data
    saveDetailedForm({
      ...formData,
      companyName: companyType === "new" ? "New" : formData.companyName
    });
    
    navigate("/leads");
  };

  return (
    <MainLayout title="Lead Generation Form">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Lead Details (Lead No: {formData.leadNo})</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Company Selection Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyType">Company</Label>
                <Select 
                  value={companyType}
                  onValueChange={(value) => setCompanyType(value as "new" | "existing")}
                >
                  <SelectTrigger id="companyType">
                    <SelectValue placeholder="Select company type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="existing">Existing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {companyType === "new" ? (
                <div className="space-y-2">
                  <Label htmlFor="newCompanyName">New Company Name</Label>
                  <Input
                    id="newCompanyName"
                    placeholder="Enter new company name"
                    value={formData.newCompanyName}
                    onChange={e => setFormData(prev => ({ ...prev, newCompanyName: e.target.value }))}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="existingCompany">Existing Company</Label>
                  <Select 
                    value={formData.companyName}
                    onValueChange={value => setFormData(prev => ({ ...prev, companyName: value }))}
                    required
                  >
                    <SelectTrigger id="existingCompany">
                      <SelectValue placeholder="Select existing company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companyOptions.map(company => (
                        <SelectItem key={company.id} value={company.name}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="space-y-2">
              <Label htmlFor="customerDetails">Customer Details</Label>
              <Textarea
                id="customerDetails"
                placeholder="Enter customer details"
                value={formData.customerDetails}
                onChange={e => setFormData(prev => ({ ...prev, customerDetails: e.target.value }))}
                rows={3}
              />
            </div>
            
            {/* Field Observations */}
            <div className="space-y-2">
              <Label htmlFor="fieldObservation">Field Observation</Label>
              <Textarea
                id="fieldObservation"
                placeholder="Enter field observations"
                value={formData.fieldObservation}
                onChange={e => setFormData(prev => ({ ...prev, fieldObservation: e.target.value }))}
                rows={3}
              />
            </div>
            
            {/* Discussion */}
            <div className="space-y-2">
              <Label htmlFor="discussion">Discussion</Label>
              <Textarea
                id="discussion"
                placeholder="Enter discussion details"
                value={formData.discussion}
                onChange={e => setFormData(prev => ({ ...prev, discussion: e.target.value }))}
                rows={3}
              />
            </div>
            
            {/* Insights */}
            <div className="space-y-2">
              <Label htmlFor="insights">Insights</Label>
              <Textarea
                id="insights"
                placeholder="Enter insights"
                value={formData.insights}
                onChange={e => setFormData(prev => ({ ...prev, insights: e.target.value }))}
                rows={3}
              />
            </div>
            
            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Enter remarks"
                value={formData.remarks}
                onChange={e => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                rows={3}
              />
            </div>
            
            {/* Business Potential */}
            <div className="space-y-2">
              <Label htmlFor="businessPotential">Business Potential Value (in CR)</Label>
              <Input
                id="businessPotential"
                placeholder="Enter business potential value"
                value={formData.businessPotential}
                onChange={e => {
                  const value = e.target.value;
                  // Allow only numbers and decimal point
                  if (value === "" || /^[0-9]+(\.[0-9]*)?$/.test(value)) {
                    setFormData(prev => ({ ...prev, businessPotential: value }));
                  }
                }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </MainLayout>
  );
};

export default DetailedLeadForm;
