
import React from 'react';
import { useSubscription } from '@/context/SubscriptionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface SubscriptionStatusProps {
  showManageButton?: boolean;
  showUpgradeButton?: boolean;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({
  showManageButton = true,
  showUpgradeButton = true,
}) => {
  const {
    isSubscribed,
    subscriptionTier,
    subscriptionEndsAt,
    isLoadingSubscription,
    openBillingPortal,
  } = useSubscription();

  if (isLoadingSubscription) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading subscription details...</span>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="text-lg">No Active Subscription</CardTitle>
          <CardDescription>
            Upgrade to access premium features and functionality.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          {showUpgradeButton && (
            <Button asChild className="w-full bg-ndis-blue hover:bg-blue-600">
              <Link to="/plans">View Subscription Plans</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={`${subscriptionTier === 'premium' ? 'border-indigo-500' : 'border-blue-400'}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">
              {subscriptionTier === 'premium' ? 'Premium Plan' : 'Basic Plan'}
            </CardTitle>
            <CardDescription>
              {subscriptionTier === 'premium' 
                ? 'Unlimited users, GPS tracking, data export' 
                : 'Up to 2 users, basic tracking'}
            </CardDescription>
          </div>
          <Badge 
            className={subscriptionTier === 'premium' ? 'bg-indigo-500' : 'bg-blue-400'}
          >
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {subscriptionEndsAt && (
          <p className="text-sm text-gray-500">
            Next billing date: {format(new Date(subscriptionEndsAt), 'MMMM d, yyyy')}
          </p>
        )}
      </CardContent>
      {showManageButton && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={openBillingPortal}
          >
            <CreditCard size={16} />
            Manage Subscription
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SubscriptionStatus;
