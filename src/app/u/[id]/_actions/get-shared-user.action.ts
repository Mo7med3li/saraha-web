"use server";

export async function getSharedUserAction(userId: string) {
  const response = await fetch(`${process.env.DATABASE_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 60,
      tags: [`shared-user-${userId}`],
    },
  });

  const payload: ApiResponse<{ user: IUser }> = await response.json();

  if (!response.ok || !payload.success || !payload.data?.user) {
    return null;
  }

  return payload.data.user;
}
