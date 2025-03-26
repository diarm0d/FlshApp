"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
      className="text-sm font-medium hover:underline underline-offset-4"
    >
      Sign In
    </button>
  );
}
