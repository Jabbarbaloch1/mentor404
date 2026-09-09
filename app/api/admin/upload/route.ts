import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "File storage isn't configured yet. Add BLOB_READ_WRITE_TOKEN to your environment." },
        { status: 500 }
      );
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
