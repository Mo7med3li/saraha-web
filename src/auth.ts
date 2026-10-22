import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
  loginWithCredentials,
  loginWithGoogleIdToken,
} from "./app/api/auth.api";

const ACCESS_TOKEN_LIFETIME_MS = 30 * 60 * 1000; // 30 minutes

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    // Keep the NextAuth session alive for 7 days. The backend access token
    // rotates every 30 min via `accessTokenExpires`; the session container
    // must outlive it so the refresh token is still available when needed.
    maxAge: 7 * 24 * 60 * 60,
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
          // Custom field — tracks the BACKEND access token's real expiry.
          // Deliberately NOT using `exp`: NextAuth's own encode() recalculates
          // `exp` on every re-encode based on session.maxAge, so any value we
          // set there gets silently overwritten on the next session check.
          token.accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
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
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
      }

      if (trigger === "update" && session) {
        token.user = session?.user;
        token.token = session?.accessToken;
        token.refreshToken = session?.refreshToken;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME_MS;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },
};
