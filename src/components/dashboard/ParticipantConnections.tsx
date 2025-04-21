
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { UserRole, User } from "@/types";

// Mock roles you can link
const LINKABLE_ROLES: UserRole[] = ["caregiver", "support-worker", "advocate"];
const ROLE_NAMES: Record<UserRole, string> = {
  participant: "Participant",
  caregiver: "Caregiver",
  "support-worker": "Support Worker",
  "service-provider": "Service Provider",
  admin: "Admin",
  advocate: "Advocate",
};

interface Connection extends User {
  relationship: string;
}

// Mock: Default initial connections (in a real app this would be loaded from the backend)
const INITIAL_CONNECTIONS: Connection[] = [
  // Example connection
  // {
  //   id: 'cg1',
  //   email: 'caregiver@example.com',
  //   name: 'Jamie Brown',
  //   role: 'caregiver',
  //   createdAt: new Date().toISOString(),
  //   relationship: 'Parent',
  // }
];

// Simulate getting plan (in a real app, get from backend/user profile)
function useSubscriptionPlan(): "basic" | "premium" {
  // For demo, return "basic" by default
  const [plan] = useState<"basic" | "premium">("basic");
  return plan;
}

const MAX_CONNECTIONS_BASIC = 2;

const ParticipantConnections: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);
  const [invite, setInvite] = useState({ email: "", role: "caregiver" as UserRole, relationship: "" });
  const [adding, setAdding] = useState(false);

  const plan = useSubscriptionPlan();
  const canAddMore = plan === "premium" || connections.length < MAX_CONNECTIONS_BASIC;

  // Handle add/invite connection
  function handleAddConnection(e: React.FormEvent) {
    e.preventDefault();
    if (!invite.email || !invite.relationship || !invite.role) {
      toast({ title: "Missing info", description: "Please fill in all fields." });
      return;
    }
    // Simple email format validation
    if (!invite.email.includes("@")) {
      toast({ title: "Invalid email", description: "Enter a valid email address." });
      return;
    }
    setConnections((prev) => [
      ...prev,
      {
        id: Math.random().toString(36),
        email: invite.email,
        name: invite.email.split("@")[0],
        role: invite.role,
        createdAt: new Date().toISOString(),
        relationship: invite.relationship,
      },
    ]);
    toast({ title: "Connection added", description: `Invited ${invite.email} as ${invite.role}` });
    setInvite({ email: "", role: "caregiver", relationship: "" });
    setAdding(false);
  }

  // Remove connection
  function handleRemove(email: string) {
    setConnections((prev) => prev.filter((conn) => conn.email !== email));
    toast({ title: "Connection removed" });
  }

  return (
    <div className="rounded-md border p-4 space-y-4 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h3 className="text-lg font-medium">Your Connections</h3>
        {plan === "basic" && (
          <Badge variant="outline" className="border-orange-400 text-orange-600">
            Basic plan: Limit 2 connections
          </Badge>
        )}
        {plan === "premium" && (
          <Badge variant="outline" className="border-green-600 text-green-700">
            Premium: Unlimited connections
          </Badge>
        )}
      </div>

      {connections.length === 0 && (
        <div className="text-gray-500">No connections yet. Add caregivers, advocates, or support workers you trust.</div>
      )}

      {connections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map(conn => (
            <div key={conn.email} className="rounded border px-3 py-2 flex items-center gap-3 justify-between bg-slate-50">
              <div>
                <Badge variant="secondary">{ROLE_NAMES[conn.role]}</Badge>
                <span className="ml-2 font-semibold">{conn.name || conn.email}</span>
                <div className="text-xs text-gray-500">Relationship: {conn.relationship}</div>
                {/* Role-based visibility */}
                <div className="mt-1 text-sm text-ndis-blue font-medium">
                  {conn.role === "caregiver" || conn.role === "advocate" ? (
                    "Can see: Start/Finish times, spending, invoices"
                  ) : conn.role === "support-worker" ? (
                    "Can see: Their own shifts"
                  ) : null}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleRemove(conn.email)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      <div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setAdding((v) => !v)}
          disabled={!canAddMore && !adding}
        >
          {adding ? "Cancel" : "Add Connection"}
        </Button>
        {!canAddMore && !adding && (
          <span className="ml-2 text-sm text-red-500">
            {MAX_CONNECTIONS_BASIC} connections max for Basic plan.
          </span>
        )}
      </div>

      {adding && (
        <form onSubmit={handleAddConnection} className="flex flex-col md:flex-row gap-2 mt-3">
          <Input
            type="email"
            placeholder="Email"
            required
            value={invite.email}
            onChange={e => setInvite({ ...invite, email: e.target.value })}
            className="w-48"
          />
          <select
            value={invite.role}
            onChange={e => setInvite({ ...invite, role: e.target.value as UserRole })}
            className="border rounded px-2 py-1 bg-white"
          >
            {LINKABLE_ROLES.map(role => (
              <option value={role} key={role}>{ROLE_NAMES[role]}</option>
            ))}
          </select>
          <Input
            placeholder="Relationship"
            required
            value={invite.relationship}
            onChange={e => setInvite({ ...invite, relationship: e.target.value })}
            className="w-48"
          />
          <Button type="submit" size="sm">
            Invite
          </Button>
        </form>
      )}
      <div className="text-xs text-gray-400 mt-2">
        All connections have role-based visibility; you control who can see your information.
      </div>
    </div>
  );
};

export default ParticipantConnections;

