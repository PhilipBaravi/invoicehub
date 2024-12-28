import React from "react";
import { Code, Server } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import GithubIcon from "./GithubIcon";

interface RepoLink {
  name: string;
  url: string;
  icon: typeof Code;
}

const repos: RepoLink[] = [
  {
    name: "Front-end",
    url: "https://github.com/PhilipBaravi/invoicehub",
    icon: Code,
  },
  {
    name: "Back-end",
    url: "https://github.com/fai7h01/e-invoices",
    icon: Server,
  },
];

const GithubLinks: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:scale-110 transition w-12 h-12"
        >
          <GithubIcon styles="min-h-8 min-w-8 hover:scale-[1.05] transition" />
          <span className="sr-only">Open GitHub links</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        {" "}
        <h3 className="text-sm font-semibold mb-2 text-stone-800 dark:text-stone-200">
          Links to Repositories
        </h3>
        <div className="flex flex-col space-y-2">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
            >
              <repo.icon className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {repo.name}
              </span>
            </a>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GithubLinks;
