// Shared portfolio data for the TanStack Start site.
// Edit here to update profile, resume, projects and blog content.

export const profile = {
  name: "Hermogene UKUNDAYEZU",
  shortName: "HU",
  role: "Information Technology Graduate",
  location: "Kigali, Rwanda",
  email: "hermogene250@gmail.com",
  phone: "+250 788 912 775",
  currentRole: "Field Technician at Piramie 4G",
  summary:
    "Information Technology graduate with practical experience in software development, Artificial Intelligence and Machine Learning, data analytics, database management, IoT, and blockchain. I build practical digital solutions that solve real-world problems and support digital transformation.",
  imagePath: "/headshot-on-white.jpg",
  socials: {
    github: "https://github.com/hermogene2001",
    linkedin: "https://www.linkedin.com/in/ukundayezu-hermogene-8957253b6",
    x: "https://x.com/hermess2001",
    instagram: "https://www.instagram.com/hermogene_25/",
    facebook: "https://www.facebook.com/Hermogene250",
  },
}

export interface ExperienceItem {
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  tags: string[]
  summary: string
  content: string
}

export interface EducationItem {
  school: string
  summary: string
  startDate: string
  endDate: string
  tags: string[]
  content: string
}

export const resumeData = {
  summary:
    "IT graduate and Field Technician focused on software engineering, AI/ML, data systems and IoT. Experienced in delivering full-stack platforms with PHP, Django, MySQL, Bootstrap and JavaScript, from database design to client-ready delivery.",
  experience: [
    {
      jobTitle: "Field Technician",
      company: "Piramie 4G",
      location: "Rwanda",
      startDate: "2023",
      endDate: "Present",
      tags: ["Networking", "4G", "Field Support"],
      summary:
        "Install, maintain and support 4G network equipment and services in the field, ensuring reliable customer connectivity.",
      content:
        "Responsible for on-site installation, configuration and troubleshooting of 4G equipment, coordinating with customers and the technical team to keep services running smoothly.",
    },
    {
      jobTitle: "Freelance Web Developer",
      company: "Self-employed",
      location: "Kigali, Rwanda",
      startDate: "2021",
      endDate: "Present",
      tags: ["PHP", "Django", "MySQL", "Bootstrap", "JavaScript"],
      summary:
        "Designed and built responsive websites and full-stack systems for clients and personal projects.",
      content:
        "Delivered frontend and backend platforms end-to-end, including database design, authentication, dashboards and deployment of business solutions.",
    },
  ],
  education: [
    {
      school: "Bachelor of Information Technology",
      summary:
        "Degree program focused on programming, databases, networking and emerging technologies.",
      startDate: "2019",
      endDate: "2023",
      tags: ["Programming", "Databases", "Networking", "IoT"],
      content:
        "Studied software development, database management, computer networks and IoT, and delivered hands-on projects including AI/ML and blockchain topics.",
    },
  ],
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "Bootstrap",
    "PHP",
    "Python",
    "Django",
    "MySQL",
    "Git",
    "GitHub",
    "VS Code",
    "XAMPP",
    "UI/UX Design",
    "Backend Development",
    "Database Design",
    "IoT",
  ],
}

export interface Project {
  title: string
  description: string
  tags: string[]
  github?: string
  liveUrl?: string
  content: string
}

export interface Post {
  title: string
  slug: string
  date: string
  summary: string
  tags: string[]
  author: string
  content: string
}

export const posts: Post[] = [
  {
    title: "Building a Legal Information Platform with Django",
    slug: "building-legal-information-platform-with-django",
    date: "2026-04-10",
    summary:
      "How I structured a Django + MySQL platform to connect clients and advocates, from data modeling to role-based access.",
    tags: ["Django", "MySQL", "Full Stack"],
    author: "Hermogene UKUNDAYEZU",
    content: `
# Building a Legal Information Platform with Django

One of my favourite projects is the Royal Advocate Information Management System. It connects clients with advocates and improves legal service accessibility in Rwanda.

## Key decisions

- **Data modeling first.** Advocates, clients, cases and messages needed a clean relational model before any UI work.
- **Role-based access.** Django groups and permissions kept admin, advocate and client experiences separate.
- **Bootstrap + Django templates** for fast, responsive UI without heavy JavaScript.

## What I learned

Model first, style later. Django's ORM made the MySQL schema easy to maintain, and iterating on real workflows turned a prototype into a useful platform.
`,
  },
  {
    title: "Connecting IoT Devices to a Web Dashboard",
    slug: "connecting-iot-devices-to-a-web-dashboard",
    date: "2026-03-05",
    summary:
      "Lessons from building a GPS tracking system with NodeMCU, GPS modules and a real-time web dashboard.",
    tags: ["IoT", "NodeMCU", "GPS"],
    author: "Hermogene UKUNDAYEZU",
    content: `
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
`,
  },
  {
    title: "From MySQL to Dashboards: Data in Practice",
    slug: "from-mysql-to-dashboards-data-in-practice",
    date: "2026-01-20",
    summary:
      "A practical approach to turning relational data into business value with clean schema design and useful reports.",
    tags: ["MySQL", "Data", "SQL"],
    author: "Hermogene UKUNDAYEZU",
    content: `
# From MySQL to Dashboards: Data in Practice

Across my projects — from the Alpha Investment System to e-commerce — the pattern is the same: a good schema makes the dashboard easy.

## Principles

- **Normalise first**, then denormalise deliberately for the reports you actually need.
- **Index on foreign keys and hot queries**, not on everything.
- **Keep write paths simple**; derive aggregates in queries or scheduled jobs.

## Reporting

Simple materialised summaries beat expensive live aggregations for investment and sales dashboards. A few well-thought-out views gave clients the insights they wanted without slowing the app down.
`,
  },
]