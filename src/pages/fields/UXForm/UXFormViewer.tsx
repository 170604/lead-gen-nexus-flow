
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import { useUXForms } from "@/context/UXFormsContext";
import { formatFormType } from "@/lib/factoryUXData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UXFormViewer = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { getSubmissionsByLeadId } = useUXForms();
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
  
  // Get all submissions for this lead
  const submissions = leadId ? getSubmissionsByLeadId(leadId) : [];
  
  // Get unique form types from submissions
  const formTypes = Array.from(new Set(submissions.map(sub => sub.formType)));
  
  // Filter submissions by selected form type
  const filteredSubmissions = selectedFormType 
    ? submissions.filter(sub => sub.formType === selectedFormType)
    : submissions;
  
  return (
    <MainLayout title={`Factory U/X Submissions - Lead ${leadId}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Form Submissions</h2>
            <p className="text-sm text-gray-500">
              View all Factory U/X form submissions for this lead
            </p>
          </div>
          
          <Button onClick={() => navigate(`/fields/${leadId}/factory-ux`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Form
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={value => setSelectedFormType(value === "all" ? null : value)}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Forms</TabsTrigger>
                {formTypes.map(type => (
                  <TabsTrigger key={type} value={type}>
                    {formatFormType(type)}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all">
                <SubmissionsTable submissions={submissions} />
              </TabsContent>
              
              {formTypes.map(type => (
                <TabsContent key={type} value={type}>
                  <SubmissionsTable 
                    submissions={submissions.filter(sub => sub.formType === type)} 
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        {filteredSubmissions.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">No submissions yet</h3>
            <p className="text-gray-500 mb-4">
              No Factory U/X forms have been submitted for this lead yet.
            </p>
            <Button onClick={() => navigate(`/fields/${leadId}/factory-ux`)}>
              Submit a new form
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

// Submission details table component
const SubmissionsTable = ({ submissions }: { submissions: any[] }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Form Type</TableHead>
            <TableHead>Heading</TableHead>
            <TableHead>Subheading</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>{formatFormType(submission.formType)}</TableCell>
              <TableCell>{submission.heading}</TableCell>
              <TableCell>{submission.subheading}</TableCell>
              <TableCell>{submission.submittedBy}</TableCell>
              <TableCell>
                {new Date(submission.submittedAt).toLocaleDateString()} {" "}
                {new Date(submission.submittedAt).toLocaleTimeString()}
              </TableCell>
              <TableCell>₹{submission.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UXFormViewer;
