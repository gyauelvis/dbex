"use server";

import { saltAndHashPassword } from "./saltAndHashPassword";
import { createNewUser } from "./lib/actions";
import { redirect } from "next/navigation";

export const registerUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const hashedPassword = await saltAndHashPassword(password);
    const isCreateUser = await createNewUser(email, hashedPassword);
    if (isCreateUser) {
      console.log("User created successfully 2");
      redirect("/signIn");
    }
    throw new Error("User not created");
  } catch (error) {
    console.error(error);
    throw error;
  }
};
