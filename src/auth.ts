import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./saltAndHashPassword";
import { findUniqueUser } from "./lib/actions";
import type { Provider } from "next-auth/providers";
import {createSession} from "./lib/actions";

const providers: Provider[] = [
  GitHub,
  Google,
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      const { email, password } = credentials as {
        email: string;
        password: string;
      };
      console.log("checking credentials");
      const user = await findUniqueUser(email);
      console.log(user);
      console.log("checking password");
      if (user?.password != null && password) {
        const isPasswordCorrect = await comparePassword(
          password,
          user.password
        );
        if (isPasswordCorrect) {
          console.log("password correct and successful");
          const isSession = await createSession(user.id);
          if (isSession)return user;
        } else throw new Error("User Not Found");
      }
      return null;
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      
      return token
    },
    async session({ session, user}) {
      session.user = user
      return session
    },
  },
  pages: {
    signIn: "/signIn",
  }
});
