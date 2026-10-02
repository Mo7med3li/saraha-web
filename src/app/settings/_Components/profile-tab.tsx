"use client";

import { Loader2, X, User } from "lucide-react";
import { useProfile } from "../_hooks/use-query-profile";

import PersonalInfo from "./personal-info";
import ProfileAvatarSection from "./profile-avatar-section";
import { UserGallery } from "./user-gallery";

export default function ProfileTab() {
  const { data: user, isLoading: isProfileLoading, error } = useProfile();

  if (isProfileLoading) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-12 flex flex-col items-center justify-center space-y-4 min-h-100">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full bg-primary/20" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Loading profile data…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-12 flex flex-col items-center justify-center space-y-4 min-h-100">
          <div className="p-3 rounded-xl bg-red-500/10">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Failed to load profile data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Profile Settings
          </h1>
        </div>
        <p className="text-sm text-muted-foreground pl-1">
          Manage your profile information, avatar, and gallery
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* ── SECTION 1: PROFILE PICTURE UPLOADER (/users/profile-image) ── */}
        <ProfileAvatarSection user={user!} />

        {/* ── SECTION 2: GENERAL PROFILE DETAILS ── */}
        <PersonalInfo user={user!} />

        {/* ── SECTION 3: PROFILE GALLERY MANAGER (/users/profile-gallery) ── */}
        <UserGallery user={user!} />
      </div>
    </div>
  );
}
