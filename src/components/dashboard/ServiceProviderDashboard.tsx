
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkerManagement from "@/components/service-provider/WorkerManagement";
import RosterBuilder from "@/components/service-provider/RosterBuilder";
import CalendarView from "@/components/service-provider/CalendarView";
import ClientMatching from "@/components/service-provider/ClientMatching";

const ServiceProviderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("workers");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Service Provider Dashboard</h1>
      <p className="text-gray-500">Manage your support workers, create rosters, and match clients.</p>

      <Tabs defaultValue="workers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="workers">Workers</TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="matching">Client Matching</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workers" className="mt-0">
          <WorkerManagement />
        </TabsContent>
        
        <TabsContent value="roster" className="mt-0">
          <RosterBuilder />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <CalendarView />
        </TabsContent>
        
        <TabsContent value="matching" className="mt-0">
          <ClientMatching />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceProviderDashboard;
