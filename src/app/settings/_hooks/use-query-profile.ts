"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileData } from "../_apis/profile.api";

export function useProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfileData,
  });

  return { data, isLoading, error };
}
