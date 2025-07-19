import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-lg text-red-800">
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-red-700 text-sm">
              We encountered an unexpected error. Please try again.
            </p>
            <Button 
              onClick={this.handleRetry}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;