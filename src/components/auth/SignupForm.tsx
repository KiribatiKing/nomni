
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { UserRole } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SignupFormProps {
  onSubmit: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading, error, setError }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('participant');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (value: string) => setRole(value as UserRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      console.log("Attempting signup with:", { email, name, role });
      
      // Validate inputs
      if (!name.trim()) {
        throw new Error('Name is required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      await onSubmit(email, password, name, role);
    } catch (err) {
      console.error("Signup form error:", err);
      // Error handling is managed in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">I am a</Label>
        <Select 
          value={role} 
          onValueChange={handleRoleChange}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="participant">Participant</SelectItem>
            <SelectItem value="support-worker">Support Worker</SelectItem>
            <SelectItem value="caregiver">Advocate/Caregiver</SelectItem>
            <SelectItem value="service-provider">Service Provider</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="advocate">Advocate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Password must be at least 6 characters
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-ndis-blue hover:bg-blue-600"
        disabled={isLoading || isSubmitting}
      >
        {(isLoading || isSubmitting) ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : 'Sign up'}
      </Button>

      <div className="text-sm text-center w-full">
        Already have an account?{' '}
        <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
          Log in
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
