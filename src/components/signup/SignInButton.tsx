"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

interface Props {
  text: string;
  callbackUrl?: string;
}

export default function SignInButton({ text, callbackUrl }: Props) {
  return (
    <button
      onClick={() =>
        signIn(undefined, {
          callbackUrl: callbackUrl ? `/${callbackUrl}` : "/dashboard",
        })
      }
      className="text-sm font-medium hover:underline underline-offset-4"
    >
      {text}
    </button>
  );
}
