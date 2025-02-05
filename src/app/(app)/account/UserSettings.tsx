"use client";
import UpdateNameCard from "./UpdateNameCard";
import UpdateEmailCard from "./UpdateEmailCard";
import UpdateProfileImage from "./UpdateProfileImage";
import { AuthSession } from "@/lib/auth/utils";

export default function UserSettings({
  session,
}: {
  session: AuthSession["session"];
}) {
  return (
    <>
      <UpdateNameCard name={session?.user.name ?? ""} />
      <UpdateEmailCard email={session?.user.email ?? ""} />
      <UpdateProfileImage image={session?.user.image ?? ""} />
    </>
  );
}
