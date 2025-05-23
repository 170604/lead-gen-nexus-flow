
import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InvalidFormTypeProps {
  leadId: string | undefined;
}

const InvalidFormType: React.FC<InvalidFormTypeProps> = ({ leadId }) => {
  const navigate = useNavigate();

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
};

export default InvalidFormType;
