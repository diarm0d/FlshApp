"use client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthSession } from "@/lib/auth/utils";
import { signOut } from "next-auth/react";

export const UserDetails = ({ session }: { session: AuthSession }) => {
  if (session.session === null) return null;
  const { user } = session.session;

  if (!user?.name || user.name.length == 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0">
          <div className="flex items-center justify-between w-full border-t border-border pt-4 px-2">
            <div className="text-muted-foreground">
              <p className="text-xs pr-4">{user.name ?? "John Doe"}</p>
              <p className="text-xs font-light pr-4">
                {user.email ?? "john@doe.com"}
              </p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image} />
              <AvatarFallback className="border-border border-2 text-muted-foreground">
                {user.name
                  ? user.name
                      ?.split(" ")
                      .map((word) => word[0].toUpperCase())
                      .join("")
                  : "~"}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
