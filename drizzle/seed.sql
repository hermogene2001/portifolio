-- Seed data for the portfolio database.
-- Run after migrations:  psql "$DATABASE_URL" -f drizzle/seed.sql
-- Every statement is idempotent, so it is safe to run more than once.

-- Profile (single row, id = 1)
INSERT INTO site_profile (
  id, name, short_name, role, location, email, phone, "current_role",
  summary, resume_summary, image_path, github, linkedin, x, instagram, facebook
) VALUES (
  1,
  'Hermogene UKUNDAYEZU',
  'HU',
  'Information Technology Graduate',
  'Kigali, Rwanda',
  'hermogene250@gmail.com',
  '+250 788 912 775',
  'Field Technician at Piramie 4G',
  'Information Technology graduate with practical experience in software development, Artificial Intelligence and Machine Learning, data analytics, database management, IoT, and blockchain. I build practical digital solutions that solve real-world problems and support digital transformation.',
  'IT graduate and Field Technician focused on software engineering, AI/ML, data systems and IoT. Experienced in delivering full-stack platforms with PHP, Django, MySQL, Bootstrap and JavaScript, from database design to client-ready delivery.',
  '/headshot-on-white.jpg',
  'https://github.com/hermogene2001',
  'https://www.linkedin.com/in/ukundayezu-hermogene-8957253b6',
  'https://x.com/hermess2001',
  'https://www.instagram.com/hermogene_25/',
  'https://www.facebook.com/Hermogene250'
)
ON CONFLICT (id) DO NOTHING;

-- Work experience (only seeded when the table is empty)
INSERT INTO experience (job_title, company, location, start_date, end_date, tags, summary, content, sort_order)
SELECT * FROM (VALUES
  (
    'Field Technician', 'Piramie 4G', 'Rwanda', '2023', 'Present',
    ARRAY['Networking', '4G', 'Field Support'],
    'Install, maintain and support 4G network equipment and services in the field, ensuring reliable customer connectivity.',
    'Responsible for on-site installation, configuration and troubleshooting of 4G equipment, coordinating with customers and the technical team to keep services running smoothly.',
    1
  ),
  (
    'Freelance Web Developer', 'Self-employed', 'Kigali, Rwanda', '2021', 'Present',
    ARRAY['PHP', 'Django', 'MySQL', 'Bootstrap', 'JavaScript'],
    'Designed and built responsive websites and full-stack systems for clients and personal projects.',
    'Delivered frontend and backend platforms end-to-end, including database design, authentication, dashboards and deployment of business solutions.',
    2
  )
) AS v(job_title, company, location, start_date, end_date, tags, summary, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM experience);

-- Education (only seeded when the table is empty)
INSERT INTO education (school, summary, start_date, end_date, tags, content, sort_order)
SELECT * FROM (VALUES
  (
    'Bachelor of Information Technology',
    'Degree program focused on programming, databases, networking and emerging technologies.',
    '2019', '2023',
    ARRAY['Programming', 'Databases', 'Networking', 'IoT'],
    'Studied software development, database management, computer networks and IoT, and delivered hands-on projects including AI/ML and blockchain topics.',
    1
  )
) AS v(school, summary, start_date, end_date, tags, content, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM education);

-- Skills (only seeded when the table is empty)
INSERT INTO skills (name, sort_order)
SELECT * FROM (VALUES
  ('HTML', 1), ('CSS', 2), ('JavaScript', 3), ('Bootstrap', 4),
  ('PHP', 5), ('Python', 6), ('Django', 7), ('MySQL', 8),
  ('Git', 9), ('GitHub', 10), ('VS Code', 11), ('XAMPP', 12),
  ('UI/UX Design', 13), ('Backend Development', 14),
  ('Database Design', 15), ('IoT', 16)
) AS v(name, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM skills);

