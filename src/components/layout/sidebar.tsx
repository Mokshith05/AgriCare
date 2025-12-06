'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react';

const menuItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/encyclopedia',
    label: 'Encyclopedia',
    icon: BookOpen,
  },
  {
    href: '/preventive-care',
    label: 'Preventive Care',
    icon: ShieldCheck,
  },
  {
    href: '/logbook',
    label: 'Field Logbook',
    icon: ClipboardList,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold text-foreground">
            AgriProtect AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                as={Link}
                href={item.href}
                isActive={pathname === item.href}
                tooltip={{
                  children: item.label,
                }}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <div className="p-4 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            <p>&copy; {new Date().getFullYear()} AgriProtect AI</p>
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}
