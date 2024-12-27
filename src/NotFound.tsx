import { Link } from "react-router-dom";
import { FC, memo } from "react";
import { Button } from "@/components/ui/button";
import { HomeIcon, AlertTriangle } from "lucide-react";

const NotFound: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 px-4 text-center">
      <div className="space-y-6 max-w-md">
        <AlertTriangle className="mx-auto h-24 w-24 text-stone-400" />
        <h1 className="text-4xl font-bold text-stone-800">
          404 - Page Not Found
        </h1>
        <p className="text-xl text-stone-600">
          Oops! It seems you've ventured into uncharted territory. The page
          you're looking for doesn't exist or may have been moved.
        </p>
        <Button asChild className="bg-stone-800 hover:bg-stone-700 text-white">
          <Link to="/" className="inline-flex items-center">
            <HomeIcon className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default memo(NotFound);
