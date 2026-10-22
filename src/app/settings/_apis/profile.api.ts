export async function getProfileData() {
  const response = await fetch(`/api/profile`);

  const payload: ApiResponse<{ user: IUser }> = await response.json();

  if (!payload.success) {
    throw new Error("Failed to fetch profile data");
  }

  return payload.data?.user;
}
