
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, DollarSign, CalendarPlus } from 'lucide-react';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  onBookmark?: () => void;
  onBook?: () => void;
  bookmarked?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onBookmark, 
  onBook,
  bookmarked = false 
}) => {
  // Generate random rating for demo purposes
  const rating = (Math.random() * 2 + 3).toFixed(1);
  
  return (
    <Card className="card-hover overflow-hidden">
      <div className="relative h-32 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-ndis-blue/70 to-ndis-teal/70 flex items-center justify-center">
          <h3 className="text-white text-xl font-bold">{service.category}</h3>
        </div>
        {bookmarked && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-ndis-orange">Bookmarked</Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{service.name}</CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-gray-500" />
          <span>Sydney, NSW</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-gray-500" />
          <span>Available from Monday to Friday</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={16} className="text-gray-500" />
          <span>${service.price.toFixed(2)} per hour</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" onClick={onBookmark}>
          {bookmarked ? 'Saved' : 'Save'}
        </Button>
        <Button size="sm" className="bg-ndis-blue hover:bg-blue-600" onClick={onBook}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
