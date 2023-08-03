import { authOptions } from "@/config/nextAuth";
import { prisma } from "@/services/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { signUpClientSchema } from "@/lib/validators/auth";
import { hashPassword } from "@/lib/auth/password-utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    // validate body
    const newClientData = signUpClientSchema.parse(body);
    // create new client
    const newClient = await prisma.user.create({
      data: {
        firstName: newClientData.firstName,
        lastName: newClientData.lastName,
        phoneNumber: newClientData.phoneNumber,
        email: newClientData.email,
        password_hash: await hashPassword(newClientData.password),
        role: "CLIENT",
        client: {
          create: {
            birthday: newClientData.birthday,
            category: newClientData.category as "SINGLE" | "DIVORCED",
            gender: newClientData.gender as "MALE" | "FEMALE",
            aboutMe: newClientData.aboutMe,
          },
        },
      },
    });
    return NextResponse.json(
      { ...newClient, password_hash: undefined },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        error: "Invalid data",
      },
      { status: 400 }
    );
  }
}
