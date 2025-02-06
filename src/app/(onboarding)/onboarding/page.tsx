"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import ProfileForm from "@/components/profiles/ProfileForm";

export default function OnboardingPage() {
  return (
    <div className="h-screen overflow-auto w-screen flex items-center justify-center">
      <Card className="h-3/4 w-[450px] overflow-auto">
        <CardHeader>
          <CardTitle>Welcome to Flsh App</CardTitle>
          <CardDescription>
            We need the following information to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm onboarding />
        </CardContent>
      </Card>
    </div>
  );
}
