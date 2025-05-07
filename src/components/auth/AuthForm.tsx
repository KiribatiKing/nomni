
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';
import { UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('participant');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    console.log("AuthForm rendering, mode:", mode);
    console.log("Is authenticated:", isAuthenticated);
    console.log("Is loading:", isLoading);
    
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to:", from);
      navigate(from);
    }
  }, [isAuthenticated, navigate, from, mode, isLoading]);

  const handleRoleChange = (value: string) => setRole(value as UserRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        console.log("Attempting login with:", email);
        await login(email, password);
        console.log("Login successful, waiting for auth state to update");
        
        toast({
          title: "Login successful!",
          description: "Welcome back to Nomni Support.",
        });
      } else {
        console.log("Attempting signup with:", { email, name, role });
        
        // Validate inputs
        if (!name.trim()) {
          throw new Error('Name is required');
        }
        
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        
        await signup(email, password, name, role);
        console.log("Signup successful, waiting for auth state to update");
        
        toast({
          title: "Account created successfully!",
          description: "Welcome to Nomni Support. You can now use the platform.",
        });
        
        setTimeout(() => {
          if (!isAuthenticated) {
            console.log("Manually navigating to dashboard after signup");
            navigate('/dashboard');
          }
        }, 1000);
      }
    } catch (err) {
      console.error("Auth error:", err);
      let errorMessage = 'An error occurred during authentication';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        if (errorMessage.includes('Email signups are disabled')) {
          errorMessage = 'Email registration is currently disabled. Please contact the administrator to enable email signups.';
        } else if (errorMessage.includes('already registered')) {
          errorMessage = 'This email is already registered. Please try logging in instead.';
        } else if (errorMessage.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address';
        } else if (errorMessage.includes('database error')) {
          errorMessage = 'Registration failed. The system couldn\'t create your profile. Please try again.';
        }
      }
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Enter your credentials to access your account' 
            : 'Fill out the form below to create your account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {mode === 'signup' && (
            <>
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
            </>
          )}

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
            {mode === 'signup' && (
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-ndis-blue hover:bg-blue-600"
            disabled={isLoading || isSubmitting}
          >
            {(isLoading || isSubmitting) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Logging in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'login' ? 'Log in' : 'Sign up'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center w-full">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <Button variant="link" className="p-0" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
                Log in
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
