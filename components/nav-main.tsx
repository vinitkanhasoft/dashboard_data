"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
  }[]
}) {
  const pathname = usePathname()

  const isActive = (url: string) =>
    pathname === url || pathname.startsWith(url + "/")

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const active = isActive(item.url)

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`
                  cursor-pointer
                  rounded-md
                  px-3 py-2
                  flex items-center gap-2
                  transition-colors duration-200

                  ${
                    active
                      ? "bg-black text-white pointer-events-none"
                      : "hover:bg-accent/20 hover:text-accent-foreground"
                  }
                `}
              >
                <Link
                  href={item.url}
                  className="flex items-center gap-2 w-full"
                >
                  {item.icon && (
                    <item.icon className="size-4 shrink-0" />
                  )}
                  <span className="text-sm font-medium">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}