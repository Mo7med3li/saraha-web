import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
  loginWithCredentials,
  loginWithGoogleIdToken,
} from "./app/api/auth.api";

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
        const data = await loginWithCredentials(
          credentials?.email,
          credentials?.password,
        );
        return {
          id: data.user._id,
          token: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account, trigger, session }) => {
      if (account?.provider === "google") {
        if (!account.id_token) {
          throw new Error("Google ID token missing");
        }
        try {
          const data = await loginWithGoogleIdToken(account.id_token);
          token.user = data.user;
          token.token = data.accessToken;
          token.refreshToken = data.refreshToken;
          return token;
        } catch (error) {
          console.error(error);
          throw new Error("Failed to login with Google");
        }
      }

      // Credentials (and other providers that return our User shape)
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
