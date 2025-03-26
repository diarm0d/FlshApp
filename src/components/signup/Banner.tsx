import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Banner() {
  return (
    <div className="w-full bg-[#04ABEF] py-1 px-4 text-center">
      <Link
        href="/sign-in"
        className="inline-flex items-center justify-center text-sm font-bold text-white hover:underline"
      >
        Flsh.app is currently in beta, sign up to notified for alpha release
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
}
