import { FC, ReactNode, useEffect, useState } from 'react';
import { ModeToggle } from '@/components/dashboard/layout/ModeToggle';
import LanguageSelector from './new-login-page/LanguageSelector';
import { quotes } from './new-login-page/quotes';
import axios from 'axios';

interface LoginRegisterLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const LoginRegisterLayout: FC<LoginRegisterLayoutProps> = ({ children, title, subtitle }) => {
  // const [imageUrl, setImageUrl] = useState<string>('');
  const [randomQuote, setRandomQuote] = useState<{ quote: string; name: string } | null>(null);

  // useEffect(() => {
  //   // Fetch a random nature image from Unsplash using axios
  //   const fetchRandomImage = async () => {
  //     try {
  //       const response = await axios.get('https://api.unsplash.com/photos/random', {
  //         params: {
  //           query: 'nature',
  //           orientation: 'landscape',
  //           client_id: 'YOUR_UNSPLASH_API_KEY',
  //         },
  //       });
  //       setImageUrl(response.data.urls.regular);
  //     } catch (error) {
  //       console.error('Error fetching the image:', error);
  //     }
  //   };

  //   fetchRandomImage();
  // }, []);

  useEffect(() => {
    // Get a random quote
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
        <div className="text-2xl font-bold">Logo</div>
        {/* <div className="flex-1 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="Random Nature" className="w-full h-auto object-cover" />
          ) : (
            <p>Loading image...</p>
          )}
        </div> */}
        {randomQuote && (
          <div className="max-w-md mt-4">
            <p className="text-lg mb-2">"{randomQuote.quote}"</p>
            <p className="text-stone-600 dark:text-stone-400">{randomQuote.name}</p>
          </div>
        )}
      </div>

      {/* Right side - form content */}
      <div className="w-full md:w-[40%] bg-white dark:bg-stone-900 p-10 flex flex-col justify-center relative">
        <div className="absolute top-4 right-4 flex items-center space-x-4">
          <LanguageSelector />
          <ModeToggle />
        </div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
};

export default LoginRegisterLayout;
