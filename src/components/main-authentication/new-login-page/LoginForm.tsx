import { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Checkbox } from '@/components/ui/checkbox';
import GoogleIcon from '../GoogleIcon';
import AppleIcon from '../AppleIcon';

const LoginForm = () => {
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleKeycloakLogin = async () => {
    if (keycloak) {
      try {
        // await keycloak.login();
        navigate('/dashboard'); // Navigate to dashboard after successful login
      } catch (error) {
        console.error("Keycloak login failed", error);
        navigate('*'); // Navigate to error page if login fails
      }
    } else {
      console.error("Keycloak instance not found");
      navigate('*'); // Navigate to error page if Keycloak is not initialized
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" required />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the terms of service and privacy policy
          </label>
        </div>
        <Button className="w-full" onClick={handleKeycloakLogin}>
          Login with Keycloak
        </Button>
      </form>

      <div className="mt-6 pb-6 text-center text-sm text-stone-500 dark:text-stone-400">
        OR CONTINUE WITH
      </div>
      
      <Button className="w-full mb-4">
        <GoogleIcon />
        Login with Google
      </Button>
      <Button className="w-full">
        <AppleIcon />
        Login with Apple
      </Button>

      <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
        Don't have an account?{' '}
        <Link to='/new-register' className="underline hover:text-stone-300">
          Sign up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
