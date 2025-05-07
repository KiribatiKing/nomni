
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from '@/types';
import { toast } from "@/components/ui/use-toast";

export const authService = {
  login: async (email: string, password: string) => {
    console.log("Attempting login for:", email);
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
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
    
    console.log("Logout successful");
  },

  getSession: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch (error) {
      console.error("Error getting session:", error);
      throw error;
    }
  },

  onAuthStateChange: (callback: (session: any) => void) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      callback(session);
    });
  }
};
