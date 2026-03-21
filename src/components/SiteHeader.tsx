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
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <Globe className="h-5 w-5 text-accent" />
          <span className="font-display text-lg font-bold text-foreground tracking-tight">
            TravelRecord
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.href
                  ? 'text-foreground bg-secondary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
