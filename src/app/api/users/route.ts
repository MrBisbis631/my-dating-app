import { prisma } from "@/services/prismaClient";
import { getServerSession } from "@/lib/auth/authorization";
import { getPaginationParams } from "@/lib/params-utils";
import { NextRequest, NextResponse } from "next/server";
import { partialUpdateUsersSchema } from "@/lib/validators/users";

async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user || !["ADMIN", "CLIENT"].includes(session.user.role)) {
    console.log(session);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { page, page_size } = getPaginationParams(new URL(req.nextUrl));
  try {
    const users = await prisma.user.findMany({
      skip: (page - 1) * page_size,
      take: page_size,
      where: {
        role: session.user.role === "ADMIN" ? undefined : "CLIENT",
      },
      include: {
        client: true,
        matchmaker: true,
      },
    });
    return NextResponse.json({
      users: users.map((user) => ({ ...user, password_hash: undefined })),
      count: users.length,
      page,
      page_size,
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = partialUpdateUsersSchema.parse(req.body);
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
    });

    return NextResponse.json(updatedUser, { status: 201 })
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export { GET, PUT };