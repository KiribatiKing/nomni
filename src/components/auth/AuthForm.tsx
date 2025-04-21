
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const participantRatesTemplate = {
  monFri: "",
  sat: "",
  sun: "",
  ot: "",
  publicHoliday: "",
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { login, signup, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('participant');
  const [error, setError] = useState<string | null>(null);

  // Participant-specific states
  const [supportCoordinator, setSupportCoordinator] = useState('');
  const [advocate, setAdvocate] = useState('');
  const [ndisBudget, setNdisBudget] = useState('');
  const [serviceProviders, setServiceProviders] = useState<string[]>(['']);
  const [hasVariableRates, setHasVariableRates] = useState<'yes' | 'no'>('no');
  const [rate, setRate] = useState('');
  const [rateOptions, setRateOptions] = useState(participantRatesTemplate);
  const [minHours, setMinHours] = useState('');
  const [biometricLogin, setBiometricLogin] = useState(false);

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
    if (value !== "participant") {
      // Reset participant-specific fields
      setSupportCoordinator('');
      setAdvocate('');
      setNdisBudget('');
      setServiceProviders(['']);
      setHasVariableRates('no');
      setRate('');
      setRateOptions(participantRatesTemplate);
      setMinHours('');
    }
  };

  const handleServiceProviderChange = (index: number, value: string) => {
    const updated = [...serviceProviders];
    updated[index] = value;
    setServiceProviders(updated);
  };

  const addServiceProvider = () => {
    setServiceProviders(prev => [...prev, '']);
  };

  const removeServiceProvider = (index: number) => {
    setServiceProviders(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'login') {
        await login(email, password);
        toast({
          title: "Login successful!",
          description: "Welcome back to Nomni Support.",
        });
        navigate('/dashboard');
      } else {
        // Collect additional participant info if needed (non-persistent in demo)
        await signup(email, password, name, role);
        toast({
          title: "Account created!",
          description: "Welcome to Nomni Support.",
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const demoLogin = async (userType: UserRole) => {
    setError(null);
    try {
      let demoEmail = '';
      switch (userType) {
        case 'participant':
          demoEmail = 'participant@example.com';
          break;
        case 'caregiver':
          demoEmail = 'caregiver@example.com';
          break;
        case 'support-worker':
          demoEmail = 'worker@example.com';
          break;
        case 'service-provider':
          demoEmail = 'provider@example.com';
          break;
        default:
          demoEmail = 'participant@example.com';
      }
      await login(demoEmail, 'password');
      toast({
        title: "Demo login successful!",
        description: `You are now logged in as a ${userType.replace('-', ' ')}.`,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
              {/* Name */}
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

              {/* Role */}
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
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Email */}
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
          
          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Biometric login toggle (placeholder/disabled for now) */}
          {mode === "login" && (
            <div className="flex items-center gap-2">
              <input
                id="biometric"
                className="accent-ndis-blue"
                type="checkbox"
                checked={biometricLogin}
                disabled
                onChange={() => setBiometricLogin(!biometricLogin)}
              />
              <Label htmlFor="biometric" className="text-xs">
                Enable biometric login (Coming soon)
              </Label>
            </div>
          )}

          {/* Participant-specific fields */}
          {mode === 'signup' && role === 'participant' && (
            <>
              {/* Support Coordinator Name */}
              <div className="space-y-2">
                <Label htmlFor="supportCoordinator">Support Coordinator Name</Label>
                <Input
                  id="supportCoordinator"
                  placeholder="Coordinator's name"
                  value={supportCoordinator}
                  onChange={(e) => setSupportCoordinator(e.target.value)}
                />
              </div>
              {/* Advocate Name */}
              <div className="space-y-2">
                <Label htmlFor="advocate">Advocate Name</Label>
                <Input
                  id="advocate"
                  placeholder="Advocate name"
                  value={advocate}
                  onChange={(e) => setAdvocate(e.target.value)}
                />
              </div>
              {/* NDIS budget */}
              <div className="space-y-2">
                <Label htmlFor="ndisBudget">NDIS budget amount</Label>
                <Input
                  id="ndisBudget"
                  type="number"
                  placeholder="e.g., 5000"
                  value={ndisBudget}
                  onChange={(e) => setNdisBudget(e.target.value)}
                  min={0}
                  step="0.01"
                />
              </div>
              {/* Add Service Providers */}
              <div className="space-y-2">
                <Label>Service Providers</Label>
                {serviceProviders.map((provider, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      placeholder={`Service Provider #${idx + 1}`}
                      value={provider}
                      onChange={e => handleServiceProviderChange(idx, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeServiceProvider(idx)}
                      disabled={serviceProviders.length === 1}
                      tabIndex={-1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addServiceProvider}
                >
                  Add Provider
                </Button>
              </div>
              {/* Hourly Rate Option */}
              <div className="space-y-2">
                <Label>Do you have variable rates?</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={hasVariableRates === 'no' ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setHasVariableRates('no')}
                  >No</Button>
                  <Button
                    type="button"
                    variant={hasVariableRates === 'yes' ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => setHasVariableRates('yes')}
                  >Yes</Button>
                </div>
              </div>
              {hasVariableRates === 'no' ? (
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="e.g., 80"
                    min={0}
                    step="0.01"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Hourly Rates</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="monFri" className="text-xs">Mon-Fri</Label>
                      <Input
                        id="monFri"
                        type="number"
                        placeholder="Mon-Fri"
                        min={0}
                        step="0.01"
                        value={rateOptions.monFri}
                        onChange={e => setRateOptions(r => ({ ...r, monFri: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sat" className="text-xs">Saturday</Label>
                      <Input
                        id="sat"
                        type="number"
                        placeholder="Saturday"
                        min={0}
                        step="0.01"
                        value={rateOptions.sat}
                        onChange={e => setRateOptions(r => ({ ...r, sat: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sun" className="text-xs">Sunday</Label>
                      <Input
                        id="sun"
                        type="number"
                        placeholder="Sunday"
                        min={0}
                        step="0.01"
                        value={rateOptions.sun}
                        onChange={e => setRateOptions(r => ({ ...r, sun: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ot" className="text-xs">OT</Label>
                      <Input
                        id="ot"
                        type="number"
                        placeholder="OT"
                        min={0}
                        step="0.01"
                        value={rateOptions.ot}
                        onChange={e => setRateOptions(r => ({ ...r, ot: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="publicHoliday" className="text-xs">Public Holiday</Label>
                      <Input
                        id="publicHoliday"
                        type="number"
                        placeholder="Public Holiday"
                        min={0}
                        step="0.01"
                        value={rateOptions.publicHoliday}
                        onChange={e => setRateOptions(r => ({ ...r, publicHoliday: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Minimum hours per provider */}
              <div className="space-y-2">
                <Label htmlFor="minHours">Minimum hours per provider</Label>
                <Input
                  id="minHours"
                  type="number"
                  placeholder="e.g. 2"
                  min={0}
                  step="0.1"
                  value={minHours}
                  onChange={e => setMinHours(e.target.value)}
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full bg-ndis-blue hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
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

        {mode === 'login' && (
          <>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Try demo accounts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => demoLogin('participant')}
                className="text-xs"
              >
                Participant Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => demoLogin('caregiver')}
                className="text-xs"
              >
                Caregiver Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => demoLogin('support-worker')}
                className="text-xs"
              >
                Support Worker Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => demoLogin('service-provider')}
                className="text-xs"
              >
                Provider Demo
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
