import { Link, useLocation } from 'react-router-dom';
import { Search, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SiteHeader = () => {
  const location = useLocation();

  const navLinks = [
    { label: 'Search Trips', href: '/search' },
    { label: 'AI Trip Builder', href: '/ai-trip-builder' },
    { label: 'Members', href: '/directory' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="border-b border-border bg-card">
      <div className="container flex flex-col sm:flex-row h-auto sm:h-16 items-stretch sm:items-center justify-between p-0 sm:p-0">
        <div className="flex items-center gap-2.5 py-3 sm:py-0 justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Globe className="h-5 w-5 text-accent" />
            <span className="font-display text-lg font-bold text-foreground tracking-tight">
              TravelRecord
            </span>
          </Link>
        </div>

        <nav
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 sm:gap-1 w-full sm:w-auto overflow-x-auto"
          style={{ maxWidth: '100vw' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`w-full sm:w-auto px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm font-medium rounded-none sm:rounded-md transition-colors text-center ${
                location.pathname === link.href
                  ? 'text-foreground bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
              style={{ minWidth: 0 }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 py-2 sm:py-0 justify-center sm:justify-end">
          <Link to="/search">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm" className="font-body text-sm">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button
              size="sm"
              className="font-body text-sm bg-accent text-accent-foreground hover:bg-gold-dark"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
