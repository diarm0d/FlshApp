import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/utils";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      grantId?: string | null;
      profiles?: { id: string }[];
      subscription?: { stripeCustomerId: string } | null;
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
