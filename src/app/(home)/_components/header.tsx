"use client";

import { Button } from "@/src/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <Button
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
  );
}
