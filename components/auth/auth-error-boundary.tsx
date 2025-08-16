"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAuthError, AuthErrorType } from "@/lib/sentry-auth-client";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Capture auth-specific error in Sentry
    captureAuthError(
      error,
      AuthErrorType.SESSION_ERROR,
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: "AuthErrorBoundary",
        timestamp: new Date().toISOString(),
      }
    );
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <CardTitle className="text-red-600">Erreur d&apos;authentification</CardTitle>
              <CardDescription>
                Une erreur inattendue s&apos;est produite lors du processus d&apos;authentification.
                Notre équipe a été automatiquement notifiée.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <Button 
                onClick={this.handleRetry} 
                className="w-full"
                variant="default"
              >
                Réessayer
              </Button>
              
              <Button 
                onClick={this.handleReload} 
                className="w-full"
                variant="outline"
              >
                Recharger la page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}