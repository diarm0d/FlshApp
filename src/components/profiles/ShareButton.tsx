"use client";

import { useState, useCallback } from "react";
import { Share2Icon, CheckIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const url = `${window.location.href.split("#")[0]}`; // Ensures no hash fragments
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full cursor-pointer hover:bg-secondary/80 active:scale-95"
            onClick={handleCopy}
          >
            {copied ? <CheckIcon className="text-green-500" /> : <Share2Icon />}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          {copied ? "Copied!" : "Copy link"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShareButton;
