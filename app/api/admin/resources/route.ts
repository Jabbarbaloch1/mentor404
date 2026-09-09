import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { makeSlug } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  description: z.string().min(1),
  type: z.enum(["TOOL", "CHEATSHEET", "LINK", "DOWNLOAD", "COURSE"]).default("TOOL"),
  url: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, tags: { include: { tag: true } } },
  });

  return NextResponse.json({ resources });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    let slug = data.slug ? makeSlug(data.slug) : makeSlug(data.title);
    const existing = await prisma.resource.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        type: data.type,
        url: data.url || null,
        fileUrl: data.fileUrl || null,
        icon: data.icon || null,
        featured: data.featured || false,
        published: data.published ?? true,
        categoryId: data.categoryId || null,
        authorId: session!.user!.id as string,
        tags: data.tagIds?.length
          ? { create: data.tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
