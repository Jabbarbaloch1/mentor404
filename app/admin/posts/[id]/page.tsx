import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Edit post</h1>
      <PostForm
        postId={post.id}
        initial={{
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          status: post.status,
          featured: post.featured,
          categoryId: post.categoryId,
          tagIds: post.tags.map((t) => t.tagId),
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
        }}
      />
    </div>
  );
}
