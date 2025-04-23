
import React from 'react';
import type { ShiftRecord } from "@/hooks/useShift";
import { formatTimestamp } from "@/utils/location";

interface ShiftStatusProps {
  shift: ShiftRecord;
  lastPing: Date | null;
}

export const ShiftStatus: React.FC<ShiftStatusProps> = ({ shift, lastPing }) => {
  const getDuration = () => {
    if (!shift.start) return "-";
    const end = shift.finish || new Date();
    return `${((end.getTime() - shift.start.getTime()) / 1000 / 60 / 60).toFixed(2)} h`;
  };

  return (
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
        <span className="font-semibold">Duration:</span> {getDuration()}
      </div>
      <div>
        <span className="font-semibold">Last GPS Ping:</span>{" "}
        {lastPing ? formatTimestamp(lastPing) : "-"}
      </div>
    </div>
  );
};
