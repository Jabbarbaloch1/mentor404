import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { makeSlug } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1).max(60),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true, resources: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const slug = makeSlug(data.name);

    const category = await prisma.category.create({
      data: { name: data.name, slug, color: data.color, icon: data.icon, description: data.description },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
