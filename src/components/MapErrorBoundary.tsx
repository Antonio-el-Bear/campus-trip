import React from 'react';

interface Props {
  children: React.ReactNode;
  fallbackHeight?: string;
}

interface State {
  hasError: boolean;
}

class MapErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground"
          style={{ height: this.props.fallbackHeight || '280px' }}
        >
          Map could not be loaded
        </div>
      );
    }
    return this.props.children;
  }
}

export default MapErrorBoundary;
