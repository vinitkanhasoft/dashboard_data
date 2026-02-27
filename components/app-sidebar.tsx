"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Vrl23N_uke2OXapUMBcJWXJd8G94ZcYDbQ&s",
    url: "/profile",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Lifecycle", url: "/lifecycle", icon: IconListDetails },
    { title: "Analytics", url: "/analytics", icon: IconChartBar },
    { title: "Projects", url: "/projects", icon: IconFolder },
    { title: "Team", url: "/team", icon: IconUsers },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "/capture",
      items: [
        { title: "Active Proposals", url: "/capture/active" },
        { title: "Archived", url: "/capture/archived" },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "/proposal",
      items: [
        { title: "Active Proposals", url: "/proposal/active" },
        { title: "Archived", url: "/proposal/archived" },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "/prompts",
      items: [
        { title: "Active Proposals", url: "/prompts/active" },
        { title: "Archived", url: "/prompts/archived" },
      ],
    },
  ],
  navSecondary: [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Get Help", url: "/help", icon: IconHelp },
    { title: "Search", url: "/search", icon: IconSearch },
  ],
  documents: [
    { name: "Data Library", url: "/data-library", icon: IconDatabase },
    { name: "Reports", url: "/reports", icon: IconReport },
    { name: "Word Assistant", url: "/word-assistant", icon: IconFileWord },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() // current route

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/") // for nested routes

  return (
    <Sidebar collapsible="offcanvas" className="z-50" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <Link href="/" className="flex items-center gap-2">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        {/* Main Navigation */}
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            className: isActive(item.url)
              ? "bg-accent text-accent-foreground rounded-md"
              : "hover:bg-red-100 hover:text-black",
          }))}
        />

        {/* Documents */}
        <NavDocuments
          items={data.documents.map((item) => ({
            ...item,
            className: isActive(item.url)
              ? "bg-accent text-accent-foreground rounded-md"
              : "hover:bg-accent/20 hover:text-accent-foreground rounded-md",
          }))}
        />

        {/* Secondary Navigation */}
        <NavSecondary
          items={data.navSecondary.map((item) => ({
            ...item,
            className: isActive(item.url)
              ? "bg-accent text-accent-foreground rounded-md"
              : "hover:bg-accent/20 hover:text-accent-foreground rounded-md",
          }))}
          className="mt-auto"
        />
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
} 