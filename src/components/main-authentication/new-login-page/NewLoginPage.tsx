import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModeToggle } from '@/components/dashboard/layout/ModeToggle';
import GoogleIcon from '../GoogleIcon';
import AppleIcon from '../AppleIcon';
import { quotes } from './quotes';
import { Link } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [randomQuote, setRandomQuote] = useState<{ quote: string, name: string } | null>(null);
  const navigate = useNavigate();

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    setRandomQuote(getRandomQuote());
  }, []);

  // Fetch random nature image from Unsplash
  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await fetch(
          'https://api.unsplash.com/photos/random?query=nature&orientation=landscape&client_id=Z9VwJLO-4EzeKx0Eu2N4BDcLQyjxNo9bWwiAej4R3fk'
        );
        const data = await response.json();
        setImageUrl(data.urls.regular); // Setting the regular image URL
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    };

    fetchRandomImage();
  }, []);

  // Handle login form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const correctEmail = "bob@gmail.com";
    const correctPassword = "Bobishere123!";

    if (loginEmail === correctEmail && loginPassword === correctPassword) {
      setErrorMessage('');
      console.log("Login successful!");
      navigate("/dashboard");
    } else {
      setErrorMessage("Incorrect email or password.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-black dark:bg-stone-950 dark:text-stone-200">
      {/* Left side - 60% width */}
      <div className="w-[60%] flex flex-col p-10">
        <div className="text-2xl font-bold">Logo</div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-4xl text-stone-300 dark:text-stone-700">
            {/* Display random image here */}
            {imageUrl ? (
              <img src={imageUrl} alt="Random Nature" className="w-full h-auto object-cover" />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>

        {randomQuote && (
          <div className="max-w-md">
            <p className="text-lg mb-2">"{randomQuote.quote}"</p>
            <p className="text-stone-600 dark:text-stone-400">{randomQuote.name}</p>
          </div>
        )}
      </div>

      {/* Right side - 40% width */}
      <div className="w-[40%] bg-white dark:bg-stone-900 p-10 flex flex-col justify-center relative">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <LanguageSelector />
          <ModeToggle />
        </div>
        <h1 className="text-3xl font-bold mb-2">Login to your account</h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
          Enter your email and password to access your account
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            <Checkbox id="terms" required/>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms of service and privacy policy
            </label>
          </div>
          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
          <Button className="w-full">Login</Button>
        </form>
        <div className="mt-6 pb-6 text-center text-sm text-stone-500 dark:text-stone-400">
          OR CONTINUE WITH
        </div>
        <Button>
          <GoogleIcon />
          Login with Google
        </Button>
        <Button className="mt-4 w-full">
          <AppleIcon />
          Login with Apple
        </Button>

        <p className="mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
          Don't have an account?{' '}
          <Link to='/new-register' className="underline hover:text-stone-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