-- Projects
INSERT INTO projects (title, description, tags, github, content, sort_order, is_published) VALUES
  (
    'Royal Advocate Information Management System',
    'A legal information and communication platform connecting clients with advocates and improving legal service accessibility.',
    ARRAY['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Django', 'MySQL'],
    'https://github.com/hermogene2001',
    'Platform that makes legal services more accessible by allowing clients to find and communicate with advocates, with role-based dashboards for admins and advocates.',
    1, true
  ),
  (
    'Alpha Investment System',
    'A digital investment platform with role-based dashboards, transactions, referrals, and robust client account management.',
    ARRAY['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
    'https://github.com/hermogene2001',
    'Investment management system handling accounts, transactions and referral tracking, with a clean dashboard experience for admins and investors.',
    2, true
  ),
  (
    'GPS Tracking System',
    'A real-time location tracking system for student monitoring with GPS modules, IoT devices, and a web dashboard.',
    ARRAY['NodeMCU', 'GPS', 'PHP/Python', 'MySQL'],
    'https://github.com/hermogene2001',
    'IoT-based tracking solution combining GPS hardware with a web dashboard (Python/PHP + MySQL) for real-time location monitoring.',
    3, true
  ),
  (
    'Rwanda Law AI Chatbot',
    'An AI-powered chatbot designed to answer legal questions based on Rwanda laws and official documents.',
    ARRAY['Python', 'Django', 'OpenAI API', 'JavaScript'],
    'https://github.com/hermogene2001',
    'Chatbot that answers legal questions grounded in Rwandan law and official documents using retrieval-augmented generation.',
    4, true
  ),
  (
    'E-Commerce Platform',
    'A modern e-commerce website with authentication, product management, and full order processing workflows.',
    ARRAY['Django', 'MySQL', 'Bootstrap'],
    'https://github.com/hermogene2001',
    'Full e-commerce experience with user authentication, product management, cart and order processing built on Django and MySQL.',
    5, true
  )
ON CONFLICT (title) DO NOTHING;

-- Blog posts
INSERT INTO posts (title, slug, "date", summary, tags, author, content, is_published) VALUES
  (
    'Building a Legal Information Platform with Django',
    'building-legal-information-platform-with-django',
    '2026-04-10',
    'How I structured a Django + MySQL platform to connect clients and advocates, from data modeling to role-based access.',
    ARRAY['Django', 'MySQL', 'Full Stack'],
    'Hermogene UKUNDAYEZU',
    $md$
# Building a Legal Information Platform with Django

One of my favourite projects is the Royal Advocate Information Management System. It connects clients with advocates and improves legal service accessibility in Rwanda.

## Key decisions

- **Data modeling first.** Advocates, clients, cases and messages needed a clean relational model before any UI work.
- **Role-based access.** Django groups and permissions kept admin, advocate and client experiences separate.
- **Bootstrap + Django templates** for fast, responsive UI without heavy JavaScript.

## What I learned

Model first, style later. Django's ORM made the MySQL schema easy to maintain, and iterating on real workflows turned a prototype into a useful platform.
$md$,
    true
  ),
  (
    'Connecting IoT Devices to a Web Dashboard',
    'connecting-iot-devices-to-a-web-dashboard',
    '2026-03-05',
    'Lessons from building a GPS tracking system with NodeMCU, GPS modules and a real-time web dashboard.',
    ARRAY['IoT', 'NodeMCU', 'GPS'],
    'Hermogene UKUNDAYEZU',
    $md$
# Connecting IoT Devices to a Web Dashboard

The GPS Tracking System project combines hardware and software: NodeMCU boards with GPS modules stream location data into a database, and a dashboard visualises it in real time.

## Architecture

1. **NodeMCU** reads GPS coordinates over serial.
2. Location data is sent to a **Python/PHP backend** over HTTP.
3. The backend stores positions in **MySQL**.
4. A web dashboard polls or streams updates and renders them on a map.

## Gotchas

- GPS needs a clear sky — indoor testing will make you think your code is wrong.
- Rate-limit database writes; devices send data often.
- Design the API payloads before flashing firmware.

IoT is a great way to make the web physical.
$md$,
    true
  ),
  (
    'From MySQL to Dashboards: Data in Practice',
    'from-mysql-to-dashboards-data-in-practice',
    '2026-01-20',
    'A practical approach to turning relational data into business value with clean schema design and useful reports.',
    ARRAY['MySQL', 'Data', 'SQL'],
    'Hermogene UKUNDAYEZU',
    $md$
# From MySQL to Dashboards: Data in Practice

Across my projects — from the Alpha Investment System to e-commerce — the pattern is the same: a good schema makes the dashboard easy.

## Principles

- **Normalise first**, then denormalise deliberately for the reports you actually need.
- **Index on foreign keys and hot queries**, not on everything.
- **Keep write paths simple**; derive aggregates in queries or scheduled jobs.

## Reporting

Simple materialised summaries beat expensive live aggregations for investment and sales dashboards. A few well-thought-out views gave clients the insights they wanted without slowing the app down.
$md$,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Services (inserted only when the table is empty, so re-seeding is safe)
INSERT INTO services (title, description, icon, sort_order)
SELECT * FROM (
  VALUES
    ('Web Development', 'Building modern, responsive, and high-performance websites with clean architecture.', 'code', 1),
    ('UI/UX Design', 'Designing clean, intuitive, and visually strong interfaces that users trust.', 'design', 2),
    ('Responsive Website Design', 'Creating layouts that perform beautifully across phones, tablets, and desktops.', 'mobile', 3),
    ('Backend Development', 'Developing secure and scalable server-side systems for modern web applications.', 'server', 4),
    ('Database Design & Integration', 'Designing structured, reliable databases and integrating them into business workflows.', 'database', 5),
    ('Freelance Project Development', 'Delivering custom digital solutions tailored to each client''s technical and business goals.', 'rocket', 6)
) AS seed(title, description, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM services);

-- Testimonials (inserted only when the table is empty). Replace these with real ones.
INSERT INTO testimonials (name, role, quote, avatar, sort_order)
SELECT * FROM (
  VALUES
    ('Client Name', 'Founder, Company Name', 'Exceptional attention to detail. The platform was polished, fast, and exactly what the business needed.', '/client-1.svg', 1),
    ('Client Name', 'Operations Lead, Company Name', 'Strong communication, great UX decisions, and reliable backend delivery from start to finish.', '/client-2.svg', 2),
    ('Client Name', 'Project Manager, Company Name', 'A premium result with real business impact. Professional process and high-quality implementation.', '/client-3.svg', 3)
) AS seed(name, role, quote, avatar, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);
