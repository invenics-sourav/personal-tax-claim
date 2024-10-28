import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Menu,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: FileText, label: 'Claims', href: '/claims' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav
        className={cn(
          'fixed top-0 left-0 h-full bg-card border-r transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <span className="text-lg font-semibold">Tax Claims Admin</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                'w-full justify-start mb-1',
                collapsed ? 'px-2' : 'px-4'
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </div>
      </nav>
      <main
        className={cn(
          'transition-all duration-300 min-h-screen bg-background',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}