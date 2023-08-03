import { getServerSession } from "@/lib/auth/authorization";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  return NextResponse.json({
    authorized: session,
  });
}