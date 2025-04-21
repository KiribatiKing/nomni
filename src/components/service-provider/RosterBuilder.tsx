import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from "@/components/ui/calendar";
import { Input } from '@/components/ui/input';
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Clock, Move } from "lucide-react";
import { SupportWorkerProfile, ParticipantProfile, Shift } from "@/types";
import { cn } from "@/lib/utils";

// Mock data - in a real app this would come from your API
const MOCK_WORKERS: SupportWorkerProfile[] = [
  {
    id: "w1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "support-worker",
    createdAt: new Date().toISOString(),
    qualifications: ["First Aid", "Disability Support"],
    availableDays: ["Monday", "Wednesday", "Friday"]
  },
  {
    id: "w2",
    name: "John Doe",
    email: "john@example.com",
    role: "support-worker",
    createdAt: new Date().toISOString(),
    qualifications: ["Certificate IV in Disability"],
    availableDays: ["Tuesday", "Thursday", "Saturday"]
  }
];

const MOCK_PARTICIPANTS: ParticipantProfile[] = [
  {
    id: "p1",
    name: "Alex Smith",
    email: "alex@example.com",
    role: "participant",
    createdAt: new Date().toISOString(),
    supportNeeds: ["Personal Care", "Community Access"]
  },
  {
    id: "p2",
    name: "Jamie Brown",
    email: "jamie@example.com",
    role: "participant",
    createdAt: new Date().toISOString(),
    supportNeeds: ["Transportation", "Household Tasks"]
  }
];

// Generate time slots from 6 AM to 9 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 21; hour++) {
    const hourStr = hour > 12 ? `${hour - 12}` : `${hour}`;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    slots.push(`${hourStr}:00 ${amPm}`);
    slots.push(`${hourStr}:30 ${amPm}`);
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

const RosterBuilder: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date | undefined>(new Date());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    status: 'scheduled'
  });
  const [draggedShiftId, setDraggedShiftId] = useState<string | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setCurrentDate(date);
    if (date) {
      setNewShift({...newShift, date: format(date, 'yyyy-MM-dd')});
    }
  };

  const handleAddShift = () => {
    if (!newShift.workerId || !newShift.participantId || !newShift.date || !newShift.startTime || !newShift.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields for the shift."
      });
      return;
    }

    // Simple validation for time (start must be before end)
    const startIndex = TIME_SLOTS.indexOf(newShift.startTime);
    const endIndex = TIME_SLOTS.indexOf(newShift.endTime);
    
    if (startIndex >= endIndex) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time."
      });
      return;
    }

    const shiftToAdd: Shift = {
      id: `shift-${Date.now()}`,
      workerId: newShift.workerId,
      participantId: newShift.participantId,
      date: newShift.date,
      startTime: newShift.startTime!,
      endTime: newShift.endTime!,
      notes: newShift.notes,
      status: 'scheduled'
    };

    setShifts([...shifts, shiftToAdd]);
    
    toast({
      title: "Shift Added",
      description: `Shift scheduled for ${format(new Date(shiftToAdd.date), 'MMMM do')}`
    });

    // Reset form but keep the date
    setNewShift({
      date: newShift.date,
      status: 'scheduled'
    });
  };

  const handleDragStart = (shiftId: string) => {
    setDraggedShiftId(shiftId);
  };

  const handleDragEnd = () => {
    setDraggedShiftId(null);
  };

  const handleShiftDrop = (workerId: string) => {
    if (draggedShiftId) {
      setShifts(shifts.map(shift => 
        shift.id === draggedShiftId 
          ? { ...shift, workerId } 
          : shift
      ));
      
      toast({
        title: "Shift Reassigned",
        description: "The shift has been reassigned to a different worker."
      });
    }
  };

  const getWorkerShifts = (workerId: string) => {
    return shifts
      .filter(shift => shift.workerId === workerId && shift.date === (currentDate ? format(currentDate, 'yyyy-MM-dd') : undefined))
      .sort((a, b) => TIME_SLOTS.indexOf(a.startTime) - TIME_SLOTS.indexOf(b.startTime));
  };

  const getParticipantName = (id: string) => {
    const participant = MOCK_PARTICIPANTS.find(p => p.id === id);
    return participant?.name || "Unknown Participant";
  };

  const deleteShift = (shiftId: string) => {
    setShifts(shifts.filter(shift => shift.id !== shiftId));
    toast({
      title: "Shift Removed",
      description: "The shift has been removed from the roster."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Roster Builder</h2>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !currentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentDate ? format(currentDate, "MMMM do, yyyy") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Add New Shift Form */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="worker">Support Worker</Label>
              <Select
                value={newShift.workerId}
                onValueChange={(value) => setNewShift({...newShift, workerId: value})}
              >
                <SelectTrigger id="worker">
                  <SelectValue placeholder="Select worker" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_WORKERS.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id}>
                      {worker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participant">Participant</Label>
              <Select
                value={newShift.participantId}
                onValueChange={(value) => setNewShift({...newShift, participantId: value})}
              >
                <SelectTrigger id="participant">
                  <SelectValue placeholder="Select participant" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PARTICIPANTS.map((participant) => (
                    <SelectItem key={participant.id} value={participant.id}>
                      {participant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newShift.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newShift.date ? 
                      format(new Date(newShift.date), "MMMM do, yyyy") : 
                      <span>Pick a date</span>
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newShift.date ? new Date(newShift.date) : undefined}
                    onSelect={(date) => date && setNewShift({...newShift, date: format(date, 'yyyy-MM-dd')})}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select
                value={newShift.startTime}
                onValueChange={(value) => setNewShift({...newShift, startTime: value})}
              >
                <SelectTrigger id="startTime">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={`start-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Select
                value={newShift.endTime}
                onValueChange={(value) => setNewShift({...newShift, endTime: value})}
              >
                <SelectTrigger id="endTime">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={`end-${time}`} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes"
                value={newShift.notes || ""}
                onChange={(e) => setNewShift({...newShift, notes: e.target.value})}
                placeholder="Any special instructions"
              />
            </div>
          </div>
          
          <Button className="mt-4" onClick={handleAddShift}>
            Add Shift
          </Button>
        </CardContent>
      </Card>

      {/* Roster View */}
      {currentDate && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Roster for {format(currentDate, "EEEE, MMMM do, yyyy")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_WORKERS.map((worker) => (
              <Card 
                key={worker.id}
                className="overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleShiftDrop(worker.id)}
              >
                <CardHeader className="bg-slate-50 pb-4">
                  <CardTitle className="text-md">{worker.name}</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[150px]">
                  {getWorkerShifts(worker.id).length === 0 && (
                    <p className="text-gray-400 text-center py-4">No shifts scheduled</p>
                  )}
                  
                  {getWorkerShifts(worker.id).map((shift) => (
                    <div 
                      key={shift.id}
                      draggable
                      onDragStart={() => handleDragStart(shift.id)}
                      onDragEnd={handleDragEnd}
                      className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <Move size={14} className="text-gray-400 mr-2 cursor-move" />
                          <span className="font-medium text-sm">
                            {getParticipantName(shift.participantId)}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {shift.startTime} - {shift.endTime}
                        </div>
                        {shift.notes && (
                          <p className="text-xs text-gray-500 mt-1 italic">
                            {shift.notes}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteShift(shift.id)}
                        className="h-6 w-6 p-0"
                      >
                        &times;
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterBuilder;
