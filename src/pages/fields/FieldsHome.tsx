
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLead } from "@/context/LeadContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Factory, Wrench, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

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
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Factory U/X Button */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => navigate(`/fields/${leadId}/factory-ux`)}
              className="w-48 h-48 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-4">
                <Factory className="h-16 w-16" />
                <span className="text-lg font-semibold">Factory U/X</span>
              </div>
            </Button>
          </div>
          
          {/* Factory OS Button */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => navigate(`/fields/${leadId}/factory-os`)}
              className="w-48 h-48 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-4">
                <Wrench className="h-16 w-16" />
                <span className="text-lg font-semibold">Factory OS</span>
              </div>
            </Button>
          </div>
          
          {/* Machine Safety Button */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => navigate(`/fields/${leadId}/machine-safety`)}
              className="w-48 h-48 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
              variant="outline"
            >
              <div className="flex flex-col items-center gap-4">
                <Shield className="h-16 w-16" />
                <span className="text-lg font-semibold">Machine Safety</span>
              </div>
            </Button>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
};

export default FieldsHome;
