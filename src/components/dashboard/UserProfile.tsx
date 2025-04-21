import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, Phone, Mail, Home, CheckCircle2, Clock, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ParticipantConnections from './ParticipantConnections';

const UserProfile: React.FC = () => {
  const { currentUser, userRole } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '123-456-7890',
    address: '123 Main St, Sydney NSW 2000',
    bio: 'I am an NDIS participant looking for support services in my local area. I enjoy music, art, and outdoor activities.',
  });

  const participantData = {
    ndisNumber: 'NDIS123456',
    supportNeeds: ['Personal Care', 'Community Access', 'Transport'],
    goals: ['Increase independence', 'Social participation', 'Develop new skills'],
  };

  const caregiverData = {
    relationship: 'Parent',
    participantsManaged: ['Alex Smith', 'Jamie Taylor'],
  };

  const supportWorkerData = {
    qualifications: ['Certificate III in Individual Support', 'First Aid Certification'],
    experience: ['2 years with disability support', '1 year with aged care'],
    services: ['Personal Care', 'Community Access', 'Social Support'],
    hourlyRate: 35,
  };

  const serviceProviderData = {
    businessName: 'Inclusive Care Services',
    services: ['Personal Care', 'Therapy Services', 'Community Access'],
    location: 'Sydney, NSW',
    contactPhone: '02 1234 5678',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const renderRoleSpecificContent = () => {
    switch (userRole) {
      case 'participant':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">NDIS Information</h3>
              <div className="mt-2 rounded-md border p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">NDIS Number</span>
                    <span>{participantData.ndisNumber}</span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div>
                    <span className="text-gray-500">Support Needs</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {participantData.supportNeeds.map(need => (
                        <Badge key={need} variant="outline">{need}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="border-t my-2"></div>
                  <div>
                    <span className="text-gray-500">Goals</span>
                    <div className="space-y-2 mt-1">
                      {participantData.goals.map((goal, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-ndis-green" />
                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Upcoming Appointments</h3>
              <div className="rounded-md border p-4 mt-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-ndis-light-blue/20 p-2 rounded-full">
                        <Clock size={20} className="text-ndis-blue" />
                      </div>
                      <div>
                        <p className="font-medium">Physiotherapy Session</p>
                        <p className="text-sm text-gray-500">
                          Friday, Apr 25, 2025 • 10:00 AM
                        </p>
                      </div>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-ndis-light-blue/20 p-2 rounded-full">
                        <Clock size={20} className="text-ndis-blue" />
                      </div>
                      <div>
                        <p className="font-medium">Support Coordination</p>
                        <p className="text-sm text-gray-500">
                          Tuesday, Apr 29, 2025 • 2:30 PM
                        </p>
                      </div>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'caregiver':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Caregiver Information</h3>
              <div className="mt-2 rounded-md border p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Relationship</span>
                    <span>{caregiverData.relationship}</span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div>
                    <span className="text-gray-500">Participants Managed</span>
                    <div className="space-y-2 mt-1">
                      {caregiverData.participantsManaged.map((person, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-ndis-light-blue text-white">
                              {person.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{person}</span>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-ndis-blue">
                        <Plus size={16} />
                        Add participant
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Upcoming Activities</h3>
              <div className="rounded-md border p-4 mt-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-ndis-light-blue/20 p-2 rounded-full">
                        <Clock size={20} className="text-ndis-blue" />
                      </div>
                      <div>
                        <p className="font-medium">Doctor's Appointment (Alex)</p>
                        <p className="text-sm text-gray-500">
                          Monday, Apr 28, 2025 • 9:00 AM
                        </p>
                      </div>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-ndis-light-blue/20 p-2 rounded-full">
                        <Clock size={20} className="text-ndis-blue" />
                      </div>
                      <div>
                        <p className="font-medium">Plan Review Meeting (Jamie)</p>
                        <p className="text-sm text-gray-500">
                          Wednesday, Apr 30, 2025 • 1:00 PM
                        </p>
                      </div>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'support-worker':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Professional Information</h3>
              <div className="mt-2 rounded-md border p-4">
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-gray-500">Qualifications</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {supportWorkerData.qualifications.map(qual => (
                        <Badge key={qual} className="bg-ndis-light-teal">{qual}</Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-6 flex items-center gap-1">
                        <Plus size={12} />
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="border-t my-2"></div>
                  <div>
                    <span className="text-gray-500">Experience</span>
                    <div className="space-y-1 mt-1">
                      {supportWorkerData.experience.map((exp, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-ndis-teal" />
                          <span>{exp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t my-2"></div>
                  <div>
                    <span className="text-gray-500">Services Provided</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {supportWorkerData.services.map(service => (
                        <Badge key={service} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hourly Rate</span>
                    <span>${supportWorkerData.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Upcoming Shifts</h3>
              <div className="rounded-md border p-4 mt-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-ndis-light-teal/20 p-2 rounded-full">
                        <Clock size={20} className="text-ndis-teal" />
                      </div>
                      <div>
                        <p className="font-medium">Community Access with Alex</p>
                        <p className="text-sm text-gray-500">
                          Tomorrow • 9:00 AM - 11:00 AM
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Confirmed
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-ndis-light-teal/20 p-2 rounded-full">
                        <Clock size={20} className="text-ndis-teal" />
                      </div>
                      <div>
                        <p className="font-medium">Home Support with Jamie</p>
                        <p className="text-sm text-gray-500">
                          Friday • 2:00 PM - 5:00 PM
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Confirmed
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'service-provider':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Business Information</h3>
              <div className="mt-2 rounded-md border p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Business Name</span>
                    <span className="font-medium">{serviceProviderData.businessName}</span>
                  </div>
                  <div className="border-t my-2"></div>
                  <div>
                    <span className="text-gray-500">Services Offered</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {serviceProviderData.services.map(service => (
                        <Badge key={service} className="bg-ndis-purple/90 hover:bg-ndis-purple">{service}</Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-6 flex items-center gap-1">
                        <Plus size={12} />
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Location</span>
                    <div className="flex items-center">
                      <Home size={16} className="mr-1 text-gray-500" />
                      <span>{serviceProviderData.location}</span>
                    </div>
                  </div>
                  <div className="border-t my-2"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Contact Phone</span>
                    <div className="flex items-center">
                      <Phone size={16} className="mr-1 text-gray-500" />
                      <span>{serviceProviderData.contactPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Client Bookings</h3>
              <div className="rounded-md border p-4 mt-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-ndis-light-blue text-white">AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Alex Smith</p>
                        <p className="text-sm text-gray-500">
                          Physiotherapy Appointment • Apr 25
                        </p>
                      </div>
                    </div>
                    <Badge>Upcoming</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-ndis-light-blue text-white">JT</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Jamie Taylor</p>
                        <p className="text-sm text-gray-500">
                          Occupational Therapy • Apr 28
                        </p>
                      </div>
                    </div>
                    <Badge>Upcoming</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">My Profile</CardTitle>
            <CardDescription>
              Manage your personal information and preferences
            </CardDescription>
          </div>
          <Button 
            variant={editing ? "default" : "outline"}
            onClick={() => editing ? handleSave() : setEditing(true)}
            className="flex items-center gap-1"
          >
            {editing ? (
              <>
                <Save size={16} />
                <span>Save</span>
              </>
            ) : (
              <>
                <Pencil size={16} />
                <span>Edit</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="role-specific">
              {userRole === 'participant' ? 'NDIS Info' : 
               userRole === 'caregiver' ? 'Caregiver Info' : 
               userRole === 'support-worker' ? 'Professional Info' : 
               'Business Info'}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="pt-6">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={currentUser?.profilePicture} />
                  <AvatarFallback className="text-2xl bg-ndis-blue text-white">
                    {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-6 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={true} // Email should not be easily changeable
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-ndis-light-blue/20 p-2 rounded-full">
                      <Mail size={20} className="text-ndis-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{profileData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-ndis-light-blue/20 p-2 rounded-full">
                      <Phone size={20} className="text-ndis-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{profileData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-ndis-light-blue/20 p-2 rounded-full">
                      <Home size={20} className="text-ndis-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{profileData.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {userRole === "participant" && (
              <ParticipantConnections />
            )}
          </TabsContent>
          <TabsContent value="role-specific" className="pt-6">
            {renderRoleSpecificContent()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <div className="text-sm text-gray-500">
          Last updated: April 21, 2025
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
