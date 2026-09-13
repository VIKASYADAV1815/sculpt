import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { reportLovableError } from "../lib/lovable-error-reporting";
import SiteNav from "../components/SiteNav";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-light text-ink">404</h1>
        <h2 className="mt-4 text-xl font-light text-ink">Page not found</h2>
        <p className="mt-2 text-sm font-light text-ink-soft">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] font-light uppercase tracking-[0.34em] text-ink underline-offset-8 hover:underline"
          >
            ← Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-light tracking-tight text-ink">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm font-light text-ink-soft">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="text-[11px] font-light uppercase tracking-[0.34em] text-ink underline-offset-8 hover:underline"
          >
            Try again
          </button>
          <a
            href="/"
            className="text-[11px] font-light uppercase tracking-[0.34em] text-ink-soft underline-offset-8 hover:underline"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootComponent() {
  return (
    <>
      <SiteNav />
      <Outlet />
    </>
  );
}
