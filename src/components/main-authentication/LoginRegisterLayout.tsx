import { FC, ReactNode, useEffect, useState } from 'react';
import { ModeToggle } from '@/components/dashboard/layout/ModeToggle';
import LanguageSelector from './new-login-page/LanguageSelector';
import { quotes } from './new-login-page/quotes';
import loginRegisterImages from './login-register-images';

interface LoginRegisterLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const LoginRegisterLayout: FC<LoginRegisterLayoutProps> = ({ children, title, subtitle }) => {
  const [randomImage, setRandomImage] = useState<string>('');
  const [randomQuote, setRandomQuote] = useState<{ quote: string; name: string } | null>(null);

  useEffect(() => {
    const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * loginRegisterImages.length);
      return loginRegisterImages[randomIndex].img;
    };

    setRandomImage(getRandomImage());
  }, []);

  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    };

    setRandomQuote(getRandomQuote());
  }, []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white text-black dark:bg-stone-950 dark:text-stone-200">
      {/* Left side - hidden by default, visible after md */}
      <div className="hidden md:flex w-full md:w-[60%] flex-col p-10">
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-bold  bg-clip-text">
            InvoiceHub
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src={randomImage}
            alt="Random Nature"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        {randomQuote && (
          <div className="max-w-md mt-4">
            <p className="text-lg mb-2 italic">"{randomQuote.quote}"</p>
            <p className="text-stone-600 dark:text-stone-400 font-semibold">{randomQuote.name}</p>
          </div>
        )}
      </div>

      {/* Right side - form content */}
      <div className="w-full md:w-[40%] bg-white dark:bg-stone-900 p-10 flex flex-col justify-center relative">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <LanguageSelector />
          <ModeToggle />
        </div>
        <div className="md:hidden flex items-center space-x-2 mb-6">
          <div className="text-2xl font-bold">
            InvoiceHub
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
};

export default LoginRegisterLayout;