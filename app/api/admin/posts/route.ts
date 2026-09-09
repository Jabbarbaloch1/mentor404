import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { makeSlug, estimateReadTime } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  scheduledAt: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const posts = await prisma.post.findMany({
    where: status ? { status: status as "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED" } : undefined,
    orderBy: { updatedAt: "desc" },
    include: { category: true, tags: { include: { tag: true } } },
  });

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = postSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    let slug = data.slug ? makeSlug(data.slug) : makeSlug(data.title);

    // Ensure slug uniqueness
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        coverImage: data.coverImage || null,
        status: data.status,
        featured: data.featured || false,
        readTimeMin: estimateReadTime(data.content),
        categoryId: data.categoryId || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        authorId: session!.user!.id as string,
        tags: data.tagIds?.length
          ? { create: data.tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
