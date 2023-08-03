import { prisma } from "@/services/prismaClient";
import { getServerSession } from "@/lib/auth/authorization";
import { getFilterParams } from "@/lib/params-utils";
import { NextRequest, NextResponse } from "next/server";
import { ClientCategory } from "@prisma/client";

async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user || !["ADMIN", "CLIENT"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { page, page_size, categories, search, gender } = getFilterParams(req);
  try {
    const users = await prisma.user.findMany({
      skip: (page || 1 - 1) * (page_size || 20),
      take: page_size,
      where: {
        role: "CLIENT",
        OR: search
          ? [
              {
                firstName: {
                  contains: search,
                },
                lastName: {
                  contains: search,
                },
                email: {
                  contains: search,
                },
              },
            ]
          : undefined,
        client: {
          gender: gender || undefined,
          OR: categories?.length ? categories.map((cat: ClientCategory) => ({
              category: cat,
            })) : undefined
        }
      },
      include: {
        client: true,
      },
    });
    return NextResponse.json({
      data: users.map((user) => ({
        ...user,
        ...user.client,
        password_hash: undefined,
        client: undefined,
      })),
      count: users.length,
      page,
      page_size,
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export { GET };
