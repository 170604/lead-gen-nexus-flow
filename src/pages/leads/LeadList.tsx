
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLead } from "@/context/LeadContext";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { exportLeadToExcel, exportAllLeadsToExcel } from "@/lib/excelExport";
import { MoreVertical, FileSpreadsheet, Eye, Pencil, Trash2, Factory } from "lucide-react";

const LeadList = () => {
  const navigate = useNavigate();
  const { getAllLeads, deleteLead, saveInitialForm } = useLead();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewLead, setViewLead] = useState<any | null>(null);
  
  const leads = getAllLeads();

  const handleEdit = (lead: any) => {
    // Set the current lead for editing
    saveInitialForm({
      leadNo: lead.leadNo,
      date: lead.date,
      state: lead.state,
      place: lead.place,
      employeeName: lead.employeeName
    });
    navigate("/lead-form-detailed");
  };

  const handleView = (lead: any) => {
    setViewLead(lead);
    setViewDialogOpen(true);
  };

  const handleDeleteConfirm = (leadNo: string) => {
    setLeadToDelete(leadNo);
    setDeleteDialogOpen(true);
  };

  const handleDeleteLead = () => {
    if (leadToDelete) {
      deleteLead(leadToDelete);
      setLeadToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleExportToExcel = (lead: any) => {
    exportLeadToExcel(lead);
  };

  const handleExportAllToExcel = () => {
    exportAllLeadsToExcel(leads);
  };

  const handleFieldPage = (lead: any) => {
    saveInitialForm({
      leadNo: lead.leadNo,
      date: lead.date,
      state: lead.state,
      place: lead.place,
      employeeName: lead.employeeName
    });
    navigate(`/fields/${lead.leadNo}`);
  };

  const handleAddNewLead = () => {
    navigate("/lead-form");
  };

  return (
    <MainLayout title="Submitted Leads">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <Button 
            onClick={handleAddNewLead}
            className="bg-primary hover:bg-primary/90"
          >
            Add New Lead
          </Button>
          
          <Button 
            onClick={handleExportAllToExcel}
            variant="outline"
            className="flex items-center border-primary text-primary hover:bg-primary/10"
            disabled={leads.length === 0}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export All to Excel
          </Button>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No leads have been submitted yet.</p>
            <Button 
              onClick={handleAddNewLead} 
              className="mt-4 bg-primary hover:bg-primary/90"
            >
              Create your first lead
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Business Potential</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.leadNo}>
                    <TableCell className="font-medium">{lead.leadNo}</TableCell>
                    <TableCell>{lead.date}</TableCell>
                    <TableCell>{lead.newCompanyName || lead.companyName}</TableCell>
                    <TableCell>{lead.state}</TableCell>
                    <TableCell>{lead.businessPotential || "-"} CR</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(lead)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(lead)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportToExcel(lead)}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Excel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFieldPage(lead)}>
                            <Factory className="mr-2 h-4 w-4" />
                            Field
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteConfirm(lead.leadNo)}
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
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the lead
                and remove it from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteLead}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Lead Dialog */}
        {viewLead && (
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Lead Details: {viewLead.leadNo}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm font-medium">Date:</p>
                  <p className="text-sm text-gray-600">{viewLead.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">State:</p>
                  <p className="text-sm text-gray-600">{viewLead.state}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Place:</p>
                  <p className="text-sm text-gray-600">{viewLead.place}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Employee Name:</p>
                  <p className="text-sm text-gray-600">{viewLead.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Company Name:</p>
                  <p className="text-sm text-gray-600">
                    {viewLead.newCompanyName || viewLead.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Business Potential Value:</p>
                  <p className="text-sm text-gray-600">{viewLead.businessPotential || "-"} CR</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Customer Details:</p>
                  <p className="text-sm text-gray-600">{viewLead.customerDetails || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Field Observation:</p>
                  <p className="text-sm text-gray-600">{viewLead.fieldObservation || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Discussion:</p>
                  <p className="text-sm text-gray-600">{viewLead.discussion || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Insights:</p>
                  <p className="text-sm text-gray-600">{viewLead.insights || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Remarks:</p>
                  <p className="text-sm text-gray-600">{viewLead.remarks || "-"}</p>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => handleExportToExcel(viewLead)}
                  className="mr-2"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export to Excel
                </Button>
                <Button 
                  onClick={() => setViewDialogOpen(false)}
                >
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

export default LeadList;
