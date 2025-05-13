
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLead } from "@/context/LeadContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { indianStates, getTodayDate } from "@/lib/data";

const InitialLeadForm = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getNextLeadNumber, saveInitialForm } = useLead();
  
  const [formData, setFormData] = useState({
    leadNo: "",
    date: "",
    state: "",
    place: "",
    employeeName: currentUser?.username || ""
  });

  // Initialize form with default values
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      leadNo: getNextLeadNumber(),
      date: getTodayDate(),
      employeeName: currentUser?.username || ""
    }));
  }, [getNextLeadNumber, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.state || !formData.place) {
      return;
    }
    
    saveInitialForm(formData);
    navigate("/lead-form-detailed");
  };

  return (
    <MainLayout title="Lead Generation Form">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Initial Lead Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leadNo">Lead No</Label>
                <Input
                  id="leadNo"
                  value={formData.leadNo}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={formData.date}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select 
                value={formData.state} 
                onValueChange={value => setFormData(prev => ({ ...prev, state: value }))}
                required
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {indianStates.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="place">Place</Label>
              <Input
                id="place"
                placeholder="Enter place"
                value={formData.place}
                onChange={e => setFormData(prev => ({ ...prev, place: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employeeName">Employee Name</Label>
              <Input
                id="employeeName"
                value={formData.employeeName}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Next
            </Button>
          </CardFooter>
        </form>
      </Card>
    </MainLayout>
  );
};

export default InitialLeadForm;
