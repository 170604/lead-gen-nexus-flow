
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

const FactoryUX = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  
  // Array of UX options
  const uxOptions = [
    { id: "inventory-matrix", label: "Inventory Matrix" },
    { id: "change-rx", label: "Change RX" },
    { id: "organized-workplace", label: "Organized Workplace" },
    { id: "matrix-display", label: "Matrix Display" },
    { id: "productive-workplace", label: "Productive Workplace" },
    { id: "safe-workplace", label: "Safe Workplace" }
  ];

  return (
    <MainLayout title={`Factory U/X - Lead ${leadId}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Select a form type to create a new submission</p>
        </div>
        <Button 
          onClick={() => navigate(`/fields/${leadId}/factory-ux-submissions`)}
          variant="outline"
          className="flex items-center"
        >
          <FileText className="mr-2 h-4 w-4" /> 
          View Submissions
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uxOptions.map(option => (
            <div key={option.id} className="flex justify-center">
              <Button 
                onClick={() => navigate(`/fields/${leadId}/factory-ux/${option.id}`)}
                className="w-full h-32 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                variant="outline"
              >
                <span className="text-lg font-semibold">{option.label}</span>
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </MainLayout>
  );
};

export default FactoryUX;
