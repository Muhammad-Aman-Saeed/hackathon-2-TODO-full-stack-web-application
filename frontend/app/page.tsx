'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/auth/sign-up');
    }
  };

  const handleSignIn = () => {
    router.push('/auth/sign-in');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-pulse text-2xl font-semibold text-slate-600 dark:text-slate-300">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 flex flex-col justify-center">
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-4">Welcome to Hackathon Todo App</h1>
                <p className="text-lg opacity-90">
                  Professional task management solution for your productivity needs.
                  Organize, track, and achieve your goals with ease.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <CardDescription>
                  {isAuthenticated
                    ? "You're logged in! Access your dashboard or continue exploring."
                    : "Join us today to start managing your tasks efficiently."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <Button
                  onClick={handleGetStarted}
                  className="w-full py-6 text-lg"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Sign Up'}
                </Button>

                {!isAuthenticated && (
                  <Button
                    variant="outline"
                    onClick={handleSignIn}
                    className="w-full py-6 text-lg"
                  >
                    Sign In
                  </Button>
                )}

                <div className="mt-6 text-center text-sm text-gray-500">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Hackathon Todo App. All rights reserved.
        </div>
      </div>
    </div>
  );
}