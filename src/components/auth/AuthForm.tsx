
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/types';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isLoading, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

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

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      toast({
        title: "Login successful!",
        description: "Welcome back to Nomni Support.",
      });
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleSignup = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      await signup(email, password, name, role);
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
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleAuthError = (err: any) => {
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
        {mode === 'login' ? (
          <LoginForm 
            onSubmit={handleLogin} 
            isLoading={isLoading} 
            error={error}
            setError={setError}
          />
        ) : (
          <SignupForm 
            onSubmit={handleSignup} 
            isLoading={isLoading} 
            error={error}
            setError={setError}
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {/* Footer is now empty because navigation links are in the forms */}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
