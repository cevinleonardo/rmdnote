import { Home, List, PlusCircle, Calendar, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home, to: '/dashboard' },
  { id: 'tasks', label: 'Tugas', icon: List, to: '/tasks' },
  { id: 'create', label: 'Tambah', icon: PlusCircle, to: '/task/create' },
  { id: 'calendar', label: 'Kalender', icon: Calendar, to: '/calendar' },
  { id: 'account', label: 'Akun', icon: User, to: '/account' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex">
        {navItems.map(({ id, label, icon: Icon, to }) => {
          const isActive = location.pathname === to;
          
          return (
            <Link
              key={id}
              to={to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 px-1 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}