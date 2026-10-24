"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserMessages } from "../_api/get-user-messages";

export function useFetchUserMessages(userId: string) {
  const query = useInfiniteQuery({
    queryKey: ["user-messages", userId],
    queryFn: ({ pageParam }) =>
      getUserMessages({ userId, pageParam }),
    initialPageParam: 1,
    enabled: Boolean(userId),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages) {
        return undefined;
      }
      return lastPage.page + 1;
    },
  });

  const messages =
    query.data?.pages.flatMap((page) => page.messages) ?? [];

  return {
    messages,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}
