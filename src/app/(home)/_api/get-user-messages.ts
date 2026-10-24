import type { UserMessagesPageData } from "@/src/lib/api/get-user-messages.api";

const DEFAULT_LIMIT = 5;

export async function getUserMessages({
  userId,
  pageParam,
}: {
  userId: string;
  pageParam: number;
}): Promise<UserMessagesPageData> {
  const search = new URLSearchParams({
    page: String(pageParam),
    limit: String(DEFAULT_LIMIT),
  });

  const response = await fetch(
    `/api/user-messages/${userId}?${search.toString()}`,
  );
  const payload: ApiResponse<UserMessagesPageData> = await response.json();

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : "Failed to load messages",
    );
  }

  return payload.data;
}
