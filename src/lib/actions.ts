"use server";

import { auth } from "@/auth";
import { prisma } from "../lib/prisma";
import { Connection, User } from "@prisma/client/edge";
import { unstable_noStore as noStore } from "next/cache";
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from "../../utils/supabase/server";

// CREATE
export const createConnection = async (data: any): Promise<Connection> => {
  return await prisma.connection.create({
    data: data,
  });
};

export const createQuery = async (data: any) => {
  await prisma.query.create({
    data: data,
  });
};

// READ
export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  noStore();

  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user || null;
};

export const fetchConnections = async (): Promise<Connection[]> => {
  noStore();

  const session = await auth();
  const authId = session?.user?.id;

  return prisma.connection.findMany({
    where: {
      userId: authId,
    },
  });
};

export const fetchConnectionById = async (id: string) => {
  noStore();

  const session = await auth();
  const authId = session?.user?.id;

  const connection: Connection | null = await prisma.connection.findFirst({
    where: {
      id: id,
      userId: authId,
    },
  });

  return connection;
};

export const fetchAllQueries = async () => {
  noStore();

  const session = await auth();
  const authId = session?.user?.id;

  const queries = await prisma.query.findMany({
    include: {
      relatedConnection: true,
    },
    where: {
      userId: authId,
    },
  });
  return queries;
};

export const fetchQuerybyId = async (id: string) => {
  noStore();

  const session = await auth();
  const authId = session?.user?.id;

  const query = await prisma.query.findFirst({
    where: {
      id: id,
      userId: authId,
    },
  });

  return query;
};

// DELETE
export const deleteConnection = async (id: string): Promise<Connection> => {
  // edit this later
  const deletedConnection = await prisma.connection.delete({
    where: {
      id: id,
    },
  });
  return deletedConnection;
};

export const Analytics = async () => {
  const queries = await prisma.query.count();
  const connection = await prisma.connection.count();

  return { queries, connection };
};

export const SendMail = async (email: string, message: string) => {
  const apiEndpoint = '/api/email';

  fetch(apiEndpoint, {
    method: 'POST',
    body: JSON.stringify({email,message}),
  })
    .then((res) => res.json())
    .then((response) => {
      alert(response.message);
    })
    .catch((err) => {
      alert(err);
    });
};


export async function login({email, password}:{email:string, password: string}) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  

  const { error } = await supabase.auth.signInWithPassword({email, password})

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup({email, password}:{email:string, password: string}) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error } = await supabase.auth.signUp({email, password})

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('app/home')
}