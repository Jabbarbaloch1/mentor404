import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { makeSlug, estimateReadTime } from "@/lib/utils";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { category: true, tags: { include: { tag: true } } },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
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
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let slug = existing.slug;
    if (data.slug || data.title) {
      const candidate = makeSlug(data.slug || data.title || existing.title);
      if (candidate !== existing.slug) {
        const clash = await prisma.post.findUnique({ where: { slug: candidate } });
        slug = clash ? `${candidate}-${Date.now().toString(36)}` : candidate;
      }
    }

    // Replace tags if provided
    if (data.tagIds) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
    }

    const wasPublished = existing.status === "PUBLISHED";
    const willBePublished = data.status === "PUBLISHED";

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        status: data.status,
        featured: data.featured,
        readTimeMin: data.content ? estimateReadTime(data.content) : undefined,
        categoryId: data.categoryId,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        publishedAt: !wasPublished && willBePublished ? new Date() : undefined,
        tags: data.tagIds?.length
          ? { create: data.tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
    });

    return NextResponse.json({ post });
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
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
