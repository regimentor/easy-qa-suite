import { ModeToggle } from "@/components/mode-toggle";
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
      <div className="flex items-center justify-center h-screen">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex flex-row border-b sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-lg font-semibold [&.active]:text-blue-400 hover:text-blue-300 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/projects"
              className="text-lg font-semibold [&.active]:text-blue-400 hover:text-blue-300 transition-colors"
            >
              Projects
            </Link>
          </div>
        </nav>
        <ModeToggle />
      </header>

      <main className="flex-1 container mx-auto px-4">
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({
  component: () => <Index />,
});
