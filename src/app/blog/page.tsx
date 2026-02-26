import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/data/blog-posts';

export default function BlogPage() {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Blog</h1>
        <p className="mb-12" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          Product updates, event planning guides, and industry insights.
        </p>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} className="block mb-16 group">
          <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <Image src={featured.image} alt="" width={800} height={450} className="w-full h-64 md:h-80 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
          </div>
          <span className="text-xs uppercase tracking-wider px-2 py-1 rounded" style={{ background: 'rgba(79,255,223,0.15)', color: 'var(--color-accent)' }}>{featured.category}</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-2 group-hover:text-[var(--color-accent)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>{featured.title}</h2>
          <p className="mb-2" style={{ color: 'var(--color-text-muted)' }}>{featured.excerpt}</p>
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{featured.date} · {featured.author}</span>
        </Link>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <Image src={post.image} alt="" width={400} height={225} className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
              </div>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}>{post.category}</span>
              <h3 className="font-semibold mt-2 mb-1 group-hover:text-[var(--color-accent)] transition-colors">{post.title}</h3>
              <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{post.excerpt}</p>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{post.date}</span>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-20 p-8 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-xl font-semibold mb-2">Get the latest</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Event planning tips and product updates in your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="you@company.com" className="flex-1 px-4 py-3 rounded-lg bg-transparent border" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }} />
            <button type="submit" className="px-6 py-3 rounded-lg font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>Subscribe</button>
          </form>
        </div>
      </div>
    </main>
  );
}
