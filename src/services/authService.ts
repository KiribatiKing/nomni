
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from '@/types';
import { toast } from "@/components/ui/use-toast";

// Demo mode flag - set this to true when Supabase is disconnected
const DEMO_MODE = true; 
const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'participant' as UserRole,
  createdAt: new Date().toISOString(),
};

export const authService = {
  login: async (email: string, password: string) => {
    console.log("Attempting login for:", email);
    
    if (DEMO_MODE) {
      console.log("Demo mode login");
      // Simulate a successful login in demo mode
      return {
        user: DEMO_USER,
        session: {
          access_token: 'demo-token',
          user: DEMO_USER
        }
      };
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      throw new Error(error.message);
    }
    
    console.log("Login successful for:", data.user?.email);
    return data;
  },

  signup: async (email: string, password: string, name: string, role: UserRole) => {
    console.log("Attempting signup for:", email, "with role:", role);
    
    if (DEMO_MODE) {
      console.log("Demo mode signup");
      // Simulate a successful signup in demo mode
      return {
        user: {
          ...DEMO_USER,
          email,
          name,
          role
        },
        session: {
          access_token: 'demo-token',
          user: DEMO_USER
        }
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
        emailRedirectTo: window.location.origin + '/dashboard'
      }
    });
    
    if (error) {
      console.error("Signup error:", error);
      throw new Error(error.message);
    }
    
    if (data?.user) {
      console.log("Signup successful for:", data.user.email);
      toast({
        title: "Account created",
        description: "Your account has been created. You'll be logged in automatically.",
      });
    }
    
    return data;
  },

  logout: async () => {
    console.log("Attempting logout");
    
    if (DEMO_MODE) {
      console.log("Demo mode logout");
      return { error: null };
    }
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
    
    console.log("Logout successful");
  },

  getSession: async () => {
    try {
      if (DEMO_MODE) {
        console.log("Demo mode getSession");
        return {
          access_token: 'demo-token',
          user: DEMO_USER
        };
      }
      
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch (error) {
      console.error("Error getting session:", error);
      throw error;
    }
  },

  onAuthStateChange: (callback: (session: any) => void) => {
    if (DEMO_MODE) {
      console.log("Demo mode onAuthStateChange");
      // Simulate an auth state change event
      setTimeout(() => {
        callback({
          access_token: 'demo-token',
          user: DEMO_USER
        });
      }, 100);
      
      // Return a mock subscription
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
    
    return supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      callback(session);
    });
  }
};
