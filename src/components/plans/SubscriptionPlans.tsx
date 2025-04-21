
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

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    billingCycle: 'monthly',
    features: [
      'Basic profile',
      'Service discovery',
      'Limited messaging',
      'Basic support',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 9.99,
    billingCycle: 'monthly',
    features: [
      'Enhanced profile',
      'Advanced service discovery',
      'Unlimited messaging',
      'Priority support',
      'Calendar integration',
      'Document storage (2GB)',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    billingCycle: 'monthly',
    features: [
      'Everything in Standard',
      'Custom branding (for providers)',
      'Team access',
      'Analytics & reporting',
      'NDIS reporting templates',
      'Document storage (10GB)',
      '24/7 priority support',
    ],
  },
];

const SubscriptionPlans: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { userRole } = useAuth();
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: "Plan selected",
      description: "Please continue to payment to activate your subscription.",
    });
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    // 20% discount for yearly plans
    return (monthlyPrice * 12 * 0.8).toFixed(2);
  };

  const getPlanRecommendation = () => {
    switch (userRole) {
      case 'participant':
      case 'caregiver':
        return 'standard';
      case 'support-worker':
        return 'standard';
      case 'service-provider':
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                {plan.id === 'basic' ? 'Free Forever' : 'Paid Subscription'}
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
                className={`w-full ${plan.id !== 'basic' ? 'bg-ndis-blue hover:bg-blue-600' : ''}`}
                variant={plan.id === 'basic' ? 'outline' : 'default'}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.id === 'basic' ? 'Continue with Free' : 'Select Plan'}
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
                    <p>Additional details and feature specifications for {plan.name} plan.</p>
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
    </div>
  );
};

export default SubscriptionPlans;
