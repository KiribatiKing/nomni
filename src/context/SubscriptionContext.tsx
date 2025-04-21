
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  isSubscribed: boolean;
  subscriptionTier: 'basic' | 'premium' | null;
  subscriptionEndsAt: string | null;
  isLoadingSubscription: boolean;
  checkSubscriptionStatus: () => Promise<void>;
  openBillingPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  subscriptionTier: null,
  subscriptionEndsAt: null,
  isLoadingSubscription: true,
  checkSubscriptionStatus: async () => {},
  openBillingPortal: async () => {},
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'basic' | 'premium' | null>(null);
  const [subscriptionEndsAt, setSubscriptionEndsAt] = useState<string | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState<boolean>(true);
  const { currentUser, isAuthenticated } = useAuth();

  // Mock function to check subscription status
  // In a real implementation, this would call a Supabase Edge Function
  const checkSubscriptionStatus = async () => {
    if (!isAuthenticated) {
      setIsSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEndsAt(null);
      setIsLoadingSubscription(false);
      return;
    }

    setIsLoadingSubscription(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response based on user role for demo purposes
      if (currentUser?.role === 'service-provider' || currentUser?.role === 'admin') {
        setIsSubscribed(true);
        setSubscriptionTier('premium');
        
        // Set subscription end date to 1 month from now
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        setSubscriptionEndsAt(endDate.toISOString());
      } else if (currentUser?.role === 'support-worker') {
        setIsSubscribed(true);
        setSubscriptionTier('basic');
        
        // Set subscription end date to 1 month from now
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        setSubscriptionEndsAt(endDate.toISOString());
      } else {
        setIsSubscribed(false);
        setSubscriptionTier(null);
        setSubscriptionEndsAt(null);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEndsAt(null);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // Mock function to redirect to Stripe Customer Portal
  // In a real implementation, this would call a Supabase Edge Function
  const openBillingPortal = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This would normally redirect to the Stripe Customer Portal
      alert('In a real implementation, this would redirect to the Stripe Customer Portal');
    } catch (error) {
      console.error('Error opening billing portal:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkSubscriptionStatus();
    }
  }, [isAuthenticated, currentUser]);

  const value = {
    isSubscribed,
    subscriptionTier,
    subscriptionEndsAt,
    isLoadingSubscription,
    checkSubscriptionStatus,
    openBillingPortal,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

// Custom hook to use the subscription context
export const useSubscription = () => useContext(SubscriptionContext);
