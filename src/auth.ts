import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      authorize: async (credentials) => {
        const response = await fetch(`${process.env.DATABASE_URL}/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const payload: ApiResponse<ILoginResponse> = await response.json();
        if (!payload.success) {
          throw new Error(payload.message);
        }
        const data = payload.data!;
        return {
          id: data.user._id,
          token: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        token.user = user.user;
        token.token = user.token;
        token.refreshToken = user.refreshToken;
      }
      if (trigger === "update" && user) {
        token.user = session?.user;
        token.token = session?.accessToken;
        token.refreshToken = session?.refreshToken;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },
};
