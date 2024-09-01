import Response from "@/lib/api.response";
import { prisma } from "@/lib/prisma";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const data: Prisma.UserCreateInput = {
      name: payload.name,
      email: payload.email,
      password: bcrypt.hashSync(payload.password, 8),
    };

    const user = await prisma.user.create({
      data,
    });
    
    const dataResponse: Partial<User> = {
      ...user,
      password: undefined,
    };

    return Response({
      message: "Signup success",
      data: dataResponse,
    });
  } catch (error: any) {
    console.log(error)

    return Response({
      message: "Sign up failed",
      data: error,
      status: 500,
    });
  }
}
