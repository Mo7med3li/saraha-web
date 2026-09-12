import { JSON_HEADER } from "@/src/lib/constants/api.constant";

export async function loginWithGoogleIdToken(
  tokenId: string,
): Promise<ILoginResponse> {
  const response = await fetch(
    `${process.env.DATABASE_URL}/auth/signup-google`,
    {
      method: "POST",
      headers: {
        ...JSON_HEADER,
      },
      body: JSON.stringify({ idToken: tokenId }),
    },
  );

  const payload: ApiResponse<ILoginResponse> = await response.json();
  console.log("Google OAuth response", payload);
  if (!payload.success) {
    throw new Error(payload.message);
  }

  return payload.data!;
}

export async function loginWithCredentials(
  email: string | undefined,
  password: string | undefined,
): Promise<ILoginResponse> {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const response = await fetch(`${process.env.DATABASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      ...JSON_HEADER,
    },
  });
  const payload: ApiResponse<ILoginResponse> = await response.json();
  if (!payload.success) {
    throw new Error(payload.message);
  }
  const data = payload.data!;
  return data;
}
