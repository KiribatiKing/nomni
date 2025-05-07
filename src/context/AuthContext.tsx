
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserRole, User } from '@/types';
import { toast } from "@/components/ui/use-toast";
import { authService } from "@/services/authService";
import { useProfileFetch } from "@/hooks/useProfileFetch";

// AuthContext definition
interface AuthContextType {
  session: any;
  currentUser: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  currentUser: null,
  isAuthenticated: false,
  userRole: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUserProfile } = useProfileFetch();

  // Listen to auth state + fetch profile
  useEffect(() => {
    console.log("Setting up auth listener");
    
    // Subscribe to session events
    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      setSession(session);
      
      // Use setTimeout to prevent potential deadlock with Supabase auth
      if (session?.user?.id) {
        setIsLoading(true); // Ensure loading state is active
        setTimeout(() => {
          handleProfileFetch(session.user.id);
        }, 0);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    // On mount, get session
    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();
        console.log("Got initial session:", session?.user?.id);
        setSession(session);
        
        if (session?.user?.id) {
          await handleProfileFetch(session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle profile fetching
  const handleProfileFetch = async (userId: string) => {
    setIsLoading(true);
    try {
      const profile = await fetchUserProfile(userId);
      setCurrentUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

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
      setSession(null);
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

  const value = {
    session,
    currentUser,
    isAuthenticated: !!currentUser,
    userRole: currentUser?.role || null,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
