
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

const ParticipantDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      console.log("ParticipantDashboard: User authenticated as", currentUser.role);
    }
  }, [isAuthenticated, currentUser]);

  const handleShiftButton = () => {
    console.log("Navigating to shift dashboard");
    navigate('/dashboard/shift');
  };

  return (
    <div className="flex flex-col items-center p-4 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Participant Dashboard</h1>
      
      <Button 
        onClick={handleShiftButton}
        size="lg"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg mb-6 w-56 h-20 text-xl flex items-center justify-center gap-2"
      >
        <Play className="w-6 h-6" />
        Start Shift
      </Button>
      
      {!isAuthenticated && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-md text-yellow-700">
          You need to be logged in to use this feature.
        </div>
      )}
    </div>
  );
};

export default ParticipantDashboard;
