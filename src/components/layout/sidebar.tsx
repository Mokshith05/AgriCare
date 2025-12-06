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
  Wand2,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function AppSidebar() {
  const pathname = usePathname();
  const { getTranslation } = useLanguage();

  const menuItems = [
    {
      href: '/',
      labelKey: 'dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/encyclopedia',
      labelKey: 'encyclopedia',
      icon: BookOpen,
    },
    {
      href: '/preventive-care',
      labelKey: 'preventiveCare',
      icon: ShieldCheck,
    },
    {
      href: '/logbook',
      labelKey: 'fieldLogbook',
      icon: ClipboardList,
    },
    {
      href: '/recommendations',
      labelKey: 'recommendations',
      icon: Wand2,
    }
  ];

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
                  children: getTranslation(`keyMapping.${item.labelKey}`),
                }}
              >
                <item.icon />
                <span>{getTranslation(`keyMapping.${item.labelKey}`)}</span>
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
