export type SpeakerSession = {
  title: string;
  stage: string;
  time: string;
  day: number;
  type: 'keynote' | 'talk' | 'panel' | 'workshop' | 'fireside';
};

export type PastEvent = {
  name: string;
  year: number;
  role: string;
  location?: string;
};

export type Article = {
  title: string;
  outlet: string;
  url: string;
  date: string;
};

export type Award = {
  name: string;
  org: string;
  year: number;
};

export type Socials = {
  twitter?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  youtube?: string;
};

export type Speaker = {
  id: string;
  name: string;
  title: string;
  company: string;
  role: string;
  flag: string;
  img: string;
  bio: [string, string];
  talk: { title: string; track: string; time: string; desc: string };
  panels: { title: string; time: string; stage?: string }[];
  pastEvents: PastEvent[];
  articles: Article[];
  awards: Award[];
  schedule: SpeakerSession[];
  socials: Socials;
};

export const SPEAKERS: Speaker[] = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    title: 'CTO',
    company: 'TechForge',
    role: 'CTO, TechForge',
    flag: '🇺🇸',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
    bio: [
      'Sarah Chen doesn\'t just build products — she builds the future. As CTO of TechForge, she\'s shipped AI tools that 2 million developers use every day. Her keynotes at AWS re:Invent and Grace Hopper have left audiences on their feet. She\'s the engineer who turned "impossible" into "shipped."',
      'Before TechForge, she led teams at Google and Stripe. MIT PhD. Forbes Top 50 Women in Tech. And she\'s just getting started. When Sarah takes the stage, you\'ll understand why developers call her talks "career-changing."',
    ],
    talk: { title: 'Building AI-First Products', track: 'AI & Machine Learning', time: 'Day 1, 09:00', desc: 'Learn how to design and ship products that put AI at the center of the user experience. Sarah shares lessons from building tools used by 2M+ developers, including strategies for handling edge cases, maintaining quality at scale, and creating delightful AI interactions.' },
    panels: [{ title: 'The Future of Developer Tools', time: 'Day 1, 14:30', stage: 'Main Stage' }, { title: 'Women in Tech Leadership', time: 'Day 2, 11:00', stage: 'Community Stage' }],
    pastEvents: [
      { name: 'AWS re:Invent', year: 2024, role: 'Keynote Speaker', location: 'Las Vegas' },
      { name: 'TechCrunch Disrupt', year: 2024, role: 'Panelist', location: 'San Francisco' },
      { name: 'SXSW Tech', year: 2023, role: 'Featured Speaker', location: 'Austin' },
      { name: 'Web Summit', year: 2023, role: 'Speaker', location: 'Lisbon' },
      { name: 'Grace Hopper Celebration', year: 2022, role: 'Keynote', location: 'Orlando' },
    ],
    articles: [
      { title: 'Why AI-First Design Changes Everything', outlet: 'TechCrunch', url: 'https://techcrunch.com', date: 'Nov 2024' },
      { title: 'The Future of Developer Tools', outlet: 'Forbes', url: 'https://forbes.com', date: 'Sep 2024' },
      { title: 'Sarah Chen on Scaling AI at TechForge', outlet: 'The Information', url: 'https://theinformation.com', date: 'Jul 2024' },
    ],
    awards: [
      { name: 'Top 50 Women in Tech', org: 'Forbes', year: 2024 },
      { name: 'Innovation in AI', org: 'MIT Technology Review', year: 2023 },
      { name: 'Engineering Excellence Award', org: 'TechForge', year: 2022 },
    ],
    schedule: [
      { title: 'Building AI-First Products', stage: 'Main Stage', time: '09:00–09:45', day: 1, type: 'keynote' },
      { title: 'The Future of Developer Tools', stage: 'Main Stage', time: '14:30–15:30', day: 1, type: 'panel' },
      { title: 'Women in Tech Leadership', stage: 'Community Stage', time: '11:00–12:00', day: 2, type: 'panel' },
    ],
    socials: { twitter: 'https://twitter.com/sarahchen', linkedin: 'https://linkedin.com/in/sarahchen', website: 'https://sarahchen.io', github: 'https://github.com/sarahchen' },
  },
  {
    id: 'marcus-berg',
    name: 'Marcus Berg',
    title: 'CEO',
    company: 'EventScale',
    role: 'CEO, EventScale',
    flag: '🇩🇪',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
    bio: [
      'Marcus Berg turned a crazy idea into 10,000 events across 50 countries. EventScale didn\'t just scale — it rewrote the playbook for how the world gathers. Y Combinator alum. TechCrunch darling. The Economist called him "the future of events."',
      'He\'s the founder who shows up, the speaker who makes you believe, and the operator who actually ships. From Eventbrite to building his own empire, Marcus brings the energy of a packed room to every stage he touches.',
    ],
    talk: { title: 'Scaling Events to 10K Attendees', track: 'Startup Growth', time: 'Day 1, 10:30', desc: 'From 100 to 10,000 attendees: Marcus walks through the operational, technical, and community challenges of scaling events. Discover the playbook EventScale uses to help organizers grow without losing the magic of intimate gatherings.' },
    panels: [{ title: 'Event Tech Trends 2026', time: 'Day 1, 16:00', stage: 'Startup Stage' }, { title: 'Founder Stories: Building in Events', time: 'Day 2, 09:30', stage: 'Main Stage' }],
    pastEvents: [
      { name: 'Web Summit', year: 2024, role: 'Speaker', location: 'Lisbon' },
      { name: 'Event Tech Live', year: 2024, role: 'Keynote', location: 'London' },
      { name: 'SaaStr Annual', year: 2023, role: 'Speaker', location: 'San Francisco' },
      { name: 'Collision', year: 2023, role: 'Panelist', location: 'Toronto' },
      { name: 'Y Combinator Demo Day', year: 2022, role: 'Founder', location: 'San Francisco' },
    ],
    articles: [
      { title: 'How EventScale Reached 10K Events', outlet: 'TechCrunch', url: 'https://techcrunch.com', date: 'Oct 2024' },
      { title: 'The Event Industry\'s Digital Future', outlet: 'The Economist', url: 'https://economist.com', date: 'Aug 2024' },
      { title: 'Marcus Berg on YC and Event Tech', outlet: 'Forbes', url: 'https://forbes.com', date: 'Mar 2024' },
    ],
    awards: [
      { name: 'Event Tech Innovator of the Year', org: 'Event Tech Live', year: 2024 },
      { name: 'YC Top 10', org: 'Y Combinator', year: 2022 },
      { name: 'Startup of the Year', org: 'German Startup Awards', year: 2023 },
    ],
    schedule: [
      { title: 'Scaling Events to 10K Attendees', stage: 'Startup Stage', time: '10:30–11:15', day: 1, type: 'talk' },
      { title: 'Event Tech Trends 2026', stage: 'Startup Stage', time: '16:00–16:45', day: 1, type: 'panel' },
      { title: 'Founder Stories: Building in Events', stage: 'Main Stage', time: '09:30–10:30', day: 2, type: 'panel' },
    ],
    socials: { twitter: 'https://twitter.com/marcusberg', linkedin: 'https://linkedin.com/in/marcusberg', website: 'https://eventscale.io' },
  },
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    title: 'VP Engineering',
    company: 'CloudNova',
    role: 'VP Engineering, CloudNova',
    flag: '🇮🇳',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
    bio: [
      'Priya Sharma runs infrastructure that Fortune 500 companies bet their business on. Billions of API requests. Zero excuses. Her KubeCon keynote in Paris had engineers lining up for selfies. She\'s the one who makes "enterprise scale" look easy.',
      'AWS re:Invent. CNCF. Open-source legend. Priya doesn\'t just build systems — she builds the engineers who build the future. When she talks ML infrastructure, the room goes silent. You don\'t want to miss a word.',
    ],
    talk: { title: 'Enterprise ML Infrastructure', track: 'Enterprise Innovation', time: 'Day 1, 12:00', desc: 'What does it take to run ML at enterprise scale? Priya shares the architecture, tooling, and processes CloudNova uses to serve model inference for hundreds of customers. Topics include GPU orchestration, model versioning, and cost optimization.' },
    panels: [{ title: 'Cloud-Native ML', time: 'Day 1, 15:00', stage: 'Enterprise Stage' }, { title: 'Engineering Leadership Roundtable', time: 'Day 2, 10:00', stage: 'Main Stage' }],
    pastEvents: [
      { name: 'AWS re:Invent', year: 2024, role: 'Speaker', location: 'Las Vegas' },
      { name: 'KubeCon + CloudNativeCon', year: 2024, role: 'Keynote', location: 'Paris' },
      { name: 'QCon San Francisco', year: 2023, role: 'Speaker', location: 'San Francisco' },
      { name: 'Strange Loop', year: 2023, role: 'Speaker', location: 'St. Louis' },
      { name: 'GopherCon', year: 2022, role: 'Workshop Lead', location: 'Chicago' },
    ],
    articles: [
      { title: 'Scaling ML Inference to Billions', outlet: 'ACM Queue', url: 'https://queue.acm.org', date: 'Dec 2024' },
      { title: 'Cloud-Native ML: A Practitioner\'s Guide', outlet: 'InfoQ', url: 'https://infoq.com', date: 'Sep 2024' },
      { title: 'Priya Sharma on Engineering at CloudNova', outlet: 'The New Stack', url: 'https://thenewstack.io', date: 'May 2024' },
    ],
    awards: [
      { name: 'Women in Cloud Leadership', org: 'Cloud Native Computing Foundation', year: 2024 },
      { name: 'Engineering Excellence', org: 'CloudNova', year: 2023 },
      { name: 'Open Source Contributor of the Year', org: 'CNCF', year: 2022 },
    ],
    schedule: [
      { title: 'Enterprise ML Infrastructure', stage: 'Enterprise Stage', time: '12:00–12:45', day: 1, type: 'talk' },
      { title: 'Cloud-Native ML', stage: 'Enterprise Stage', time: '15:00–15:45', day: 1, type: 'panel' },
      { title: 'Engineering Leadership Roundtable', stage: 'Main Stage', time: '10:00–11:00', day: 2, type: 'panel' },
    ],
    socials: { twitter: 'https://twitter.com/priyasharma', linkedin: 'https://linkedin.com/in/priyasharma', github: 'https://github.com/priyasharma', website: 'https://priyasharma.dev' },
  },
  {
    id: 'james-wright',
    name: 'James Wright',
    title: 'Founder',
    company: 'LaunchLab',
    role: 'Founder, LaunchLab',
    flag: '🇬🇧',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    bio: [
      'James Wright has helped 200 startups raise half a billion dollars. He\'s the VC who actually gets it — ex-Stripe, ex-unicorn, and the guy technical founders call when they need the real playbook. No fluff. No buzzwords. Just what works.',
      'YC Startup School regular. "Build in Public" podcast host. Forbes 30 Under 30. James has seen every pitch, every mistake, every breakout. His talk on Series A will change how you think about fundraising. Seriously.',
    ],
    talk: { title: 'From Zero to Series A', track: 'Startup Growth', time: 'Day 1, 14:00', desc: 'James breaks down the playbook for going from idea to Series A. Learn what investors actually look for, how to tell your story, and the metrics that matter. Includes real examples from LaunchLab portfolio companies.' },
    panels: [{ title: 'Pitching to Technical VCs', time: 'Day 1, 17:00', stage: 'Startup Stage' }, { title: 'Founder Mental Health', time: 'Day 2, 14:00', stage: 'Community Stage' }],
    pastEvents: [
      { name: 'Y Combinator Startup School', year: 2024, role: 'Mentor & Speaker', location: 'Virtual' },
      { name: 'SaaStr Annual', year: 2024, role: 'Fireside Chat', location: 'San Francisco' },
      { name: 'TechCrunch Disrupt', year: 2023, role: 'Judge', location: 'San Francisco' },
      { name: 'Web Summit', year: 2023, role: 'Speaker', location: 'Lisbon' },
      { name: 'First Round CEO Summit', year: 2022, role: 'Speaker', location: 'Napa' },
    ],
    articles: [
      { title: 'What I Look For in Series A Pitches', outlet: 'First Round Review', url: 'https://review.firstround.com', date: 'Nov 2024' },
      { title: 'The Build in Public Movement', outlet: 'TechCrunch', url: 'https://techcrunch.com', date: 'Aug 2024' },
      { title: 'James Wright on LaunchLab\'s First 200', outlet: 'Forbes', url: 'https://forbes.com', date: 'Apr 2024' },
    ],
    awards: [
      { name: 'Top 30 Under 30 Venture', org: 'Forbes', year: 2024 },
      { name: 'Best Angel Investor', org: 'European Startup Awards', year: 2023 },
      { name: 'Community Builder of the Year', org: 'Product Hunt', year: 2022 },
    ],
    schedule: [
      { title: 'From Zero to Series A', stage: 'Startup Stage', time: '14:00–14:45', day: 1, type: 'talk' },
      { title: 'Pitching to Technical VCs', stage: 'Startup Stage', time: '17:00–17:45', day: 1, type: 'panel' },
      { title: 'Founder Mental Health', stage: 'Community Stage', time: '14:00–15:00', day: 2, type: 'panel' },
    ],
    socials: { twitter: 'https://twitter.com/jameswright', linkedin: 'https://linkedin.com/in/jameswright', website: 'https://launchlab.vc', youtube: 'https://youtube.com/@buildinpublic' },
  },
  {
    id: 'ana-costa',
    name: 'Ana Costa',
    title: 'Director of AI',
    company: 'FutureConf',
    role: 'Director of AI, FutureConf',
    flag: '🇧🇷',
    img: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop',
    bio: [
      'Ana Costa cut event production time by 60% — and made it better. She\'s the AI ethicist who ships. Stanford ML. NeurIPS. Harvard Business Review. She\'s the voice the industry needs when everyone else is moving fast and breaking things.',
      'Responsible AI isn\'t a side project for Ana — it\'s the mission. She\'s keynoted AI Summit, led workshops at NeurIPS, and made "bias detection" a product feature. When she talks ethics, founders listen. You should too.',
    ],
    talk: { title: 'Responsible AI in Production', track: 'AI & Machine Learning', time: 'Day 2, 09:00', desc: 'Deploying AI responsibly is non-negotiable. Ana shares frameworks for bias detection, transparency, and human-in-the-loop design. Learn how FutureConf balances innovation with ethical considerations in every AI feature they ship.' },
    panels: [{ title: 'AI Ethics in Practice', time: 'Day 1, 13:00', stage: 'Main Stage' }, { title: 'Generative AI for Events', time: 'Day 2, 11:30', stage: 'Enterprise Stage' }],
    pastEvents: [
      { name: 'NeurIPS', year: 2024, role: 'Workshop Organizer', location: 'Vancouver' },
      { name: 'AI Summit San Francisco', year: 2024, role: 'Keynote', location: 'San Francisco' },
      { name: 'Women in AI Summit', year: 2023, role: 'Speaker', location: 'London' },
      { name: 'Stanford HAI Symposium', year: 2023, role: 'Panelist', location: 'Stanford' },
      { name: 'MLOps World', year: 2022, role: 'Speaker', location: 'Virtual' },
    ],
    articles: [
      { title: 'Responsible AI: A Framework for Events', outlet: 'Harvard Business Review', url: 'https://hbr.org', date: 'Oct 2024' },
      { title: 'Bias Detection in Production ML', outlet: 'MIT Technology Review', url: 'https://technologyreview.com', date: 'Jul 2024' },
      { title: 'Ana Costa on AI Ethics at FutureConf', outlet: 'Wired', url: 'https://wired.com', date: 'Mar 2024' },
    ],
    awards: [
      { name: 'AI Ethics Pioneer', org: 'AI Now Institute', year: 2024 },
      { name: 'Top 50 Women in AI', org: 'Forbes', year: 2023 },
      { name: 'Stanford HAI Fellow', org: 'Stanford University', year: 2022 },
    ],
    schedule: [
      { title: 'Responsible AI in Production', stage: 'Main Stage', time: '09:00–09:45', day: 2, type: 'keynote' },
      { title: 'AI Ethics in Practice', stage: 'Main Stage', time: '13:00–13:45', day: 1, type: 'panel' },
      { title: 'Generative AI for Events', stage: 'Enterprise Stage', time: '11:30–12:15', day: 2, type: 'talk' },
    ],
    socials: { twitter: 'https://twitter.com/anacosta', linkedin: 'https://linkedin.com/in/anacosta', website: 'https://anacosta.ai' },
  },
  {
    id: 'david-kim',
    name: 'David Kim',
    title: 'Head of Growth',
    company: 'ScaleUp',
    role: 'Head of Growth, ScaleUp',
    flag: '🇺🇸',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
    bio: [
      'David Kim took ScaleUp from zero to $20M ARR in three years. No hype. No vanity metrics. Just growth loops that actually work. His "Growth Weekly" newsletter has 50,000 founders waiting for every drop. He\'s the growth guy who delivers.',
      'Two YC companies. Dozens of startups advised. David has seen what fails and what 10x\'s. His talks are legendary for cutting through the noise — you\'ll leave with a playbook you can run Monday morning.',
    ],
    talk: { title: 'Growth Loops That Work', track: 'Startup Growth', time: 'Day 2, 10:30', desc: 'Not all growth loops are created equal. David shares the frameworks and metrics that separate sustainable growth from vanity metrics. Real examples from ScaleUp\'s journey, including what failed and what 10x\'d their pipeline.' },
    panels: [{ title: 'B2B Growth Playbooks', time: 'Day 1, 11:00', stage: 'Startup Stage' }, { title: 'Product-Led Growth Deep Dive', time: 'Day 2, 15:00', stage: 'Enterprise Stage' }],
    pastEvents: [
      { name: 'Growth Summit', year: 2024, role: 'Keynote', location: 'Austin' },
      { name: 'SaaStr Annual', year: 2024, role: 'Speaker', location: 'San Francisco' },
      { name: 'PLG Conference', year: 2023, role: 'Speaker', location: 'San Francisco' },
      { name: 'MicroConf', year: 2023, role: 'Workshop', location: 'Las Vegas' },
      { name: 'RevGenius', year: 2022, role: 'Speaker', location: 'Virtual' },
    ],
    articles: [
      { title: 'The Growth Loop Framework', outlet: 'Lenny\'s Newsletter', url: 'https://lennynewsletter.com', date: 'Nov 2024' },
      { title: '0 to $20M ARR: What Actually Worked', outlet: 'TechCrunch', url: 'https://techcrunch.com', date: 'Sep 2024' },
      { title: 'David Kim on B2B Growth', outlet: 'GrowthHackers', url: 'https://growthhackers.com', date: 'Jun 2024' },
    ],
    awards: [
      { name: 'Growth Leader of the Year', org: 'GrowthHackers', year: 2024 },
      { name: 'Top 50 B2B Marketers', org: 'Demand Gen Report', year: 2023 },
      { name: 'ScaleUp MVP', org: 'ScaleUp', year: 2022 },
    ],
    schedule: [
      { title: 'Growth Loops That Work', stage: 'Startup Stage', time: '10:30–11:15', day: 2, type: 'talk' },
      { title: 'B2B Growth Playbooks', stage: 'Startup Stage', time: '11:00–11:45', day: 1, type: 'panel' },
      { title: 'Product-Led Growth Deep Dive', stage: 'Enterprise Stage', time: '15:00–15:45', day: 2, type: 'talk' },
    ],
    socials: { twitter: 'https://twitter.com/davidkim', linkedin: 'https://linkedin.com/in/davidkim', website: 'https://growthweekly.io' },
  },
  {
    id: 'elena-vasquez',
    name: 'Elena Vasquez',
    title: 'Chief Product Officer',
    company: 'DataPulse',
    role: 'Chief Product Officer, DataPulse',
    flag: '🇪🇸',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    bio: [
      'Elena Vasquez built the product 5,000 data teams can\'t live without. Datadog. Snowflake. Now DataPulse. She\'s the CPO who turned "developer experience" from a buzzword into a competitive moat. Data Council keynote. ProductCon headliner.',
      'She makes complex infrastructure feel simple. She fights for inclusive product — and ships it. When Elena talks product strategy, even the engineers take notes. One of the sharpest minds in data. Don\'t miss her.',
    ],
    talk: { title: 'Product Strategy for Technical Products', track: 'Enterprise Innovation', time: 'Day 2, 12:00', desc: 'Building products for developers and data engineers requires a different playbook. Elena shares how to balance power-user needs with accessibility, prioritize ruthlessly, and build products that developers actually love.' },
    panels: [{ title: 'The Future of Data Platforms', time: 'Day 1, 14:00', stage: 'Enterprise Stage' }, { title: 'Product Leadership', time: 'Day 2, 16:00', stage: 'Main Stage' }],
    pastEvents: [
      { name: 'Data Council', year: 2024, role: 'Keynote', location: 'San Francisco' },
      { name: 'ProductCon', year: 2024, role: 'Speaker', location: 'Los Angeles' },
      { name: 'Snowflake Summit', year: 2023, role: 'Speaker', location: 'Las Vegas' },
      { name: 'Mind the Product', year: 2023, role: 'Speaker', location: 'London' },
      { name: 'Women in Product', year: 2022, role: 'Keynote', location: 'Virtual' },
    ],
    articles: [
      { title: 'Building for Power Users', outlet: 'Product Hunt Blog', url: 'https://blog.producthunt.com', date: 'Oct 2024' },
      { title: 'The Data Platform Playbook', outlet: 'InfoQ', url: 'https://infoq.com', date: 'Aug 2024' },
      { title: 'Elena Vasquez on CPO Life', outlet: 'First Round Review', url: 'https://review.firstround.com', date: 'May 2024' },
    ],
    awards: [
      { name: 'Product Leader of the Year', org: 'Product School', year: 2024 },
      { name: 'Top 100 Women in Data', org: 'DataIQ', year: 2023 },
      { name: 'DataPulse Innovation Award', org: 'DataPulse', year: 2022 },
    ],
    schedule: [
      { title: 'Product Strategy for Technical Products', stage: 'Enterprise Stage', time: '12:00–12:45', day: 2, type: 'talk' },
      { title: 'The Future of Data Platforms', stage: 'Enterprise Stage', time: '14:00–14:45', day: 1, type: 'panel' },
      { title: 'Product Leadership', stage: 'Main Stage', time: '16:00–16:45', day: 2, type: 'panel' },
    ],
    socials: { twitter: 'https://twitter.com/elenavasquez', linkedin: 'https://linkedin.com/in/elenavasquez', website: 'https://elenavasquez.com' },
  },
  {
    id: 'thomas-muller',
    name: 'Thomas Muller',
    title: 'VP Engineering',
    company: 'Innovate Corp',
    role: 'VP Engineering, Innovate Corp',
    flag: '🇩🇪',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
    bio: [
      'Thomas Muller moved a 2,000-person company to the cloud without dropping a single request. 99.99% uptime. Fifty business units. Zero excuses. CIO of the Year. The man who proves enterprises can move fast.',
      'Twenty years. Siemens. SAP. Now Innovate Corp. Thomas has seen every legacy migration, every "impossible" transformation. His playbook for bringing AI into the enterprise is the one Fortune 500 CTOs are stealing. Be there.',
    ],
    talk: { title: 'Legacy to AI: Enterprise Transformation', track: 'Enterprise Innovation', time: 'Day 2, 14:00', desc: 'How do you introduce AI into organizations with decades of legacy systems? Thomas shares the playbook Innovate Corp used to pilot, scale, and productionize AI across 50+ business units without breaking existing workflows.' },
    panels: [{ title: 'Enterprise Architecture in 2026', time: 'Day 1, 10:00', stage: 'Enterprise Stage' }, { title: 'Technical Debt and Innovation', time: 'Day 2, 09:30', stage: 'Main Stage' }],
    pastEvents: [
      { name: 'Gartner IT Symposium', year: 2024, role: 'Speaker', location: 'Barcelona' },
      { name: 'Enterprise Connect', year: 2024, role: 'Keynote', location: 'Orlando' },
      { name: 'O\'Reilly Software Architecture', year: 2023, role: 'Speaker', location: 'New York' },
      { name: 'QCon London', year: 2023, role: 'Speaker', location: 'London' },
      { name: 'SAP Sapphire', year: 2022, role: 'Speaker', location: 'Orlando' },
    ],
    articles: [
      { title: 'Legacy to Cloud: A 5-Year Journey', outlet: 'IEEE Software', url: 'https://computer.org', date: 'Nov 2024' },
      { title: 'Enterprise AI Adoption', outlet: 'Harvard Business Review', url: 'https://hbr.org', date: 'Jul 2024' },
      { title: 'Thomas Muller on Digital Transformation', outlet: 'CIO Magazine', url: 'https://cio.com', date: 'Apr 2024' },
    ],
    awards: [
      { name: 'CIO of the Year', org: 'CIO Magazine', year: 2024 },
      { name: 'Digital Transformation Leader', org: 'Gartner', year: 2023 },
      { name: 'Innovate Corp Excellence', org: 'Innovate Corp', year: 2022 },
    ],
    schedule: [
      { title: 'Legacy to AI: Enterprise Transformation', stage: 'Enterprise Stage', time: '14:00–14:45', day: 2, type: 'talk' },
      { title: 'Enterprise Architecture in 2026', stage: 'Enterprise Stage', time: '10:00–10:45', day: 1, type: 'panel' },
      { title: 'Technical Debt and Innovation', stage: 'Main Stage', time: '09:30–10:30', day: 2, type: 'panel' },
    ],
    socials: { linkedin: 'https://linkedin.com/in/thomasmuller', website: 'https://thomasmuller.io' },
  },
  {
    id: 'aisha-patel',
    name: 'Aisha Patel',
    title: 'Director of AI',
    company: 'StackAI',
    role: 'Director of AI, StackAI',
    flag: '🇮🇳',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
    bio: [
      'Aisha Patel cut LLM inference costs by 70% — and made the models better. OpenAI. Anthropic. Now StackAI. She\'s the researcher who ships. NeurIPS Best Paper. The developer community calls her workshops "mind-blowing."',
      'Carnegie Mellon PhD. The prompt engineering expert everyone quotes. Aisha bridges research and production like nobody else. When she talks LLMs, you\'re hearing from someone who\'s built the future. Front row recommended.',
    ],
    talk: { title: 'LLMs in Production', track: 'AI & Machine Learning', time: 'Day 2, 11:00', desc: 'From prototype to production: Aisha covers the full stack of deploying LLMs at scale. Topics include model selection, prompt versioning, evaluation pipelines, cost optimization, and handling edge cases in production.' },
    panels: [{ title: 'The State of LLMs', time: 'Day 1, 09:30', stage: 'Main Stage' }, { title: 'AI Research to Product', time: 'Day 2, 13:00', stage: 'Enterprise Stage' }],
    pastEvents: [
      { name: 'NeurIPS', year: 2024, role: 'Speaker', location: 'Vancouver' },
      { name: 'LLM Engineering Summit', year: 2024, role: 'Keynote', location: 'San Francisco' },
      { name: 'Anthropic Developer Day', year: 2023, role: 'Speaker', location: 'San Francisco' },
      { name: 'MLOps Community', year: 2023, role: 'Workshop', location: 'Virtual' },
      { name: 'ICML', year: 2022, role: 'Poster', location: 'Baltimore' },
    ],
    articles: [
      { title: 'LLM Fine-Tuning at Scale', outlet: 'arXiv', url: 'https://arxiv.org', date: 'Dec 2024' },
      { title: 'Prompt Engineering in Production', outlet: 'O\'Reilly', url: 'https://oreilly.com', date: 'Sep 2024' },
      { title: 'Aisha Patel on StackAI\'s AI Stack', outlet: 'VentureBeat', url: 'https://venturebeat.com', date: 'Jun 2024' },
    ],
    awards: [
      { name: 'AI Researcher of the Year', org: 'AI Weekly', year: 2024 },
      { name: 'Best Paper Award', org: 'NeurIPS', year: 2023 },
      { name: 'Carnegie Mellon Distinguished Alumni', org: 'CMU', year: 2022 },
    ],
    schedule: [
      { title: 'LLMs in Production', stage: 'Main Stage', time: '11:00–11:45', day: 2, type: 'talk' },
      { title: 'The State of LLMs', stage: 'Main Stage', time: '09:30–10:30', day: 1, type: 'panel' },
      { title: 'AI Research to Product', stage: 'Enterprise Stage', time: '13:00–13:45', day: 2, type: 'talk' },
    ],
    socials: { twitter: 'https://twitter.com/aishapatel', linkedin: 'https://linkedin.com/in/aishapatel', github: 'https://github.com/aishapatel', website: 'https://aishapatel.ai' },
  },
  {
    id: 'ryan-obrien',
    name: 'Ryan O\'Brien',
    title: 'Founder',
    company: 'GrowthHub',
    role: 'Founder, GrowthHub',
    flag: '🇮🇪',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    bio: [
      'Ryan O\'Brien built a community of 100,000 founders — and scaled three startups to acquisition doing it. GrowthHub isn\'t a platform. It\'s a movement. Fifty angel investments. The podcast every growth leader listens to. Quarterly retreats that sell out in hours.',
      'He\'s the community builder who turned "network effects" into a repeatable playbook. When Ryan talks ecosystems, you\'re learning from someone who\'s lived it. High energy. Zero fluff. This one\'s unmissable.',
    ],
    talk: { title: 'Building Ecosystems', track: 'Enterprise Innovation', time: 'Day 2, 15:00', desc: 'The best products don\'t just acquire users — they build ecosystems. Ryan shares how GrowthHub created a self-reinforcing community of growth practitioners, and how you can apply these principles to your own product or company.' },
    panels: [{ title: 'Community-Led Growth', time: 'Day 1, 12:30', stage: 'Community Stage' }, { title: 'Founder Communities', time: 'Day 2, 10:00', stage: 'Startup Stage' }],
    pastEvents: [
      { name: 'Community-Led Growth Summit', year: 2024, role: 'Keynote', location: 'Dublin' },
      { name: 'SaaStr Europa', year: 2024, role: 'Speaker', location: 'London' },
      { name: 'MicroConf', year: 2023, role: 'Speaker', location: 'Las Vegas' },
      { name: 'Indie Hackers Meetup', year: 2023, role: 'Host', location: 'San Francisco' },
      { name: 'Growth Hackers Conference', year: 2022, role: 'Speaker', location: 'Austin' },
    ],
    articles: [
      { title: 'The Community-Led Growth Playbook', outlet: 'Lenny\'s Newsletter', url: 'https://lennynewsletter.com', date: 'Oct 2024' },
      { title: '100K Founders: How We Built GrowthHub', outlet: 'TechCrunch', url: 'https://techcrunch.com', date: 'Jul 2024' },
      { title: 'Ryan O\'Brien on Angel Investing', outlet: 'The Twenty Minute VC', url: 'https://twenty.vc', date: 'Apr 2024' },
    ],
    awards: [
      { name: 'Community Builder of the Year', org: 'Community-Led', year: 2024 },
      { name: 'Top Angel Investor', org: 'AngelList', year: 2023 },
      { name: 'GrowthHub Founder Award', org: 'GrowthHub', year: 2022 },
    ],
    schedule: [
      { title: 'Building Ecosystems', stage: 'Enterprise Stage', time: '15:00–15:45', day: 2, type: 'talk' },
      { title: 'Community-Led Growth', stage: 'Community Stage', time: '12:30–13:15', day: 1, type: 'talk' },
      { title: 'Founder Communities', stage: 'Startup Stage', time: '10:00–10:45', day: 2, type: 'panel' },
    ],
    socials: { twitter: 'https://twitter.com/ryanobrien', linkedin: 'https://linkedin.com/in/ryanobrien', website: 'https://growthhub.io', youtube: 'https://youtube.com/@growthhub' },
  },
];

export const getSpeakerById = (id: string) => SPEAKERS.find((s) => s.id === id);
export const getSpeakerIds = () => SPEAKERS.map((s) => s.id);
