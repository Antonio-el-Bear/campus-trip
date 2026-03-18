import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-accent" />
              <span className="font-display text-base font-bold">
                TravelRecord
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70 max-w-sm leading-relaxed">
              A passionate directory for structured travel documentation.
              Search, discover, and connect with experienced travelers
              worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-primary-foreground/50 mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/search"
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Search Trips
                </Link>
              </li>
              <li>
                <Link
                  to="/directory"
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Member Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-primary-foreground/50 mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-primary-foreground/10 space-y-4">
          <p className="text-[10px] text-primary-foreground/40 leading-relaxed max-w-3xl">
            <strong className="text-primary-foreground/50">Disclaimer:</strong>{' '}
            TravelRecord is not involved in the consultancy, organisation, or
            execution of any trip. All arrangements are exclusively between the
            trip author and the client. TravelRecord bears no responsibility for
            any outcomes, disputes, or issues arising from such consultancy or
            assistance. Our sole role is to display trips, present trip authors,
            and facilitate contact between them and other registered members.
          </p>
          <p className="text-xs text-primary-foreground/40">
            © 2026 TravelRecord. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
