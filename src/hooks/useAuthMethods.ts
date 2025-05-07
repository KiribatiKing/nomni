
import { useState } from 'react';
import { UserRole, User } from '@/types';
import { authService } from "@/services/authService";
import { toast } from "@/components/ui/use-toast";

export const useAuthMethods = (setCurrentUser: (user: User | null) => void) => {
  const [isLoading, setIsLoading] = useState(false);

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.login(email, password);
      // Session will be set by onAuthStateChange
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Signup
  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      await authService.signup(email, password, name, role);
    } catch (error) {
      console.error("Signup error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error during logout. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    signup,
    logout,
    isLoading
  };
};
