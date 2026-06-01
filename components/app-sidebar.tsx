"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  IconPencil,
  IconPencilPlus,
  IconPencilCheck,
  IconWriting,
  IconSignature,
  IconEdit,
  IconFilePencil,
  IconClipboardText,
} from "@tabler/icons-react";


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      role: ["admin", "judge"]
    },
    {
      title: "Results",
      url: "/dashboard/result",
      icon: IconFolder,
      role: ["admin"]

    },
    {
      title: "Leaderboard",
      url: "/dashboard/leaderboard",
      icon: IconFolder,
      role: ["admin"]

    },
    {
      title: "Judges",
      url: "/dashboard/judges",
      icon: IconListDetails,
      role: ["admin"]

    },
    {
      title: "Competitions",
      url: "/dashboard/competitions",
      icon: IconFolder,
      role: ["admin", "judge"]

    },
    {
      title: "Category",
      url: "/dashboard/category",
      icon: IconChartBar,
      role: ["admin"]
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: IconUsers,
      role: ["admin"]
    },
    {
      title: "Evaluation",
      url: "/dashboard/evaluation",
      icon: IconWriting,
      role: ["judge"]
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("userRole") || "admin"); // fallback to admin for safety, or we could use null
    }
  }, []);

  const filteredNavMain = React.useMemo(() => {
    if (!role) return [];
    return data.navMain.filter((item) => item.role?.includes(role));
  }, [role]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                {/* <IconInnerShadowTop className="size-5!" /> */}
                <span className="text-base font-semibold">Liquidix</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
