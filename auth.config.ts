import type { NextAuthConfig } from "next-auth";

const authConfig: NextAuthConfig = {
  // ← type annotation instead of satisfies
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
};

export { authConfig }; // ← explicit export at bottom, not inline
