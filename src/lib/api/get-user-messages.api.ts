import { JSON_HEADER } from "../constants/api.constant";

export type UserMessagesPageData = {
  messages: IMessage[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function getUserMessages({
  userId,
  page = "1",
  limit = "10",
  signature,
  token,
}: {
  userId: string;
  page?: string;
  limit?: string;
  signature: string;
  token: string;
}) {
  const url = new URL(`${process.env.DATABASE_URL}/messages/${userId}`);
  url.searchParams.set("page", page);
  url.searchParams.set("limit", limit);

  const response = await fetch(url.toString(), {
    next: {
      tags: ["user-messages", userId],
    },
    headers: {
      ...JSON_HEADER,
      Authorization: `${signature} ${token}`,
    },
  });

  const payload: ApiResponse<UserMessagesPageData> = await response.json();
  return payload;
}
