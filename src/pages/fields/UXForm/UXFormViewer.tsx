
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, RefreshCw, MoreVertical, Eye, Pencil, Trash2, Download } from "lucide-react";
import { useUXForms } from "@/context/UXFormsContext";
import { formatFormType } from "@/lib/factoryUXData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { exportFormToExcel } from "@/lib/uxFormExcelExport";

const UXFormViewer = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { getSubmissionsByLeadId, fetchSubmissions, deleteSubmission } = useUXForms();
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewSubmission, setViewSubmission] = useState<any | null>(null);
  
  // Get all submissions for this lead
  const submissions = leadId ? getSubmissionsByLeadId(leadId) : [];
  
  // Get unique form types from submissions
  const formTypes = Array.from(new Set(submissions.map(sub => sub.formType)));
  
  // Filter submissions by selected form type
  const filteredSubmissions = selectedFormType 
    ? submissions.filter(sub => sub.formType === selectedFormType)
    : submissions;
  
  // Function to refresh submissions
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSubmissions();
    
    // Show a loading state briefly
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Submissions refreshed");
    }, 1000);
  };

  const handleView = (submission: any) => {
    setViewSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleEdit = (submission: any) => {
    // Navigate to edit form with submission data
    navigate(`/fields/${leadId}/factory-ux/${submission.formType}?edit=${submission.id}`);
  };

  const handleDeleteConfirm = (submissionId: string) => {
    setSubmissionToDelete(submissionId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (submissionToDelete) {
      await deleteSubmission(submissionToDelete);
      setSubmissionToDelete(null);
      setDeleteDialogOpen(false);
      toast.success("Submission deleted successfully");
    }
  };

  const handleDownloadExcel = (submission: any) => {
    const formData = {
      heading: submission.heading,
      subheading: submission.subheading,
      auditCategory: submission.auditCategory,
      materialCode: submission.materialCode,
      hsnCode: submission.hsnCode,
      height: submission.height,
      uom: submission.uom,
      quantity: submission.quantity,
      price: submission.price,
      totalAmount: submission.totalAmount
    };
    exportFormToExcel(formData, submission.formType, leadId || '');
  };
  
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
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            
            <Button onClick={() => navigate(`/fields/${leadId}/factory-ux`)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Form
            </Button>
          </div>
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
                <SubmissionsTable 
                  submissions={submissions} 
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteConfirm}
                  onDownload={handleDownloadExcel}
                />
              </TabsContent>
              
              {formTypes.map(type => (
                <TabsContent key={type} value={type}>
                  <SubmissionsTable 
                    submissions={submissions.filter(sub => sub.formType === type)}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteConfirm}
                    onDownload={handleDownloadExcel}
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Submission</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this submission? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Submission Dialog */}
        {viewSubmission && (
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Submission Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm font-medium">Form Type:</p>
                  <p className="text-sm text-gray-600">{formatFormType(viewSubmission.formType)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Heading:</p>
                  <p className="text-sm text-gray-600">{viewSubmission.heading}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Subheading:</p>
                  <p className="text-sm text-gray-600">{viewSubmission.subheading}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Audit Category:</p>
                  <p className="text-sm text-gray-600">{viewSubmission.auditCategory}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Material Code:</p>
                  <p className="text-sm text-gray-600">{viewSubmission.materialCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">HSN Code:</p>
                  <p className="text-sm text-gray-600">{viewSubmission.hsnCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Height:</p>
                  <p className="text-sm text-gray-600">{viewSubmission.height}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">UOM:</p>
                  <p className="text-sm text-gray-600">{viewSubmission.uom}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Quantity:</p>
                  <p className="text-sm text-gray-600">{viewSubmission.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price:</p>
                  <p className="text-sm text-gray-600">₹{viewSubmission.price}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount:</p>
                  <p className="text-sm text-gray-600">₹{viewSubmission.totalAmount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Submitted By:</p>
                  <p className="text-sm text-gray-600">{viewSubmission.submittedBy}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  );
};

// Submission details table component
const SubmissionsTable = ({ 
  submissions, 
  onView, 
  onEdit, 
  onDelete, 
  onDownload 
}: { 
  submissions: any[];
  onView: (submission: any) => void;
  onEdit: (submission: any) => void;
  onDelete: (id: string) => void;
  onDownload: (submission: any) => void;
}) => {
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
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(submission)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(submission)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownload(submission)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(submission.id)}
                      className="text-red-600 hover:text-red-800 focus:text-red-800"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UXFormViewer;
