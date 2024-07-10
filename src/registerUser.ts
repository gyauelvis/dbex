import { saltAndHashPassword } from "./saltAndHashPassword"
import { createNewUser } from "./lib/actions";

export const registerUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const hashedPassword = await saltAndHashPassword(password);
    const isCreateUser = await createNewUser(email, hashedPassword);
    if (isCreateUser) return true;
    throw new Error("User not created");
  } catch (error) {
    console.error(error);
    throw error; 
  }
};
