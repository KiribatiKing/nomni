
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, Stop } from "lucide-react";

const ParticipantDashboard = () => {
  const navigate = useNavigate();

  const handleShiftButton = () => {
    navigate('/dashboard/shift');
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Button 
        onClick={handleShiftButton}
        size="lg"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg mb-6 w-56 h-20 text-xl flex items-center justify-center gap-2"
      >
        <Play className="w-6 h-6" />
        Start Shift
      </Button>
    </div>
  );
};

export default ParticipantDashboard;
