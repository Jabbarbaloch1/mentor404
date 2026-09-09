import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LabForm from "@/components/admin/LabForm";

export default async function EditLabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await prisma.labEntry.findUnique({ where: { id } });

  if (!entry) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit lab entry</h1>
      <LabForm entryId={entry.id} initial={entry} />
    </div>
  );
}
