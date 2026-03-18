import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — requires backend
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex items-center justify-center py-12">
        <div className="bg-card border border-border rounded-lg p-8 w-full max-w-sm">
          <h1 className="font-display text-xl font-bold text-foreground mb-1">
            Sign In
          </h1>
          <p className="text-sm text-muted-foreground font-body mb-6">
            Access your TravelRecord account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-xs font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 font-body"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 font-body"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-gold-dark font-body"
            >
              Sign In
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4 font-body">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default LoginPage;
