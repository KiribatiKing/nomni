
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { getCurrentLocation } from "@/utils/location";

type ShiftLocation = {
  lat: number;
  lng: number;
} | null;

export type ShiftRecord = {
  start: Date | null;
  startLocation: ShiftLocation;
  finish: Date | null;
  finishLocation: ShiftLocation;
  reason?: string | null;
};

export const useShift = (minHours = 3) => {
  const [shift, setShift] = useState<ShiftRecord>({
    start: null,
    startLocation: null,
    finish: null,
    finishLocation: null,
    reason: null,
  });
  const [isPremium] = useState(true); // For demo
  const [gpsPingActive, setGpsPingActive] = useState(false);
  const [lastPing, setLastPing] = useState<Date | null>(null);
  const gpsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reminder for shift not started
  useEffect(() => {
    const reminder = setTimeout(() => {
      if (!shift.start) {
        toast({
          title: "Reminder",
          description: "You haven't started your shift yet!",
        });
      }
    }, 10 * 60 * 1000);
    return () => clearTimeout(reminder);
  }, [shift.start]);

  // Regular GPS ping
  useEffect(() => {
    if (shift.start && isPremium) {
      setGpsPingActive(true);
      gpsIntervalRef.current = setInterval(async () => {
        try {
          const loc = await getCurrentLocation();
          setLastPing(new Date());
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
      }, 30 * 60 * 1000);
    }
    return () => {
      setGpsPingActive(false);
      if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);
    };
  }, [shift.start, isPremium]);

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

  const handleFinish = async () => {
    if (!shift.start) return;
    const finishTime = new Date();
    const diffMs = finishTime.getTime() - shift.start.getTime();
    const hours = diffMs / 1000 / 60 / 60;
    return { isEarlyFinish: hours < minHours, hours };
  };

  const completeShift = async (reason?: string) => {
    try {
      const loc = await getCurrentLocation();
      setShift((prev) => ({
        ...prev,
        finish: new Date(),
        finishLocation: loc,
        reason: reason || null,
      }));
      toast({
        title: reason ? "Shift Finished Early" : "Shift Finished",
        description: reason ? `Reason: ${reason}` : undefined,
      });
    } catch {
      toast({
        title: "Location Error",
        description: "Couldn't get your location on finish.",
      });
    }
  };

  return {
    shift,
    lastPing,
    gpsPingActive,
    handleStart,
    handleFinish,
    completeShift,
  };
};
