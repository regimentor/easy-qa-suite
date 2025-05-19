import { LoginForm } from "@/units/auth/login-form";
import {
  $userIsAuthenticeted,
  isAuthenticatedFx,
} from "@/units/user/user.store";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useUnit } from "effector-react";
import { useEffect } from "react";

const Index = () => {
  const [isAuthenticated, isAuthenticatedPending, userIsAuthenticeted] =
    useUnit([
      isAuthenticatedFx,
      isAuthenticatedFx.pending,
      $userIsAuthenticeted,
    ]);

  useEffect(() => {
    isAuthenticated();
  }, [isAuthenticated]);

  if (isAuthenticatedPending) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-zinc-900">
        <div className="loader"></div>
      </div>
    );
  }

  if (!userIsAuthenticeted) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-zinc-900">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-zinc-900 text-white h-screen w-full">
      <header className="border-b border-zinc-700 bg-zinc-900">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-lg font-semibold [&.active]:text-blue-400 hover:text-blue-300 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-lg font-semibold [&.active]:text-blue-400 hover:text-blue-300 transition-colors"
            >
              About
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4">
        <Outlet />
      </main>

      <footer className="bg-zinc-900 border-t border-zinc-700 py-3">
        <div className="container mx-auto px-4 text-center text-zinc-400 text-sm">
          &copy; {new Date().getFullYear()} EasyQASuite - All rights reserved
        </div>
      </footer>

      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({
  component: () => <Index />,
});
