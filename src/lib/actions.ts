"use server";

import { prisma } from "../lib/prisma";
import { Connection, Query } from "@prisma/client/edge";
import { unstable_noStore as noStore } from "next/cache";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export const fetchAllConnections = async () => {
  noStore();

  const connections: Connection[] = await prisma.connection.findMany();
  return connections;
};

export const fetchConnectionById = async ({ id }: { id: string }) => {
  noStore();

  const connection: Connection | null = await prisma.connection.findFirst({
    where: {
      id: id,
    },
  });

  return connection;
};

export const fetchAllQueries = async () => {
  noStore();

  const queries = await prisma.query.findMany({
    include: {
      relatedConnection: true,
    },
  });
  return queries;
};

export const createNewUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  console.log("Entering createNewUser function");
  noStore();
  const name = email.split("@")[0];
  console.log(`Creating user with name: ${name} and email: ${email}`);

  try {
    console.log("Attempting to create user in the database...");
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
    console.log("User created successfully");
    return true;
  } catch (e) {
    console.error("Error creating user:", e);
    return false;
  }
};

export const findUniqueUser = async (email: string) => {
  noStore();
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
};

export const signUserIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  console.log(`signing ${email}`);
  try {
    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (result.error) console.error(result.error);
    else console.log("Signed in successfully");
  } catch (error) {
    console.error("Error signing in:", error);
  }
};

export const authSignIn = async (provider: { id: string; name: string }) => {
  const { id, name } = provider;
  try {
    await signIn(id);
  } catch (error) {
    if (error instanceof AuthError) {
      return redirect(`${error.type}`);
    }
    throw error;
  }
};
