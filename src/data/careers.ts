/** Job listings — Wintercircus Ghent, Exhibitly-style */

export const CAREERS_LOCATION = {
  name: 'Wintercircus',
  city: 'Ghent',
  country: 'Belgium',
  tagline: 'The silicon valley of Belgium',
  description: '15,000m² tech hub in the heart of Ghent. 40+ startups, imec.istart accelerator, De Krook innovation district. Rooftop bar, event spaces, and a community of builders.',
};

export const CAREERS_PERKS = [
  { label: 'Equity', desc: 'Founding team equity' },
  { label: 'Wintercircus HQ', desc: 'Work from our Ghent hub' },
  { label: 'Hybrid / Remote', desc: 'Flexible EU arrangements' },
  { label: 'Founding team', desc: 'Shape the product from day one' },
];

export const CAREERS_FAQ = [
  { q: 'What is the interview process?', a: 'Initial call (30 min) → Technical/case (1 hr) → Team fit (45 min). We move fast — typically 1–2 weeks from first contact to offer.' },
  { q: 'Do you sponsor visas?', a: 'Yes, for EU-based roles. We work with relocation partners for non-EU candidates.' },
  { q: 'Is remote an option?', a: 'Yes. Most roles are hybrid (2–3 days/week at Wintercircus) or fully remote within EU.' },
  { q: 'What\'s the salary range?', a: 'Each role lists a range. We benchmark at market rate and add equity for founders.' },
];

export const JOBS = [
  {
    slug: 'founding-software-engineer',
    title: 'Founding Software Engineer',
    department: 'Engineering',
    location: 'Hybrid · Wintercircus Ghent',
    salary: '€70K–€110K',
    equity: 'Yes',
    tags: ['React', 'Next.js', 'TypeScript', 'Supabase', 'OpenAI'],
    status: 'URGENT',
    description: 'Join as the founding engineer. You\'ll own the core product — AI event generation, real-time APIs, and the platform that powers our customers\' conferences. We ship fast.',
    responsibilities: [
      'Build and maintain the event generation pipeline',
      'Integrate AI (OpenAI, future models) for speaker, venue, schedule generation',
      'Own the Supabase schema and API design',
      'Collaborate with design on product decisions',
    ],
    requirements: [
      '4+ years full-stack experience',
      'Strong TypeScript/React/Next.js',
      'Experience with APIs, databases, real-time systems',
      'Comfortable in early-stage ambiguity',
    ],
  },
  {
    slug: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    department: 'Engineering',
    location: 'Hybrid · Wintercircus Ghent',
    salary: '€80K–€120K',
    equity: 'Yes',
    tags: ['Python', 'OpenAI', 'LLMs', 'Prompt Engineering', 'RAG'],
    status: 'URGENT',
    description: 'Own the AI layer. Our 5-agent swarm generates speakers, venues, schedules, pricing, and branding in under 60 seconds. You\'ll refine prompts, add new models, and scale the system.',
    responsibilities: [
      'Optimize and extend the multi-agent generation pipeline',
      'Integrate new LLM providers (Claude, Gemini, open-source)',
      'Build RAG and caching for venue/speaker data',
      'Improve output quality and consistency',
    ],
    requirements: [
      '3+ years ML/AI experience',
      'Hands-on with LLMs (OpenAI, Anthropic, or open-source)',
      'Python + TypeScript',
      'Interest in event/domain-specific AI',
    ],
  },
  {
    slug: 'growth-marketing-lead',
    title: 'Growth Marketing Lead',
    department: 'Marketing',
    location: 'Remote EU',
    salary: '€60K–€90K',
    equity: 'Yes',
    tags: ['SEO', 'Content', 'Paid', 'Community', 'Events'],
    status: '',
    description: 'Build the growth engine. Launchpad is B2B — event organizers, agencies, enterprises. You\'ll own content, SEO, paid, and community to drive signups and conversions.',
    responsibilities: [
      'Build and execute the content/SEO strategy',
      'Run paid campaigns (LinkedIn, Google)',
      'Grow community (events, webinars, partnerships)',
      'Own the funnel from signup to paid',
    ],
    requirements: [
      '4+ years B2B growth marketing',
      'Experience with SEO, content, paid',
      'Data-driven, comfortable with analytics',
      'EU-based, remote-first',
    ],
  },
  {
    slug: 'product-designer',
    title: 'Product Designer',
    department: 'Design',
    location: 'Hybrid · Wintercircus Ghent',
    salary: '€55K–€85K',
    equity: 'Yes',
    tags: ['Figma', 'Design Systems', 'UX', 'Prototyping'],
    status: '',
    description: 'Shape the product experience. From the event creation wizard to the generated event pages, you\'ll craft interfaces that make AI feel magical and accessible.',
    responsibilities: [
      'Design the core product flows (create, customize, event pages)',
      'Build and maintain the design system',
      'Collaborate with engineering on implementation',
      'Run user research and iterate',
    ],
    requirements: [
      '3+ years product design',
      'Strong Figma and prototyping skills',
      'Portfolio with SaaS or B2B products',
      'Comfortable in early-stage, fast iteration',
    ],
  },
  {
    slug: 'devops-infrastructure-engineer',
    title: 'DevOps/Infrastructure Engineer',
    department: 'Engineering',
    location: 'Remote EU',
    salary: '€65K–€100K',
    equity: 'Yes',
    tags: ['Vercel', 'Supabase', 'Docker', 'CI/CD', 'Monitoring'],
    status: '',
    description: 'Build the platform that runs reliably at scale. Vercel, Supabase, Stripe — you\'ll own the infrastructure, CI/CD, and observability.',
    responsibilities: [
      'Manage Vercel, Supabase, and related infra',
      'Set up CI/CD pipelines',
      'Implement monitoring and alerting',
      'Ensure security and compliance (GDPR, etc.)',
    ],
    requirements: [
      '3+ years DevOps/infrastructure',
      'Experience with Vercel, Supabase, or similar',
      'Strong security and compliance awareness',
      'EU-based, remote-first',
    ],
  },
];
