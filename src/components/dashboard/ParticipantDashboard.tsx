
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const ParticipantDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, isLoading } = useAuth();

  useEffect(() => {
    console.log("ParticipantDashboard rendering");
    console.log("Authentication status:", isAuthenticated);
    console.log("Current user:", currentUser);
    console.log("Is loading:", isLoading);

    // If not authenticated and not loading anymore, redirect to login
    if (!isLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to access the dashboard"
      });
      navigate('/login');
    } else if (!isLoading && isAuthenticated && currentUser) {
      // Show welcome toast only when authenticated and loaded
      toast({
        title: "Welcome to your dashboard",
        description: `Hello, ${currentUser.name || 'there'}!`
      });
    }
  }, [isAuthenticated, isLoading, navigate, currentUser]);

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-24 w-64 mb-8" />
        <Skeleton className="h-4 w-72" />
      </div>
    );
  }

  // Don't render anything if auth state is uncertain
  if (!isAuthenticated) {
    return null;
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
      
      <div className="mt-8 text-center text-gray-600">
        <p>Click the green button above to start your shift and track your activities.</p>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
