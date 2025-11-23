import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, LogOut } from 'lucide-react';
import { useRoleStore } from '@/stores/useRoleStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Notifications } from '@/components/Notifications';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const { role, setRole } = useRoleStore();
  const { user, logout } = useAuthStore();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {!isMobile && <AppSidebar />}
        
        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {isMobile ? (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                      <AppSidebar />
                    </SheetContent>
                  </Sheet>
                ) : (
                  <SidebarTrigger />
                )}
                <h1 className="text-xl font-bold text-primary">LastMile</h1>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="hidden sm:inline-flex">
                  Offline (Mock)
                </Badge>
                
                <Select value={role} onValueChange={(v) => setRole(v as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rider">Rider</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                {user && (
                  <>
                    <Notifications />
                    <span className="text-sm text-muted-foreground hidden md:inline">
                      {user.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
