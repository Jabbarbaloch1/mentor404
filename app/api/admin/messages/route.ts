import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ messages });
}
