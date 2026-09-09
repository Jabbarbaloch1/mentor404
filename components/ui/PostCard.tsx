import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { formatDate } from "@/lib/utils";

export type PostCardData = {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  readTimeMin?: number | null;
  views?: number;
  publishedAt?: Date | string | null;
  category?: { name: string; slug: string; color?: string | null; icon?: string | null } | null;
};

export default function PostCard({
  post,
  featured = false,
}: {
  post: PostCardData;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`glow-card group flex flex-col overflow-hidden rounded-2xl ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-bg-elevated ${
          featured ? "aspect-[16/9] md:aspect-auto md:w-1/2" : "aspect-[16/10]"
        }`}
      >
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 768px) 400px, 100vw"
          />
        ) : (
          <div className="bg-grid flex h-full w-full items-center justify-center">
            <span className="font-mono-cyber text-3xl text-ink-faint">
              404
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
        {post.category && (
          <div className="absolute left-3 top-3">
            <CategoryBadge
              name={post.category.name}
              color={post.category.color}
              icon={post.category.icon}
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center p-5">
        <h3
          className={`font-display font-semibold leading-snug text-ink transition-colors group-hover:text-indigo-bright ${
            featured ? "text-xl" : "text-base"
          }`}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-dim">
            {post.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-4 text-xs text-ink-faint">
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          {post.readTimeMin && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readTimeMin} min
            </span>
          )}
          {typeof post.views === "number" && (
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {post.views}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
