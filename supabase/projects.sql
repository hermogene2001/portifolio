create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text not null,
  tags text[] not null default '{}',
  github text,
  live_url text,
  content text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

grant select on public.projects to anon, authenticated;

drop policy if exists "Anyone can read published projects" on public.projects;
create policy "Anyone can read published projects"
  on public.projects
  for select
  to anon, authenticated
  using (is_published = true);

insert into public.projects (
  title,
  description,
  tags,
  github,
  content,
  sort_order
)
values
  (
    'Royal Advocate Information Management System',
    'A legal information and communication platform connecting clients with advocates and improving legal service accessibility.',
    array['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Django', 'MySQL'],
    'https://github.com/hermogene2001',
    'Platform that makes legal services more accessible by allowing clients to find and communicate with advocates, with role-based dashboards for admins and advocates.',
    1
  ),
  (
    'Alpha Investment System',
    'A digital investment platform with role-based dashboards, transactions, referrals, and robust client account management.',
    array['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
    'https://github.com/hermogene2001',
    'Investment management system handling accounts, transactions and referral tracking, with a clean dashboard experience for admins and investors.',
    2
  ),
  (
    'GPS Tracking System',
    'A real-time location tracking system for student monitoring with GPS modules, IoT devices, and a web dashboard.',
    array['NodeMCU', 'GPS', 'PHP/Python', 'MySQL'],
    'https://github.com/hermogene2001',
    'IoT-based tracking solution combining GPS hardware with a web dashboard (Python/PHP + MySQL) for real-time location monitoring.',
    3
  ),
  (
    'Rwanda Law AI Chatbot',
    'An AI-powered chatbot designed to answer legal questions based on Rwanda laws and official documents.',
    array['Python', 'Django', 'OpenAI API', 'JavaScript'],
    'https://github.com/hermogene2001',
    'Chatbot that answers legal questions grounded in Rwandan law and official documents using retrieval-augmented generation.',
    4
  ),
  (
    'E-Commerce Platform',
    'A modern e-commerce website with authentication, product management, and full order processing workflows.',
    array['Django', 'MySQL', 'Bootstrap'],
    'https://github.com/hermogene2001',
    'Full e-commerce experience with user authentication, product management, cart and order processing built on Django and MySQL.',
    5
  )
on conflict (title) do nothing;
