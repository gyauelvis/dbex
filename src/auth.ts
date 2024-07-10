import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./saltAndHashPassword";
import { findUniqueUser } from "./lib/actions";
import type { Provider } from "next-auth/providers";

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

      const user = await findUniqueUser(email);

      if (user?.password != null && password) {
        const isPasswordCorrect = await comparePassword(
          password,
          user.password
        );
        if (isPasswordCorrect) return user;
        else throw new Error("User Not Found");
      }
      return null;
    },
  }),
];


export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/signIn",
  },
});
