import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SubscriberGateProps {
  feature: string;
}

const SubscriberGate = ({ feature }: SubscriberGateProps) => {
  return (
    <div className="bg-secondary/50 border border-border rounded-lg p-6 text-center">
      <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-3" />
      <h4 className="font-display text-sm font-semibold text-foreground mb-1">
        Subscriber Access Required
      </h4>
      <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
        {feature} is available exclusively to premium subscribers.
      </p>
      <Link to="/register">
        <Button
          size="sm"
          className="bg-accent text-accent-foreground hover:bg-gold-dark font-body text-xs"
        >
          Upgrade to Access
        </Button>
      </Link>
    </div>
  );
};

export default SubscriberGate;
