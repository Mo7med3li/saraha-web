type IProfileData = { user: IUser & IUserMessages };

function profileEndpoint() {
  if (typeof window !== "undefined") {
    return "/api/profile";
  }

  const base = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  return `${base}/api/profile`;
}

export async function getProfileData() {
  const init: RequestInit = {
    next: {
      tags: ["user-profile"],
    },
  };

  // Server → /api/profile does not auto-send the browser cookie; forward it.
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    init.headers = {
      Cookie: cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; "),
    };
  }

  const response = await fetch(profileEndpoint(), init);

  const payload: ApiResponse<IProfileData> = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error("Failed to fetch profile data");
  }

  return payload.data?.user;
}
