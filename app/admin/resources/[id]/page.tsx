import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResourceForm from "@/components/admin/ResourceForm";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = await prisma.resource.findUnique({ where: { id } });

  if (!resource) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit resource</h1>
      <ResourceForm resourceId={resource.id} initial={resource} />
    </div>
  );
}
