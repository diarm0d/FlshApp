import { db } from "@/lib/db/index";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";
import GoogleProvider from "next-auth/providers/google";

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

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      grantId?: string;
      profiles?: { id: string }[];
      subscription?: { stripeCustomerId: string } | null;
    };
  } | null;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  callbacks: {
    session: async ({ session, user }) => {
      const userDetails = await db.user.findUnique({
        where: { id: user.id },
        select: {
          grantId: true,
          profiles: {
            select: {
              id: true,
            },
          },
          subscription: {
            select: {
              stripeCustomerId: true,
            },
          },
        },
      });

      // Assign the additional info to the session
      if (userDetails) {
        session.user.grantId = userDetails.grantId;
        session.user.profiles = userDetails.profiles;
        session.user.subscription = userDetails.subscription;
      }

      session.user.id = user.id;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export const getUserAuth = async () => {
  const session = await getServerSession(authOptions);
  return { session } as AuthSession;
};

export const checkAuth = async () => {
  const { session } = await getUserAuth();

  if (!session) redirect("/api/auth/signin");

  if (!session.user.profiles || session.user.profiles.length === 0)
    redirect("/onboarding");

  if (!session.user.grantId) redirect("/onboarding/calendar");

  if (!session.user.subscription?.stripeCustomerId)
    redirect("/onboarding/subscribe");
};
