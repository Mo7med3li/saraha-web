"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Link2, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "cn";
import { Button, buttonVariants } from "@/src/components/ui/button";

const links = [
  { href: "/", label: "Inbox", icon: Inbox },
  { href: "/dashboard", label: "Share link", icon: Link2 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

type AppNavProps = {
  className?: string;
  brandHref?: string;
};

export default function AppNav({ className, brandHref = "/" }: AppNavProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "relative z-10 shrink-0 border-b border-[oklch(0.28_0.05_200/0.08)] bg-white/40 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-3 px-4 py-3.5 sm:px-8 lg:px-12">
        <Link
          href={brandHref}
          className="font-(family-name:--font-auth-display) shrink-0 text-2xl tracking-tight text-[oklch(0.28_0.05_200)] sm:text-3xl"
        >
          Saraha
        </Link>

        <nav
          aria-label="Main"
          className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-1.5"
        >
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: active ? "default" : "outline",
                    size: "sm",
                  }),
                  "h-9 rounded-xl",
                  active
                    ? "bg-[oklch(0.28_0.05_200)] text-white hover:bg-[oklch(0.24_0.05_200)]"
                    : "border-[oklch(0.28_0.05_200/0.15)] bg-white/60",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-xl border-[oklch(0.28_0.05_200/0.15)] bg-white/60"
            onClick={() => {
              signOut({ callbackUrl: "/login" });
            }}
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
