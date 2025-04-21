
import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, PieChart as PieChartIcon, FileText } from "lucide-react";

// Mock Data
const spendingData = [
  { name: "Provider A", value: 1200, category: "Physio" },
  { name: "Provider B", value: 900, category: "Speech" },
  { name: "Provider C", value: 500, category: "OT" },
];

const invoices = [
  { id: 1, provider: "Provider A", date: "2025-04-01", amount: 600, category: "Physio" },
  { id: 2, provider: "Provider B", date: "2025-04-03", amount: 300, category: "Speech" },
  { id: 3, provider: "Provider C", date: "2025-04-06", amount: 500, category: "OT" },
  { id: 4, provider: "Provider A", date: "2025-04-09", amount: 600, category: "Physio" },
];

// Pie chart colors
const COLORS = ["#9b87f5", "#7E69AB", "#0FA0CE", "#F97316", "#FEC6A1"];

// Summary Data
const TOTAL_BUDGET = 5000;
const totalSpent = spendingData.reduce((sum, d) => sum + d.value, 0);
const remaining = TOTAL_BUDGET - totalSpent;

const providers = [...new Set(spendingData.map(d => d.name))];
const categories = [...new Set(spendingData.map(d => d.category))];

export default function SpendingDashboard() {
  // Filter state
  const [provider, setProvider] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv =>
      (provider === "" || inv.provider === provider) &&
      (category === "" || inv.category === category) &&
      (date === "" || inv.date === date)
    );
  }, [provider, category, date]);

  // Export handlers (stub)
  const handleExportCSV = () => {
    // In real implementation, convert filteredInvoices to CSV and download
    alert("Exporting as CSV (stub)");
  };

  const handleExportPDF = () => {
    // In real implementation, convert filteredInvoices to PDF and download
    alert("Exporting as PDF (stub)");
  };

  // Monthly trends placeholder
  const monthlyTrendsData = [
    { month: "Jan", spending: 300 },
    { month: "Feb", spending: 600 },
    { month: "Mar", spending: 1000 },
    { month: "Apr", spending: totalSpent },
  ];

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PieChartIcon className="w-7 h-7 text-primary" />
          Spending Dashboard
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${TOTAL_BUDGET.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remaining < TOTAL_BUDGET * 0.2 ? "text-red-500" : "text-green-600"}`}>
              ${remaining.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row gap-3 items-center">
        <div>
          <label className="block text-xs text-muted-foreground">Provider</label>
          <select className="mt-1 border rounded px-2 py-1 w-36" value={provider} onChange={e => setProvider(e.target.value)}>
            <option value="">All</option>
            {providers.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground">Category</label>
          <select className="mt-1 border rounded px-2 py-1 w-36" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground">Date</label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-40" />
        </div>
      </div>

      {/* Chart and Trends */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie dataKey="value" data={spendingData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} fill="#8884d8" label>
                  {spendingData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-1 px-2 text-muted-foreground text-left">Month</th>
                  <th className="py-1 px-2 text-muted-foreground text-left">Spending</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTrendsData.map((d) => (
                  <tr key={d.month}>
                    <td className="py-1 px-2">{d.month}</td>
                    <td className="py-1 px-2">${d.spending}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? filteredInvoices.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.id}</TableCell>
                    <TableCell>{inv.provider}</TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>{inv.category}</TableCell>
                    <TableCell>${inv.amount}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No invoices found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
