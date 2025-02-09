import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import { getUserAuth } from "@/lib/auth/utils";
import { getUserSubscriptionPlan } from "@/lib/stripe/subscription";
import { ManageUserSubscriptionButton } from "@/app/(app)/account/billing/ManageSubscription";
import { storeSubscriptionPlans } from "@/config/subscriptions";

const CalGif = "/calgif2.gif";

export default async function OnboardingPaymentPage() {
  const { session } = await getUserAuth();
  const subscriptionPlan = await getUserSubscriptionPlan();
  const baseSubscription = storeSubscriptionPlans[0];
  return (
    <div className="h-screen overflow-auto w-screen flex items-center justify-center">
      <Card className="h-3/4 w-[450px] overflow-auto">
        <CardHeader>
          <CardTitle>Final step!</CardTitle>
          <CardDescription>Please subscribe to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src={CalGif}
            alt="almost done"
            className="rounded-md w-full mb-4"
            width={420}
            height={420}
          />
          <ManageUserSubscriptionButton
            userId={session.user.id}
            email={session.user.email || ""}
            stripePriceId={baseSubscription.stripePriceId}
            stripeCustomerId={subscriptionPlan?.stripeCustomerId}
            isSubscribed={!!subscriptionPlan.isSubscribed}
            isCurrentPlan={subscriptionPlan?.name === baseSubscription.name}
            onboarding
          />
        </CardContent>
      </Card>
    </div>
  );
}
