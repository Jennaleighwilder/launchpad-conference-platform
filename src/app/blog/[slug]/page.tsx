import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/data/blog-posts';
import { ARTICLE_CONTENT } from '@/data/blog-articles';
import { BlogContent } from '@/components/BlogContent';
import { BlogParallaxBackground } from '@/components/BlogParallaxBackground';

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = ARTICLE_CONTENT[post.slug] || post.excerpt;

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg)' }}>
      <BlogParallaxBackground />
      <article className="max-w-3xl mx-auto px-6 py-16 relative z-10">
        <Link href="/blog" className="text-sm mb-8 inline-block" style={{ color: 'var(--color-accent)' }}>← Back to Blog</Link>
        <span className="text-xs uppercase tracking-wider px-2 py-1 rounded" style={{ background: 'rgba(79,255,223,0.15)', color: 'var(--color-accent)' }}>{post.category}</span>
        <h1 className="text-4xl font-bold mt-4 mb-6" style={{ fontFamily: 'var(--font-display)' }}>{post.title}</h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>{post.date} · {post.author}</p>
        <div className="rounded-xl overflow-hidden mb-12" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <Image src={post.image} alt="" width={800} height={450} className="w-full h-64 md:h-80 object-cover" />
        </div>
        <BlogContent content={content} />
        <div className="mt-12 pt-8 flex gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--color-accent)' }}>Share on X</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent((process.env.NEXT_PUBLIC_APP_URL || 'https://launchpad-conference-platform.vercel.app') + '/blog/' + slug)}`} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--color-accent)' }}>Share on LinkedIn</a>
        </div>
      </article>
    </main>
  );
}
