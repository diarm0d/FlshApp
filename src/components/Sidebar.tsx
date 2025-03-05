import SidebarItems from "./SidebarItems";

import { getUserAuth } from "@/lib/auth/utils";
import { CalendarHeart } from "lucide-react";
import { UserDetails } from "@/components/UserDetails";

const Sidebar = async () => {
  const session = await getUserAuth();
  if (session.session === null) return null;

  return (
    <aside className="h-screen min-w-52 bg-muted hidden md:block p-4 pt-8 border-r border-border shadow-inner">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          <CalendarHeart className="text-lg font-semibold ml-4" />
          <SidebarItems />
        </div>
        <UserDetails session={session} />
      </div>
    </aside>
  );
};

export default Sidebar;