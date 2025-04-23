
import React from 'react';
import { Button } from "@/components/ui/button";
import type { ShiftRecord } from "@/hooks/useShift";

interface ShiftControlsProps {
  shift: ShiftRecord;
  onStart: () => void;
  onFinish: () => void;
}

export const ShiftControls: React.FC<ShiftControlsProps> = ({
  shift,
  onStart,
  onFinish,
}) => {
  const isActive = shift.start && !shift.finish;

  return (
    <Button
      size="lg"
      className={`w-56 h-20 text-xl mb-6 transition-transform duration-200 ${
        isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
      }`}
      onClick={isActive ? onFinish : onStart}
    >
      {isActive ? "Finish Shift" : "Start Shift"}
    </Button>
  );
};
