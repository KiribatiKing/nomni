
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { ArrowRight, Users, Calendar, Clipboard, Shield, CreditCard, BarChart } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ndis-blue to-ndis-teal py-16 md:py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-white text-ndis-blue">NDIS Support Made Simple</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Connecting NDIS Participants with Support Services
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-blue-50">
              Nomni Support brings together participants, caregivers, support workers, and service providers in one easy-to-use platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-ndis-blue hover:bg-blue-50"
                asChild
              >
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-ndis-blue"
                asChild
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* User Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-2">For Everyone</Badge>
            <h2 className="text-3xl font-bold">Nomni Support is for</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="text-center card-hover">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-ndis-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-ndis-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Participants</h3>
                <p className="text-gray-600">
                  Find support services, manage your NDIS plan, and connect with providers.
                </p>
                <Button variant="link" className="mt-4" asChild>
                  <Link to="/signup" className="flex items-center">
                    Join as Participant <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-ndis-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-ndis-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">Caregivers</h3>
                <p className="text-gray-600">
                  Coordinate care, manage schedules, and find the best support for your loved ones.
                </p>
                <Button variant="link" className="mt-4" asChild>
                  <Link to="/signup" className="flex items-center">
                    Join as Caregiver <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-ndis-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-ndis-teal" />
                </div>
                <h3 className="text-xl font-bold mb-2">Support Workers</h3>
                <p className="text-gray-600">
                  Connect with clients, manage your schedule, and streamline your work.
                </p>
                <Button variant="link" className="mt-4" asChild>
                  <Link to="/signup" className="flex items-center">
                    Join as Worker <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="text-center card-hover">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 bg-ndis-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="h-8 w-8 text-ndis-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2">Service Providers</h3>
                <p className="text-gray-600">
                  Showcase your services, manage clients, and grow your NDIS business.
                </p>
                <Button variant="link" className="mt-4" asChild>
                  <Link to="/signup" className="flex items-center">
                    Join as Provider <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-2">Features</Badge>
            <h2 className="text-3xl font-bold">What Nomni Support offers</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mt-4">
              Our platform provides tools and features designed specifically for the NDIS ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-start p-6 border rounded-lg shadow-sm card-hover">
              <div className="p-3 bg-ndis-blue/10 rounded-full mb-4">
                <Users className="h-6 w-6 text-ndis-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">User Profiles</h3>
              <p className="text-gray-600 mb-4">
                Tailored profiles for participants, caregivers, support workers, and service providers.
              </p>
              <Button variant="link" className="mt-auto p-0" asChild>
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
            
            <div className="flex flex-col items-start p-6 border rounded-lg shadow-sm card-hover">
              <div className="p-3 bg-ndis-teal/10 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-ndis-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Scheduling</h3>
              <p className="text-gray-600 mb-4">
                Easily book, manage and coordinate support services with an integrated calendar.
              </p>
              <Button variant="link" className="mt-auto p-0" asChild>
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
            
            <div className="flex flex-col items-start p-6 border rounded-lg shadow-sm card-hover">
              <div className="p-3 bg-ndis-green/10 rounded-full mb-4">
                <Clipboard className="h-6 w-6 text-ndis-green" />
              </div>
              <h3 className="text-xl font-bold mb-2">NDIS Plan Management</h3>
              <p className="text-gray-600 mb-4">
                Tools to track goals, budget utilization, and support coordination.
              </p>
              <Button variant="link" className="mt-auto p-0" asChild>
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
            
            <div className="flex flex-col items-start p-6 border rounded-lg shadow-sm card-hover">
              <div className="p-3 bg-ndis-purple/10 rounded-full mb-4">
                <Shield className="h-6 w-6 text-ndis-purple" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Messaging</h3>
              <p className="text-gray-600 mb-4">
                Private and secure communication between all parties in the support network.
              </p>
              <Button variant="link" className="mt-auto p-0" asChild>
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
            
            <div className="flex flex-col items-start p-6 border rounded-lg shadow-sm card-hover">
              <div className="p-3 bg-ndis-orange/10 rounded-full mb-4">
                <CreditCard className="h-6 w-6 text-ndis-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Processing</h3>
              <p className="text-gray-600 mb-4">
                Seamless payment processing for services with NDIS plan integration.
              </p>
              <Button variant="link" className="mt-auto p-0" asChild>
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
            
            <div className="flex flex-col items-start p-6 border rounded-lg shadow-sm card-hover">
              <div className="p-3 bg-ndis-blue/10 rounded-full mb-4">
                <BarChart className="h-6 w-6 text-ndis-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reporting & Analytics</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive reporting to track progress, outcomes, and spending.
              </p>
              <Button variant="link" className="mt-auto p-0" asChild>
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-ndis-blue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join Nomni Support today and discover how we can help you navigate the NDIS ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-ndis-blue hover:bg-blue-50"
              asChild
            >
              <Link to="/signup">Sign Up Now</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-ndis-blue"
              asChild
            >
              <Link to="/plans">View Plans</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Nomni Support Hub</h3>
              <p className="text-gray-400">
                Connecting NDIS participants with quality support services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link to="/plans" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">NDIS Information</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Support Guides</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <address className="not-italic text-gray-400">
                <p>Email: info@nomnisupport.com</p>
                <p>Phone: 1800 NOMNI (123 456)</p>
              </address>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Nomni Support Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

