
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserRole, User } from '@/types';

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

  // Listen to auth state + fetch profile
  useEffect(() => {
    // Subscribe to session events (do this first)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        fetchUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
      }
    });

    // On mount, get session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) fetchUserProfile(session.user.id);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setCurrentUser({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        profilePicture: data.profile_picture || undefined,
        createdAt: data.created_at,
        subscriptionTier: data.subscription_tier,
      });
    } else {
      setCurrentUser(null);
    }
    setIsLoading(false);
  };

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    setIsLoading(false);
  };

  // Signup
  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
    });
    if (error) throw new Error(error.message);
    setIsLoading(false);
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setCurrentUser(null);
    setIsLoading(false);
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
