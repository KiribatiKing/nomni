
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { SupportWorkerProfile, ParticipantProfile, ClientMatch } from "@/types";

// Mock data - in a real app this would come from your API
const MOCK_WORKERS: SupportWorkerProfile[] = [
  {
    id: "w1",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "support-worker",
    createdAt: new Date().toISOString(),
    qualifications: ["First Aid", "Disability Support"],
    experience: ["3 years in disability support"],
    services: ["Personal Care", "Community Access", "Transportation"]
  },
  {
    id: "w2",
    name: "John Doe",
    email: "john@example.com",
    role: "support-worker",
    createdAt: new Date().toISOString(),
    qualifications: ["Certificate IV in Disability"],
    experience: ["5 years in aged care"],
    services: ["Household Tasks", "Meal Preparation", "Social Support"]
  }
];

const MOCK_PARTICIPANTS: ParticipantProfile[] = [
  {
    id: "p1",
    name: "Alex Smith",
    email: "alex@example.com",
    role: "participant",
    createdAt: new Date().toISOString(),
    supportNeeds: ["Personal Care", "Community Access", "Social Support"],
    goals: ["Increase independence", "Community participation"]
  },
  {
    id: "p2",
    name: "Jamie Brown",
    email: "jamie@example.com",
    role: "participant",
    createdAt: new Date().toISOString(),
    supportNeeds: ["Household Tasks", "Meal Preparation", "Transportation"],
    goals: ["Develop cooking skills", "Access to community events"]
  },
  {
    id: "p3",
    name: "Taylor Wilson",
    email: "taylor@example.com",
    role: "participant",
    createdAt: new Date().toISOString(),
    supportNeeds: ["Personal Care", "Skill Development", "Education Support"],
    goals: ["Complete education course", "Find employment"]
  }
];

const ClientMatching: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [matches, setMatches] = useState<ClientMatch[]>([]);
  const [loading, setLoading] = useState(false);

  const findMatches = () => {
    if (!selectedWorker) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const worker = MOCK_WORKERS.find(w => w.id === selectedWorker);
      if (!worker) {
        setMatches([]);
        setLoading(false);
        return;
      }

      const workerServices = worker.services || [];
      
      // Calculate matches based on service overlap
      const calculatedMatches = MOCK_PARTICIPANTS.map(participant => {
        const participantNeeds = participant.supportNeeds || [];
        
        // Calculate how many of the participant's needs can be met by this worker
        const matchingServices = participantNeeds.filter(need => 
          workerServices.includes(need)
        );
        
        // Calculate compatibility score (0-100)
        const compatibility = matchingServices.length > 0
          ? Math.round((matchingServices.length / participantNeeds.length) * 100)
          : 0;
        
        return {
          participantId: participant.id,
          participantName: participant.name,
          supportNeeds: participant.supportNeeds || [],
          compatibility
        };
      });
      
      // Sort by compatibility score (highest first)
      setMatches(calculatedMatches.sort((a, b) => b.compatibility - a.compatibility));
      setLoading(false);
    }, 1000); // Simulate 1 second delay
  };

  const filteredWorkers = MOCK_WORKERS.filter(worker => 
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Client Matching</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Find the Right Match</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Search Support Worker
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b">
                <h3 className="font-medium">Select a worker</h3>
              </div>
              <div className="max-h-[200px] overflow-y-auto p-2">
                {filteredWorkers.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No workers found</p>
                ) : (
                  filteredWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className={`p-3 mb-2 rounded-md cursor-pointer ${
                        selectedWorker === worker.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      onClick={() => setSelectedWorker(worker.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{worker.name}</h4>
                          <p className="text-sm text-gray-500">{worker.email}</p>
                        </div>
                        {selectedWorker === worker.id && (
                          <Badge variant="secondary">Selected</Badge>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {worker.services?.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <Button 
              onClick={findMatches} 
              disabled={!selectedWorker || loading}
              className="w-full"
            >
              {loading ? "Finding matches..." : "Find Matching Clients"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matches.map((match) => (
                <div 
                  key={match.participantId}
                  className="border rounded-md overflow-hidden"
                >
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-50 border-b">
                    <h3 className="font-medium">{match.participantName}</h3>
                    <Badge 
                      className={getCompatibilityColor(match.compatibility)}
                    >
                      {match.compatibility}% Match
                    </Badge>
                  </div>
                  <div className="p-4">
                    <p className="text-sm mb-2 font-medium">Support Needs:</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {match.supportNeeds.map((need, index) => {
                        const worker = MOCK_WORKERS.find(w => w.id === selectedWorker);
                        const isMatch = worker?.services?.includes(need);
                        
                        return (
                          <Badge 
                            key={index}
                            variant={isMatch ? "default" : "outline"} 
                            className={isMatch ? "bg-green-500" : ""}
                          >
                            {need}
                            {isMatch && " ✓"}
                          </Badge>
                        );
                      })}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientMatching;
