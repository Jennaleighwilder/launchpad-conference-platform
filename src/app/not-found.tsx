import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-[8rem] font-bold text-[#4FFFDF]/20 leading-none">404</h1>
        <p className="text-2xl text-white mt-4 mb-2">Event not found</p>
        <p className="text-white/50 mb-8">This event doesn&apos;t exist or has been removed.</p>
        <Link
          href="/create"
          className="inline-block px-8 py-3 bg-[#4FFFDF] text-black font-semibold rounded-lg hover:bg-[#4FFFDF]/90 transition-colors"
        >
          Create Your Own Event
        </Link>
      </div>
    </div>
  );
}
