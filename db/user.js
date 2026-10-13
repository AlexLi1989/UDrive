import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

async function createUser({ email, password, username }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });
    return user;
  } catch (error) {
    //ensure no simultaneous user creation with same email
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("EmailAlreadyExists");
    }
    throw error;
  }
}

async function findUserEmail({ email }) {
  return (await prisma.user.findUnique({ where: { email: email } }))
    ? true
    : false;
}

export { createUser, findUserEmail };
