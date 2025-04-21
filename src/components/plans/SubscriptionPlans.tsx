
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, HelpCircle, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SubscriptionPlan } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 10,
    billingCycle: 'monthly',
    features: [
      'Limited to 2 linked users',
      'Basic tracking',
      'Service discovery',
      'Standard support',
      'Document storage (500MB)',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 50,
    billingCycle: 'monthly',
    features: [
      'Unlimited users',
      'Advanced tracking',
      'GPS pings',
      'Export data',
      'Priority support',
      'Document storage (10GB)',
      'Analytics & reporting',
    ],
  },
];

const SubscriptionPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login or create an account to subscribe to a plan.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setSelectedPlan(planId);
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call a Supabase Edge Function
      // that creates a Stripe checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          isYearly,
        }),
      });
      
      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Could not process subscription request. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    // 20% discount for yearly plans
    return (monthlyPrice * 12 * 0.8).toFixed(2);
  };

  const getPlanRecommendation = () => {
    switch (userRole) {
      case 'participant':
      case 'caregiver':
        return 'basic';
      case 'support-worker':
        return 'basic';
      case 'service-provider':
      case 'admin':
        return 'premium';
      default:
        return null;
    }
  };

  const recommendedPlan = getPlanRecommendation();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Subscription Plan</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Select the plan that best fits your needs. All plans include access to the AccessSupport platform.
        </p>
        
        <div className="flex items-center justify-center mt-8 space-x-2">
          <Label htmlFor="billing-toggle" className={!isYearly ? 'font-medium' : ''}>Monthly</Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label htmlFor="billing-toggle" className={isYearly ? 'font-medium' : ''}>Yearly</Label>
          {isYearly && (
            <Badge className="ml-2 bg-green-600">Save 20%</Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden transition-all ${
              plan.id === recommendedPlan ? 'border-2 border-ndis-blue shadow-lg transform md:-translate-y-2' : 'border'
            } ${selectedPlan === plan.id ? 'ring-2 ring-ndis-blue ring-offset-2' : ''}`}
          >
            {plan.id === recommendedPlan && (
              <div className="absolute top-0 right-0 left-0">
                <Badge className="absolute top-0 right-0 m-4 bg-ndis-blue">Recommended</Badge>
                <div className="bg-ndis-blue text-white text-center py-1 text-xs">
                  Best for {userRole?.replace('-', ' ')}s
                </div>
              </div>
            )}
            <CardHeader className={`text-center ${plan.id === recommendedPlan ? 'pt-12' : 'pt-6'}`}>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-gray-500">
                {plan.id === 'free' ? 'Free Forever' : 'Paid Subscription'}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${isYearly ? getYearlyPrice(plan.price) : plan.price}
                </span>
                <span className="text-gray-500 ml-2">
                  {isYearly ? '/year' : '/month'}
                </span>
                {isYearly && plan.price > 0 && (
                  <div className="text-sm text-green-600 mt-1">
                    Save ${(plan.price * 12 * 0.2).toFixed(2)} per year
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                className={`w-full bg-ndis-blue hover:bg-blue-600`}
                variant="default"
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isLoading && selectedPlan === plan.id}
              >
                {isLoading && selectedPlan === plan.id ? 'Processing...' : 'Subscribe Now'}
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="link" className="text-gray-500 flex items-center gap-1 text-sm p-0">
                      <Info size={16} />
                      <span>More details</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Additional details and feature specifications for {plan.name}.</p>
                    <p className="mt-2 text-xs">Note: NDIS may cover plan costs for eligible participants.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>All plans include access to the core AccessSupport platform features.</p>
        <p className="mt-2 flex items-center justify-center gap-1">
          <HelpCircle size={16} />
          Need help choosing? <Button variant="link" className="p-0">Contact our support team</Button>
        </p>
      </div>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">Subscription Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">Premium Support</h4>
              <p className="text-sm text-gray-600">Priority access to our support team</p>
            </div>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">Data Security</h4>
              <p className="text-sm text-gray-600">Enhanced encryption and backups</p>
            </div>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">Regular Updates</h4>
              <p className="text-sm text-gray-600">Access to the latest features</p>
            </div>
          </div>
          <div className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-1 shrink-0" />
            <div>
              <h4 className="font-medium">Cancel Anytime</h4>
              <p className="text-sm text-gray-600">No long-term commitments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
