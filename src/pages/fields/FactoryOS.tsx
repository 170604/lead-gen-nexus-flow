
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FactoryOS = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  
  // Array of OS options
  const osOptions = [
    { id: "knowledge", label: "Knowledge" },
    { id: "asstmate", label: "Asstmate" },
    { id: "digiveu", label: "Digiveu" },
    { id: "documate", label: "Documate" },
    { id: "visitmate", label: "Visitmate" },
    { id: "sitemate", label: "Sitemate" },
    { id: "lotomate", label: "LOTOmate" },
    { id: "ert", label: "ERT" }
  ];

  return (
    <MainLayout title={`Factory OS - Lead ${leadId}`}>
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {osOptions.map(option => (
            <Button 
              key={option.id}
              onClick={() => navigate(`/fields/${leadId}/factory-os/${option.id}`)}
              className="field-button aspect-square"
              variant="outline"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </Card>
    </MainLayout>
  );
};

export default FactoryOS;
