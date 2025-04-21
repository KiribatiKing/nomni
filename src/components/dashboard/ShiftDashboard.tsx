
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true }
    );
  });
}

// Utility for time display
function formatTimestamp(date: Date | null) {
  if (!date) return "";
  return date.toLocaleTimeString();
}

type ShiftRecord = {
  start: Date | null;
  startLocation: { lat: number; lng: number } | null;
  finish: Date | null;
  finishLocation: { lat: number; lng: number } | null;
  reason?: string | null;
};

const MIN_HOURS = 3; // Demo minimum hours, could be dynamic in real app

const ShiftDashboard: React.FC = () => {
  const [shift, setShift] = useState<ShiftRecord>({
    start: null,
    startLocation: null,
    finish: null,
    finishLocation: null,
    reason: null,
  });
  const [earlyFinishDialog, setEarlyFinishDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [isPremium, setIsPremium] = useState(true); // For demo, assume premium user
  const [gpsPingActive, setGpsPingActive] = useState(false);
  const [lastPing, setLastPing] = useState<Date | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gpsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Reminder for shift not started after 10 min on mount
  useEffect(() => {
    const reminder = setTimeout(() => {
      if (!shift.start) {
        toast({
          title: "Reminder",
          description: "You haven't started your shift yet!",
        });
      }
    }, 10 * 60 * 1000); // 10 minutes
    return () => clearTimeout(reminder);
    // eslint-disable-next-line
  }, [shift.start]);

  // Regular GPS ping every 30min if shift started (premium only)
  useEffect(() => {
    if (shift.start && isPremium) {
      setGpsPingActive(true);
      gpsIntervalRef.current = setInterval(async () => {
        try {
          const loc = await getCurrentLocation();
          setLastPing(new Date());
          // Replace this with sending GPS to backend if needed
          toast({
            title: "GPS Ping Sent",
            description: `Location: ${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`
          });
        } catch {
          toast({
            title: "GPS Error",
            description: "Failed to get location on GPS ping.",
          });
        }
      }, 30 * 60 * 1000); // 30 mins
    }
    return () => {
      setGpsPingActive(false);
      if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);
    };
    // eslint-disable-next-line
  }, [shift.start, isPremium]);

  // Start Shift
  const handleStart = async () => {
    try {
      const loc = await getCurrentLocation();
      setShift({
        start: new Date(),
        startLocation: loc,
        finish: null,
        finishLocation: null,
        reason: null,
      });
      toast({ title: "Shift Started", description: "Good luck on your shift!" });
    } catch {
      toast({ title: "Location Error", description: "Couldn't get your location." });
    }
  };

  // Finish Shift
  const handleFinish = async () => {
    if (!shift.start) return;
    const finishTime = new Date();
    const diffMs = finishTime.getTime() - shift.start.getTime();
    const hours = diffMs / 1000 / 60 / 60;
    const endedEarly = hours < MIN_HOURS;
    if (endedEarly) {
      setEarlyFinishDialog(true);
      return;
    }
    // Finish normally
    try {
      const loc = await getCurrentLocation();
      setShift((prev) => ({
        ...prev,
        finish: finishTime,
        finishLocation: loc,
      }));
      toast({
        title: "Shift Finished",
        description: `Duration: ${hours.toFixed(2)} hours.`
      });
    } catch {
      toast({
        title: "Location Error", description: "Couldn't get your location on finish."
      });
    }
  };

  // Save reason for early finish & complete shift
  const submitEarlyFinish = async () => {
    try {
      const loc = await getCurrentLocation();
      setShift((prev) => ({
        ...prev,
        finish: new Date(),
        finishLocation: loc,
        reason: reason,
      }));
      setEarlyFinishDialog(false);
      setReason("");
      toast({
        title: "Shift Finished Early",
        description: `Reason: ${reason}`,
      });
    } catch {
      toast({
        title: "Location Error", description: "Couldn't get your location on finish."
      });
    }
  };

  // Placeholder for auto-sync/notify worker's app view
  useEffect(() => {
    if (shift.finish) {
      // Here you'd sync the shift to the backend to notify support worker view
      // For demo:
      toast({
        title: "Shift Synced",
        description: "Support Worker's app view updated.",
      });
    }
    // eslint-disable-next-line
  }, [shift.finish]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Shift Control</h1>

        <Button
          size="lg"
          className={`w-56 h-20 text-xl mb-6 transition-transform duration-200 ${
            shift.start ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={shift.start ? handleFinish : handleStart}
        >
          {shift.start ? "Finish Shift" : "Start Shift"}
        </Button>

        <div className="w-full flex flex-col gap-2 items-start mb-4">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {!shift.start ? (
              <span className="text-gray-500">Not started</span>
            ) : !shift.finish ? (
              <span className="text-green-700">Ongoing</span>
            ) : (
              <span className="text-blue-700">Finished</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Started at:</span>{" "}
            {shift.start ? formatTimestamp(shift.start) : "-"}
          </div>
          <div>
            <span className="font-semibold">Finished at:</span>{" "}
            {shift.finish ? formatTimestamp(shift.finish) : "-"}
          </div>
          <div>
            <span className="font-semibold">Duration:</span>{" "}
            {shift.start && shift.finish
              ? `${((shift.finish.getTime() - shift.start.getTime()) / 1000 / 60 / 60).toFixed(2)} h`
              : "-"}
          </div>
          <div>
            <span className="font-semibold">Last GPS Ping:</span>{" "}
            {lastPing ? formatTimestamp(lastPing) : "-"}
          </div>
        </div>

        {/* Early finish dialog */}
        <Dialog open={earlyFinishDialog} onOpenChange={setEarlyFinishDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Finish Shift Early</DialogTitle>
              <DialogDescription>
                Please provide a reason for finishing before the minimum required hours ({MIN_HOURS}h)
              </DialogDescription>
            </DialogHeader>
            <textarea
              className="border rounded w-full p-2 my-4"
              rows={3}
              placeholder="Reason for early finish"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <DialogFooter>
              <Button
                onClick={submitEarlyFinish}
                disabled={!reason}
              >
                Submit
              </Button>
              <Button variant="outline" onClick={() => setEarlyFinishDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 text-center text-gray-400 text-xs">
        * GPS/location pings are every 30 minutes (premium).<br />
        * Automatic reminders & worker sync are enabled.<br />
        * All shift times are local.
      </div>
    </div>
  );
};

export default ShiftDashboard;
