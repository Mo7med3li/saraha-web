export async function getAllUsers() {
  const response = await fetch(`/api/all-users`);

  const payload: ApiResponse<IUser[]> = await response.json();

  if (!payload.success) {
    throw new Error("Failed to fetch all users");
  }

  return payload.data;
}
