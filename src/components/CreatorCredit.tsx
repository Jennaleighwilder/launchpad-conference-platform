import Link from 'next/link';

const CREATOR_NAME = process.env.NEXT_PUBLIC_CREATOR_NAME || 'Jennaleigh Wilder';
const CREATOR_URL = process.env.NEXT_PUBLIC_CREATOR_URL || 'https://github.com/Jennaleighwilder';

export function CreatorCredit() {
  return (
    <footer className="py-3 text-center">
      <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
        Created by{' '}
        <Link
          href={CREATOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}
        >
          {CREATOR_NAME}
        </Link>
      </p>
    </footer>
  );
}
