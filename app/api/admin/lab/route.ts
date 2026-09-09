import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { makeSlug } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().optional(),
  summary: z.string().optional().nullable(),
  objective: z.string().optional().nullable(),
  impact: z.string().optional().nullable(),
  content: z.string().min(1),
  domain: z
    .enum(["WEB", "NETWORK", "MALWARE", "FORENSICS", "CLOUD", "MOBILE", "OSINT", "OTHER"])
    .default("WEB"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  toolsUsed: z.array(z.string()).optional(),
  coverImage: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const entries = await prisma.labEntry.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ entries });
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
    const existing = await prisma.labEntry.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const entry = await prisma.labEntry.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary || null,
        objective: data.objective || null,
        impact: data.impact || null,
        content: data.content,
        domain: data.domain,
        difficulty: data.difficulty,
        toolsUsed: data.toolsUsed || [],
        coverImage: data.coverImage || null,
        published: data.published || false,
        authorId: session!.user!.id as string,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
