import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { makeSlug } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().optional(),
  summary: z.string().optional().nullable(),
  objective: z.string().optional().nullable(),
  impact: z.string().optional().nullable(),
  content: z.string().optional(),
  domain: z
    .enum(["WEB", "NETWORK", "MALWARE", "FORENSICS", "CLOUD", "MOBILE", "OSINT", "OTHER"])
    .optional(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  toolsUsed: z.array(z.string()).optional(),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const entry = await prisma.labEntry.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ entry });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const existing = await prisma.labEntry.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let slug = existing.slug;
    if (data.slug || data.title) {
      const candidate = makeSlug(data.slug || data.title || existing.title);
      if (candidate !== existing.slug) {
        const clash = await prisma.labEntry.findUnique({ where: { slug: candidate } });
        slug = clash ? `${candidate}-${Date.now().toString(36)}` : candidate;
      }
    }

    const entry = await prisma.labEntry.update({
      where: { id },
      data: { ...data, slug },
    });

    return NextResponse.json({ entry });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.labEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
