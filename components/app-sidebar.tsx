"use client"

import * as React from "react"
import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconInnerShadowTop,
} from "@tabler/icons-react"
import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser, UserButton } from "@clerk/nextjs"

const data = {
  navMain: [
    { title: "Dashboard", url: "#", icon: IconDashboard },
    { title: "Students", url: "#", icon: IconListDetails },
    { title: "Courses", url: "#", icon: IconChartBar },
    { title: "Analytics", url: "#", icon: IconFolder },
    { title: "Reports", url: "#", icon: IconUsers },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return null // optional: add a skeleton loader

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Jain University</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
        {/* You can also keep Clerk’s default user menu if you like */}
        {/* <UserButton afterSignOutUrl="/" /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
