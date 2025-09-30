
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import FundingChart from './FundingChart';

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
    <div className="page-container animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome Section with Start Shift Button */}
        <div className="flex flex-col items-center text-center space-y-6 py-8">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, {currentUser?.name || 'there'}!
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Ready to start your shift? Track your activities and manage your NDIS funding all in one place.
          </p>
          
          <Button 
            onClick={handleShiftButton}
            size="lg"
            className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-8 px-12 rounded-lg shadow-xl mt-4 h-auto text-2xl flex items-center justify-center gap-3 transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <Play className="w-10 h-10" />
            Start Shift
          </Button>
        </div>

        {/* Funding Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FundingChart />
          
          {/* Quick Stats Card */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Shifts</span>
                  <span className="text-2xl font-bold text-primary">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="text-2xl font-bold text-secondary">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hours Logged</span>
                  <span className="text-2xl font-bold text-accent">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
