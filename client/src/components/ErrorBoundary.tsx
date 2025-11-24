import { Component, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <Alert className="max-w-md" data-testid="alert-error-boundary">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>
              <h2 className="font-semibold mb-2">Something went wrong</h2>
              <p className="text-sm mb-4 text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
              </p>
              <Button
                onClick={this.handleReset}
                variant="outline"
                size="sm"
                data-testid="button-error-reset"
              >
                Return to Home
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
