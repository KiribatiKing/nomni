
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  userRole: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isLoading: true,
});

// Sample user data for demonstration purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'participant@example.com',
    name: 'Alex Smith',
    role: 'participant' as UserRole,
    profilePicture: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'caregiver@example.com',
    name: 'Jamie Brown',
    role: 'caregiver' as UserRole,
    profilePicture: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'worker@example.com',
    name: 'Sam Taylor',
    role: 'support-worker' as UserRole,
    profilePicture: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    email: 'provider@example.com',
    name: 'Jordan Lee',
    role: 'service-provider' as UserRole,
    profilePicture: '',
    createdAt: new Date().toISOString(),
  },
];

// Fixed component definition to properly define it as a React functional component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('ndis_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Find user in mock data
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('ndis_user', JSON.stringify(user));
    } else {
      throw new Error("Invalid credentials");
    }
    
    setIsLoading(false);
  };

  // Mock signup function
  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    };
    
    setCurrentUser(newUser);
    localStorage.setItem('ndis_user', JSON.stringify(newUser));
    
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ndis_user');
  };

  const value = {
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

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
