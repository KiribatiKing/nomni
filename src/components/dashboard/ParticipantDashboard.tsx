
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

const ParticipantDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  useEffect(() => {
    // More extensive logging to debug the issue
    console.log("ParticipantDashboard rendering");
    console.log("Authentication status:", isAuthenticated);
    console.log("Current user:", currentUser);
    console.log("Is loading:", isLoading);
    
    // Show a toast notification to confirm component is rendering
    toast({
      title: "Dashboard Loaded",
      description: "Your dashboard is now ready"
    });
  }, [isAuthenticated, currentUser, isLoading]);

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <p className="text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  const handleShiftButton = () => {
    console.log("Shift button clicked");
    toast({
      title: "Navigating to Shift Dashboard",
      description: "Loading your shift controls..."
    });
    navigate('/dashboard/shift');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-10 text-center">Welcome to Your Dashboard</h1>
      
      <Button 
        onClick={handleShiftButton}
        variant="default"
        size="lg"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-10 rounded-lg shadow-lg mb-8 w-64 h-24 text-2xl flex items-center justify-center gap-3 transform transition-transform hover:scale-105"
      >
        <Play className="w-8 h-8" />
        Start Shift
      </Button>
      
      {!isAuthenticated && (
        <div className="mt-4 p-4 bg-yellow-100 rounded-md text-yellow-700 border border-yellow-300">
          You need to be logged in to use this feature.
        </div>
      )}

      <div className="mt-8 text-center text-gray-600">
        <p>Click the green button above to start your shift and track your activities.</p>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
