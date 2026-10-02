"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { ShieldAlert, ShieldCheck, User } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AccountManagementTab from "./account-management-tab";
import ProfileTab from "./profile-tab";
import SecurityTab from "./security-tab";
import { ErrorBoundary } from "@/src/components/shared/error-boundry";

const STRUCTURE_TAB_VALUES = [
  "profile",
  "security",
  "account-management",
] as const;

type StructureTab = (typeof STRUCTURE_TAB_VALUES)[number];

function isStructureTab(value: string | null): value is StructureTab {
  return (
    value !== null &&
    (STRUCTURE_TAB_VALUES as readonly string[]).includes(value)
  );
}

const TABS_CONFIG = [
  {
    id: "profile" as const,
    label: "Profile",
    description: "Update personal details & pictures",
    icon: User,
    colorClass:
      "text-indigo-500 group-data-active:text-indigo-600 dark:group-data-active:text-indigo-400",
    badgeClass:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    id: "security" as const,
    label: "Security",
    description: "Password & security preferences",
    icon: ShieldCheck,
    colorClass:
      "text-emerald-500 group-data-active:text-emerald-600 dark:group-data-active:text-emerald-400",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "account-management" as const,
    label: "Account Management",
    description: "Freeze, restore or delete account",
    icon: ShieldAlert,
    colorClass:
      "text-rose-500 group-data-active:text-rose-600 dark:group-data-active:text-rose-400",
    badgeClass:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
];

export default function SettingsTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawTab = searchParams.get("tab");
  const tab: StructureTab = isStructureTab(rawTab) ? rawTab : "profile";

  const setTab = (value: string) => {
    if (!isStructureTab(value)) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", value);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-6">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {/* ── Modern Navigation Bar with Color Highlights ── */}
        <div className="w-full overflow-x-auto pb-1 scrollbar-none">
          <TabsList
            variant="default"
            className="inline-flex h-auto w-full justify-start sm:justify-center rounded-2xl bg-muted/60 p-1.5 backdrop-blur-md border border-border/80 shadow-xs"
          >
            {TABS_CONFIG.map(({ id, label, icon: Icon, colorClass }) => (
              <TabsTrigger
                key={id}
                value={id}
                className="group flex flex-1 items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ease-in-out hover:text-foreground data-active:bg-background data-active:text-foreground data-active:shadow-md dark:data-active:bg-background/90"
              >
                <Icon
                  className={`size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${colorClass}`}
                />
                <span className="truncate">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ── Tabs── */}
        <div className="mt-6">
          {/* PROFILE TAB PANEL */}
          <TabsContent
            value="profile"
            className="focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300"
          >
            <ErrorBoundary fallback={<div className="text-center">Error</div>}>
              <ProfileTab />
            </ErrorBoundary>
          </TabsContent>

          {/* SECURITY TAB PANEL */}
          <TabsContent
            value="security"
            className="focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300"
          >
            <ErrorBoundary fallback={<div className="text-center">Error</div>}>
              <SecurityTab />
            </ErrorBoundary>
          </TabsContent>

          {/* ACCOUNT MANAGEMENT TAB PANEL */}
          <TabsContent
            value="account-management"
            className="focus-visible:outline-none focus-visible:ring-0 animate-in fade-in-50 duration-300"
          >
            <ErrorBoundary fallback={<div className="text-center">Error</div>}>
              <AccountManagementTab />
            </ErrorBoundary>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
