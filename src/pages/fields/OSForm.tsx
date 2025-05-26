
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { subjectOptions } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";

const OSForm = () => {
  const { leadId, formType } = useParams<{ leadId: string; formType: string }>();
  const navigate = useNavigate();
  
  // Format the formType for display
  const formTitle = formType
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  // Check if it's Knowledge form (which has more fields) or other OS forms
  const isKnowledgeForm = formType === 'knowledge';

  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    subject: "",
    mailContent: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const username = currentUser?.username || "Anonymous";
      
      const { data, error } = await supabase
        .from('factory_os_forms')
        .insert([{
          lead_id: leadId,
          form_type: formType,
          company_name: isKnowledgeForm ? formData.companyName : null,
          contact_person: isKnowledgeForm ? formData.contactPerson : null,
          subject: isKnowledgeForm ? formData.subject : null,
          mail_content: isKnowledgeForm ? formData.mailContent : null,
          notes: !isKnowledgeForm ? formData.mailContent : null,
          submitted_by: username
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving OS form:', error);
        toast.error('Failed to save form. Please try again.');
        return;
      }

      toast.success(`${formTitle} data saved successfully!`);
      navigate(`/fields/${leadId}/factory-os`);
    } catch (error) {
      console.error("Error saving OS form:", error);
      toast.error("Failed to save form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout title={formTitle || "Factory OS"}>
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{formTitle} Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isKnowledgeForm ? (
              // Full form for Knowledge
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    placeholder="Enter contact person's name"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mailContent">Mail Content</Label>
                  <Textarea
                    id="mailContent"
                    name="mailContent"
                    placeholder="Enter mail content"
                    value={formData.mailContent}
                    onChange={handleInputChange}
                    rows={6}
                  />
                </div>
              </>
            ) : (
              // Simplified form for other OS options
              <>
                <div className="space-y-2">
                  <Label htmlFor="notes">{formTitle} Notes</Label>
                  <Textarea
                    id="notes"
                    name="mailContent" // Reusing the field for simplicity
                    placeholder={`Enter your ${formTitle} notes`}
                    value={formData.mailContent}
                    onChange={handleInputChange}
                    rows={6}
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/fields/${leadId}/factory-os`)}
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

export default OSForm;
