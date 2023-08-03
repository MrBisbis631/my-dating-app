import { getServerSession } from "@/lib/auth/authorization";
import { NextRequest, NextResponse } from "next/server";
import { updatePasswordSchema } from "@/lib/validators/users";
import { prisma } from "@/services/prismaClient";
import { comparePassword, hashPassword } from "@/lib/auth/password-utils";

async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = updatePasswordSchema.parse(req.body);
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (
      !user ||
      !(await comparePassword(data.oldPassword, user.password_hash))
    ) {
      return NextResponse.json(
        { error: "User not found or password don't match" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password_hash: await hashPassword(data.newPassword),
      },
    });

    return NextResponse.json({ message: "Password updated" }, { status: 201 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export { PUT };
