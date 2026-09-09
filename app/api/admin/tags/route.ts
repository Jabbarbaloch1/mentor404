import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { makeSlug } from "@/lib/utils";

const schema = z.object({ name: z.string().min(1).max(40) });

export async function GET() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ tags });
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

    const slug = makeSlug(parsed.data.name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: parsed.data.name, slug },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
