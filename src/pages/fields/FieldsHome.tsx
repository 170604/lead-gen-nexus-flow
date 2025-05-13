
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLead } from "@/context/LeadContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Factory, Wrench, Shield } from "lucide-react";

const FieldsHome = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { getLeadById } = useLead();
  
  // Get the lead from context
  const lead = getLeadById(leadId || "");

  if (!lead) {
    return (
      <MainLayout title="Field Page">
        <div className="text-center py-12">
          <p className="text-lg text-red-500">Lead not found. Please return to the leads list.</p>
          <Button 
            onClick={() => navigate("/leads")}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            Return to Leads
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Field Options - ${lead.leadNo}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <Button 
            onClick={() => navigate(`/fields/${leadId}/factory-ux`)}
            className="field-button aspect-square"
          >
            <div className="flex flex-col items-center">
              <Factory className="h-10 w-10 mb-2" />
              <span>Factory U/X</span>
            </div>
          </Button>
        </div>
        
        <div className="flex flex-col items-center">
          <Button 
            onClick={() => navigate(`/fields/${leadId}/factory-os`)}
            className="field-button aspect-square"
          >
            <div className="flex flex-col items-center">
              <Wrench className="h-10 w-10 mb-2" />
              <span>Factory OS</span>
            </div>
          </Button>
        </div>
        
        <div className="flex flex-col items-center">
          <Button 
            onClick={() => navigate(`/fields/${leadId}/machine-safety`)}
            className="field-button aspect-square"
          >
            <div className="flex flex-col items-center">
              <Shield className="h-10 w-10 mb-2" />
              <span>Machine Safety</span>
            </div>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default FieldsHome;
