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
import styles from "./root.module.css";

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
      <div className={styles.loadingWrap}>
        <div className={styles.loader} />
      </div>
    );
  }

  if (!userIsAuthenticeted) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginToggle}>
          <ModeToggle />
        </div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className={styles.appWrap}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink} activeProps={{ className: styles.navLink + " " + styles.active }}>
              Home
            </Link>
            <Link to="/projects" className={styles.navLink} activeProps={{ className: styles.navLink + " " + styles.active }}>
              Projects
            </Link>
          </div>
        </nav>
        <ModeToggle />
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({
  component: () => <Index />,
});
