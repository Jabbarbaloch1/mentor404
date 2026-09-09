import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { makeSlug } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["TOOL", "CHEATSHEET", "LINK", "DOWNLOAD", "COURSE"]).optional(),
  url: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

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
    const existing = await prisma.resource.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let slug = existing.slug;
    if (data.slug || data.title) {
      const candidate = makeSlug(data.slug || data.title || existing.title);
      if (candidate !== existing.slug) {
        const clash = await prisma.resource.findUnique({ where: { slug: candidate } });
        slug = clash ? `${candidate}-${Date.now().toString(36)}` : candidate;
      }
    }

    if (data.tagIds) {
      await prisma.resourceTag.deleteMany({ where: { resourceId: id } });
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        description: data.description,
        type: data.type,
        url: data.url,
        fileUrl: data.fileUrl,
        icon: data.icon,
        featured: data.featured,
        published: data.published,
        categoryId: data.categoryId,
        tags: data.tagIds?.length
          ? { create: data.tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
    });

    return NextResponse.json({ resource });
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
    await prisma.resource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
