"use client";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  beta?: string;
}


export default function ClaimProfileButton({ beta }: Props) {
  useEffect(() => {
    if (beta === "true") {
      toast.success("sign up successful!");
    }
  }, [beta]);

  const handleClaim = () => {
    signIn(undefined, { callbackUrl: "/?beta=true" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClaim();
    }
  };

  return (
    <div className="w-full max-w-xl">
      <Card className="flex items-center justify-between p-1 rounded-md bg-card border-2 border-secondary-foreground shadow-[4px_4px_0px_0px_theme('colors.secondary.foreground')]  hover:shadow-[1px_1px_0px_0px_theme('colors.secondary.foreground')] hover:translate-y-[2px] transition-all duration-150">
        <div className="flex items-center gap-2 px-3">
          <Link className="w-5 h-5 text-primary" />
          <div className="flex items-center">
            <span className="text-lg">flsh.app/s/</span>
            <Input
              className=" ml-1 pl-0 text-lg border-transparent focus:border-transparent focus:ring-0 hover:border-transparent focus-visible:ring-0"
              type="text"
              placeholder="username"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <Button onClick={handleClaim} variant="default" className="rounded-md">
          Claim
        </Button>
      </Card>
    </div>
  );
}
