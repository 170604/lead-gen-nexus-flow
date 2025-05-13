
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

const MachineSafety = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [safetyNotes, setSafetyNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally save the data
    // For this demo, we just show a success message
    
    toast.success("Safety notes saved successfully!");
    navigate(`/fields/${leadId}`);
  };

  return (
    <MainLayout title={`Machine Safety - Lead ${leadId}`}>
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Machine Safety Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="safetyNotes">Safety Notes</Label>
                <Textarea
                  id="safetyNotes"
                  placeholder="Enter safety observations and notes"
                  value={safetyNotes}
                  onChange={(e) => setSafetyNotes(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/fields/${leadId}`)}
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

export default MachineSafety;
