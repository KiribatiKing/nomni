
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/hooks/use-toast";
import { Download, FileText, Database, Filter } from "lucide-react";

// Mock data - would be replaced with real API calls
const mockShifts = [
  { id: 1, userId: 101, userName: "Jane Doe", date: "2025-04-15", startTime: "09:00", endTime: "17:00", status: "completed", hours: 8 },
  { id: 2, userId: 102, userName: "John Smith", date: "2025-04-15", startTime: "08:00", endTime: "16:00", status: "completed", hours: 8 },
  { id: 3, userId: 101, userName: "Jane Doe", date: "2025-04-16", startTime: "09:00", endTime: "17:00", status: "completed", hours: 8 },
  { id: 4, userId: 103, userName: "Sam Johnson", date: "2025-04-16", startTime: "10:00", endTime: "18:00", status: "completed", hours: 8 },
  { id: 5, userId: 102, userName: "John Smith", date: "2025-04-17", startTime: "08:00", endTime: "16:00", status: "completed", hours: 8 },
];

const mockInvoices = [
  { id: 101, providerId: 1, providerName: "Provider A", date: "2025-04-10", amount: 1200, category: "Physio", status: "paid" },
  { id: 102, providerId: 2, providerName: "Provider B", date: "2025-04-12", amount: 900, category: "Speech", status: "paid" },
  { id: 103, providerId: 1, providerName: "Provider A", date: "2025-04-15", amount: 850, category: "Physio", status: "pending" },
  { id: 104, providerId: 3, providerName: "Provider C", date: "2025-04-18", amount: 1100, category: "OT", status: "paid" },
  { id: 105, providerId: 2, providerName: "Provider B", date: "2025-04-20", amount: 750, category: "Speech", status: "pending" },
];

const BackendDashboard = () => {
  const [activeTab, setActiveTab] = useState("shifts");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search query
  const filteredShifts = mockShifts.filter(shift => 
    shift.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shift.date.includes(searchQuery)
  );

  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.date.includes(searchQuery) ||
    invoice.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate provider totals
  const providerTotals = mockInvoices.reduce((acc, invoice) => {
    if (!acc[invoice.providerId]) {
      acc[invoice.providerId] = {
        providerName: invoice.providerName,
        total: 0,
        paid: 0,
        pending: 0
      };
    }
    acc[invoice.providerId].total += invoice.amount;
    if (invoice.status === 'paid') {
      acc[invoice.providerId].paid += invoice.amount;
    } else {
      acc[invoice.providerId].pending += invoice.amount;
    }
    return acc;
  }, {});

  const handleExportCSV = (dataType) => {
    // In a real app, this would fetch data and download as CSV
    toast({
      title: `Exporting ${dataType}`,
      description: "Your data is being prepared for download."
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${dataType} data has been exported successfully.`
      });
    }, 1500);
  };

  const handleExportCompliance = () => {
    // In a real app, this would generate a compliance report
    toast({
      title: "Generating Compliance Report",
      description: "Please wait while we prepare your compliance report."
    });
    
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your compliance report has been generated and is ready for download."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="w-7 h-7 text-primary" />
          Backend Dashboard
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportCSV(activeTab)}>
            <Download className="mr-2 w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportCompliance}>
            <FileText className="mr-2 w-4 h-4" />
            Compliance Report
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:max-w-xs"
              />
            </div>
            <Button variant="ghost" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="shifts">All Shifts</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="providers">Provider Totals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shifts" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShifts.length > 0 ? (
                      filteredShifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell>{shift.id}</TableCell>
                          <TableCell>{shift.userName}</TableCell>
                          <TableCell>{shift.date}</TableCell>
                          <TableCell>{shift.startTime}</TableCell>
                          <TableCell>{shift.endTime}</TableCell>
                          <TableCell>{shift.hours}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              shift.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {shift.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No shifts found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.id}</TableCell>
                          <TableCell>{invoice.providerName}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>${invoice.amount}</TableCell>
                          <TableCell>{invoice.category}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                          No invoices found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="providers" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Total Invoiced</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Pending</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(providerTotals).length > 0 ? (
                      Object.values(providerTotals).map((provider, index) => (
                        <TableRow key={index}>
                          <TableCell>{provider.providerName}</TableCell>
                          <TableCell>${provider.total}</TableCell>
                          <TableCell>${provider.paid}</TableCell>
                          <TableCell>${provider.pending}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          No provider data available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Real-Time Sync Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Connected to data source</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Last synced: Just now</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendDashboard;
