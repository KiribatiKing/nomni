
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SupportWorkerProfile, Shift } from "@/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

// Mock data - in a real app this would come from your API
const MOCK_WORKERS: SupportWorkerProfile[] = [
  {
    id: "w1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "support-worker",
    createdAt: new Date().toISOString(),
  },
  {
    id: "w2",
    name: "John Doe",
    email: "john@example.com",
    role: "support-worker",
    createdAt: new Date().toISOString(),
  }
];

const MOCK_SHIFTS: Shift[] = [
  {
    id: "s1",
    workerId: "w1",
    participantId: "p1",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "9:00 AM",
    endTime: "12:00 PM",
    status: "scheduled"
  },
  {
    id: "s2",
    workerId: "w1",
    participantId: "p2",
    date: format(new Date(new Date().getTime() + 86400000), "yyyy-MM-dd"), // Tomorrow
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    status: "scheduled"
  },
  {
    id: "s3",
    workerId: "w2",
    participantId: "p1",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "1:00 PM",
    endTime: "4:00 PM",
    status: "scheduled"
  }
];

// Mock participant mapping
const PARTICIPANT_NAMES: Record<string, string> = {
  "p1": "Alex Smith",
  "p2": "Jamie Brown"
};

const CalendarView: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedWorker, setSelectedWorker] = useState<string>("all");
  
  const filterShiftsByDate = (date: string) => {
    return MOCK_SHIFTS.filter(shift => {
      const workerMatch = selectedWorker === "all" || shift.workerId === selectedWorker;
      return shift.date === date && workerMatch;
    });
  };

  const getShiftCountForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const filtered = MOCK_SHIFTS.filter(shift => {
      const workerMatch = selectedWorker === "all" || shift.workerId === selectedWorker;
      return shift.date === dateStr && workerMatch;
    });
    return filtered.length;
  };

  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getWorkerName = (id: string) => {
    const worker = MOCK_WORKERS.find(w => w.id === id);
    return worker?.name || "Unknown Worker";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Calendar View</h2>
        
        <Select
          value={selectedWorker}
          onValueChange={setSelectedWorker}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by worker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workers</SelectItem>
            {MOCK_WORKERS.map(worker => (
              <SelectItem key={worker.id} value={worker.id}>
                {worker.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              onMonthChange={setCurrentMonth}
              className="pointer-events-auto"
              components={{
                DayContent: ({ day }) => {
                  const count = getShiftCountForDay(day);
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {day.getDate()}
                      {count > 0 && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  );
                },
              }}
            />
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Month:</span>
                <span className="font-medium">{format(currentMonth, "MMMM yyyy")}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span>Selected Date:</span>
                <span className="font-medium">
                  {selectedDate ? format(selectedDate, "MMMM do, yyyy") : "None"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate 
                ? `Shifts for ${format(selectedDate, "MMMM do, yyyy")}` 
                : "Select a date to view shifts"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate && (
              <>
                {filterShiftsByDate(format(selectedDate, "yyyy-MM-dd")).length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No shifts scheduled for this date</p>
                ) : (
                  <div className="space-y-3">
                    {filterShiftsByDate(format(selectedDate, "yyyy-MM-dd"))
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((shift) => (
                        <div key={shift.id} className="border rounded-md p-4 bg-slate-50">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {shift.startTime} - {shift.endTime}
                              </Badge>
                              <h4 className="font-medium">
                                {PARTICIPANT_NAMES[shift.participantId] || "Unknown Participant"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Worker: {getWorkerName(shift.workerId)}
                              </p>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Month Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Month Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: monthDays[0].getDay() }, (_, i) => (
              <div key={`empty-start-${i}`} className="h-14 border rounded-md bg-gray-50"></div>
            ))}
            
            {monthDays.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const shifts = filterShiftsByDate(dateStr);
              const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === dateStr;
              
              return (
                <div 
                  key={dateStr}
                  className={`h-14 border rounded-md p-1 flex flex-col overflow-hidden cursor-pointer hover:bg-blue-50 ${
                    isSelected ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-xs font-medium">{format(day, "d")}</div>
                  <div className="flex-1 overflow-hidden">
                    {shifts.length > 0 && (
                      <Badge variant="secondary" className="text-xs mt-1 w-full flex justify-center">
                        {shifts.length} {shifts.length === 1 ? "shift" : "shifts"}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
            
            {Array.from(
              { length: 6 - (monthDays[monthDays.length - 1].getDay() || 7) + 1 },
              (_, i) => (
                <div key={`empty-end-${i}`} className="h-14 border rounded-md bg-gray-50"></div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
