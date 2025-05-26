
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const MachineSafety = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [safetyNotes, setSafetyNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const username = currentUser?.username || "Anonymous";
      
      const { data, error } = await supabase
        .from('machine_safety_forms')
        .insert([{
          lead_id: leadId,
          safety_notes: safetyNotes,
          submitted_by: username
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving machine safety form:', error);
        toast.error('Failed to save safety notes. Please try again.');
        return;
      }

      toast.success("Safety notes saved successfully!");
      navigate(`/fields/${leadId}`);
    } catch (error) {
      console.error("Error saving machine safety form:", error);
      toast.error("Failed to save safety notes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </MainLayout>
  );
};

export default MachineSafety;
