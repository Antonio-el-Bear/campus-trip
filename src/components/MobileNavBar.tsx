import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Profile', href: '/dashboard', icon: User },
];

export default function MobileNavBar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  if (!isMobile) return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around items-center h-14 md:hidden">
      {navItems.map(({ label, href, icon: Icon }) => (
        <Link
          key={href}
          to={href}
          className={`flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors ${
            location.pathname === href
              ? 'text-accent'
              : 'text-muted-foreground hover:text-accent'
          }`}
        >
          <Icon className="h-5 w-5 mb-0.5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
