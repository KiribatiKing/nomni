
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SupportWorkerProfile } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Edit, User, Plus } from "lucide-react";

// Mock workers (this would come from your backend in a real app)
const INITIAL_WORKERS: SupportWorkerProfile[] = [
  {
    id: "w1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "support-worker",
    createdAt: new Date().toISOString(),
    qualifications: ["First Aid", "Disability Support"],
    experience: ["3 years in disability support"],
    availableDays: ["Monday", "Wednesday", "Friday"],
    hourlyRate: 30,
    services: ["Personal Care", "Community Access"]
  },
  {
    id: "w2",
    name: "John Doe",
    email: "john@example.com",
    role: "support-worker",
    createdAt: new Date().toISOString(),
    qualifications: ["Certificate IV in Disability"],
    experience: ["5 years in aged care"],
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    hourlyRate: 35,
    services: ["Transportation", "Household Tasks"]
  }
];

const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<SupportWorkerProfile[]>(INITIAL_WORKERS);
  const [formData, setFormData] = useState<Partial<SupportWorkerProfile>>({
    role: "support-worker",
    qualifications: [],
    experience: [],
    availableDays: [],
    services: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SupportWorkerProfile) => {
    const { value } = e.target;
    const items = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({ 
        title: "Missing Information", 
        description: "Please fill out all required fields." 
      });
      return;
    }

    if (isEditing) {
      setWorkers(prev => prev.map(worker => 
        worker.id === formData.id ? { ...worker, ...formData } as SupportWorkerProfile : worker
      ));
      toast({ title: "Worker Updated", description: `${formData.name}'s profile has been updated.` });
    } else {
      const newWorker: SupportWorkerProfile = {
        id: `w${Date.now()}`,
        name: formData.name || "",
        email: formData.email || "",
        role: "support-worker",
        createdAt: new Date().toISOString(),
        qualifications: formData.qualifications || [],
        experience: formData.experience || [],
        availableDays: formData.availableDays || [],
        hourlyRate: formData.hourlyRate,
        services: formData.services || []
      };
      
      setWorkers(prev => [...prev, newWorker]);
      toast({ title: "Worker Added", description: `${newWorker.name} has been added to your team.` });
    }
    
    setDialogOpen(false);
    resetForm();
  };

  const editWorker = (worker: SupportWorkerProfile) => {
    setFormData(worker);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const deleteWorker = (id: string, name: string) => {
    setWorkers(prev => prev.filter(worker => worker.id !== id));
    toast({ title: "Worker Removed", description: `${name} has been removed from your team.` });
  };

  const resetForm = () => {
    setFormData({
      role: "support-worker",
      qualifications: [],
      experience: [],
      availableDays: [],
      services: []
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support Worker Management</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus size={18} />
              Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Worker Profile" : "Add Support Worker"}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications (comma separated)</Label>
                <Input
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications?.join(", ") || ""}
                  onChange={(e) => handleArrayInputChange(e, "qualifications")}
                  placeholder="First Aid, Certificate IV in Disability, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience (comma separated)</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience?.join(", ") || ""}
                  onChange={(e) => handleArrayInputChange(e, "experience")}
                  placeholder="3 years disability support, 2 years aged care, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate || ""}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableDays">Available Days (comma separated)</Label>
                  <Input
                    id="availableDays"
                    name="availableDays"
                    value={formData.availableDays?.join(", ") || ""}
                    onChange={(e) => handleArrayInputChange(e, "availableDays")}
                    placeholder="Monday, Wednesday, Friday, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="services">Services Provided (comma separated)</Label>
                <Input
                  id="services"
                  name="services"
                  value={formData.services?.join(", ") || ""}
                  onChange={(e) => handleArrayInputChange(e, "services")}
                  placeholder="Personal Care, Community Access, etc."
                />
              </div>

              <DialogFooter>
                <Button type="submit">{isEditing ? "Update Worker" : "Add Worker"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => (
          <Card key={worker.id} className="overflow-hidden">
            <CardHeader className="bg-slate-50 pb-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <CardTitle className="text-lg">{worker.name}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => editWorker(worker)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => deleteWorker(worker.id, worker.name)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <p className="text-sm"><strong>Email:</strong> {worker.email}</p>
              <p className="text-sm"><strong>Hourly Rate:</strong> ${worker.hourlyRate}/hr</p>
              
              <div>
                <p className="text-sm font-medium mb-1">Qualifications:</p>
                <div className="flex flex-wrap gap-1">
                  {worker.qualifications?.map((qual, i) => (
                    <Badge key={i} variant="secondary">{qual}</Badge>
                  ))}
                  {!worker.qualifications?.length && <span className="text-sm text-gray-500">None specified</span>}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Available Days:</p>
                <div className="flex flex-wrap gap-1">
                  {worker.availableDays?.map((day, i) => (
                    <Badge key={i} variant="outline">{day}</Badge>
                  ))}
                  {!worker.availableDays?.length && <span className="text-sm text-gray-500">None specified</span>}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 flex justify-between">
              <div className="text-sm text-gray-500">
                {worker.services?.length} services offered
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {workers.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-slate-50">
          <p className="text-gray-500">No support workers added yet.</p>
          <p className="text-sm text-gray-400 mt-2">Start by adding your first support worker.</p>
        </div>
      )}
    </div>
  );
};

export default WorkerManagement;
