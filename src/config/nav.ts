import { SidebarLink } from "@/components/SidebarItems";
import {
  Cog,
  User,
  HomeIcon,
  Clock,
  UserPen,
  Calendar,
} from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/bookings", title: "Bookings", icon: Calendar },
  {
    href: "/profiles",
    title: "Profile",
    icon: UserPen,
  },
  {
    href: "/available-times",
    title: "Availability",
    icon: Clock,
  },
  { href: "/account", title: "Account", icon: User },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [
  // {
  //   // title: "Entities",
  //   links: [
  //     // {
  //     //   href: "/available-times",
  //     //   title: "Availability",
  //     //   icon: Clock,
  //     // },
  //     // {
  //     //   href: "/profiles",
  //     //   title: "Profile",
  //     //   icon: UserPen,
  //     // },
  //   ],
  // },
];
