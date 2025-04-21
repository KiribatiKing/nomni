
export type UserRole = 'participant' | 'caregiver' | 'support-worker' | 'service-provider' | 'admin' | 'advocate';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
  createdAt: string;
}

export interface ParticipantProfile extends User {
  ndisNumber?: string;
  supportNeeds?: string[];
  goals?: string[];
}

export interface CaregiverProfile extends User {
  participantsManaged?: string[];
  relationship?: string;
}

export interface SupportWorkerProfile extends User {
  qualifications?: string[];
  experience?: string[];
  availableDays?: string[];
  hourlyRate?: number;
  services?: string[];
}

export interface ServiceProviderProfile extends User {
  businessName: string;
  services: string[];
  location: string;
  contactPhone: string;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  provider: string;
  category: string;
  price: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}

export interface Shift {
  id: string;
  workerId: string;
  participantId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface ClientMatch {
  participantId: string;
  participantName: string;
  supportNeeds: string[];
  compatibility: number; // 0-100 score
}
