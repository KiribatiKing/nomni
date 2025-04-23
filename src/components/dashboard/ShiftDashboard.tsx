
import React, { useState } from "react";
import { useShift } from "@/hooks/useShift";
import { ShiftControls } from "./shift/ShiftControls";
import { ShiftStatus } from "./shift/ShiftStatus";
import { ShiftDialog } from "./shift/ShiftDialog";

const ShiftDashboard: React.FC = () => {
  const { shift, lastPing, handleStart, handleFinish, completeShift } = useShift();
  const [earlyFinishDialog, setEarlyFinishDialog] = useState(false);

  const handleFinishClick = async () => {
    const result = await handleFinish();
    if (result?.isEarlyFinish) {
      setEarlyFinishDialog(true);
    } else {
      completeShift();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Shift Control</h1>

        <ShiftControls
          shift={shift}
          onStart={handleStart}
          onFinish={handleFinishClick}
        />

        <ShiftStatus shift={shift} lastPing={lastPing} />

        <ShiftDialog
          open={earlyFinishDialog}
          onOpenChange={setEarlyFinishDialog}
          onSubmit={completeShift}
        />
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
