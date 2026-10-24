import Link from "next/link";
import { buttonVariants } from "@/src/components/ui/button";
import { cn } from "cn";

export default function SharedUserNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-[oklch(0.985_0.01_200)] px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Link unavailable
      </p>
      <h1 className="max-w-md text-3xl font-semibold tracking-tight">
        This Saraha link doesn’t exist or the account is unavailable.
      </h1>
      <Link
        href="/"
        className={cn(buttonVariants({ size: "lg" }), "mt-2 rounded-xl")}
      >
        Go home
      </Link>
    </main>
  );
}
