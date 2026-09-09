import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { read: body.read ?? true },
  });

  return NextResponse.json({ message });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
