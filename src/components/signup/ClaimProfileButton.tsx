"use client";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ClaimProfileButton() {
  return (
    <div className="w-full max-w-xl">
      <Card className="flex items-center justify-between p-1 rounded-md bg-card border-2 border-secondary-foreground shadow-[4px_4px_0px_0px_theme('colors.secondary.foreground')]  hover:shadow-[1px_1px_0px_0px_theme('colors.secondary.foreground')] hover:translate-y-[2px] transition-all duration-150">
        <div className="flex items-center gap-2 px-3">
          <Link className="w-5 h-5 text-primary" />
          <div className="flex items-center">
            <span className="text-lg">
              flsh.app/s/
              {/* <span className="text-muted-foreground">name</span> */}
            </span>
            <Input
              className=" ml-1 pl-0 text-lg border-transparent focus:border-transparent focus:ring-0 hover:border-transparent focus-visible:ring-0"
              type="text"
              placeholder="username"
            />
          </div>
        </div>
        <Button variant="default" className="rounded-md">
          Claim
        </Button>
      </Card>
    </div>
  );
}
