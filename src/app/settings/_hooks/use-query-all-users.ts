"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../_apis/all-users.api";

export function useAllUsers(enabled: boolean = true) {
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
    enabled,
  });

  return { users, isLoading, error };
}
