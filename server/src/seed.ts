import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.admin.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.project.deleteMany({});

  console.log('Seeding database...');

  // Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log(`Created admin: ${admin.username}`);

  // Create Skills
  const skillsData = [
    // Backend
    { name: 'JavaScript', category: 'Backend' },
    { name: 'TypeScript', category: 'Backend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'NestJS', category: 'Backend' },
    { name: 'Java (intermediate)', category: 'Backend' },
    { name: 'Spring Boot', category: 'Backend' },
    { name: 'Spring WebFlux (basic)', category: 'Backend' },
    { name: 'SQL', category: 'Backend' },
    { name: 'HTML (basic)', category: 'Backend' },
    { name: 'CSS (basic)', category: 'Backend' },
    // Databases
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'MongoDB', category: 'Databases' },
    { name: 'Mongoose', category: 'Databases' },
    { name: 'TypeORM', category: 'Databases' },
    { name: 'MySQL', category: 'Databases' },
    // DevOps
    { name: 'Docker', category: 'DevOps' },
    { name: 'AWS', category: 'DevOps' },
    { name: 'CI/CD', category: 'DevOps' },
    { name: 'Linux', category: 'DevOps' },
    // Tools
    { name: 'Git', category: 'Tools' },
    { name: 'REST APIs', category: 'Tools' },
    { name: 'GraphQL', category: 'Tools' },
    { name: 'Postman', category: 'Tools' },
    { name: 'VS Code', category: 'Tools' },
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }
  console.log(`Created ${skillsData.length} skills.`);

  // Create Projects
  const projectsData = [
    {
      title: 'FastFood Delivery Backend',
      description: 'Complete backend architecture for a delivery service, including authentication, JWT/refresh tokens, role-based access, products, categories, orders, branches, and couriers. Built with TypeScript, Node.js, and Prisma.',
      tags: 'TypeScript,Node.js,Prisma,PostgreSQL',
      link: '#',
    },
    {
      title: 'CRM Management System',
      description: 'Advanced CRM backend with modules for students, groups, payments, attendance, filtering, pagination, notifications, and full admin authentication. Built using NestJS and PostgreSQL.',
      tags: 'NestJS,PostgreSQL,Prisma,JWT',
      link: '#',
    },
    {
      title: 'Telegram Quiz Bot Backend',
      description: 'Telegram bot backend supporting quiz logic, scoring system, difficulty levels, user statistics, and real-time question delivery. Built with Telegraf and PostgreSQL.',
      tags: 'Node.js,Telegraf,PostgreSQL,Redis',
      link: '#',
    },
    {
      title: 'E-Learning Platform Backend',
      description: 'Backend system featuring courses, lessons, teacher dashboard, authentication, payments, and user progress tracking. Designed for scalable education systems.',
      tags: 'Node.js,Express,MongoDB,JWT',
      link: '#',
    },
    {
      title: 'Hotel Booking Backend',
      description: 'Reservation backend with room availability, booking management, user authentication, payment integration, and admin dashboard features.',
      tags: 'TypeScript,NestJS,PostgreSQL',
      link: '#',
    },
    {
      title: 'Real-Time Chat API',
      description: 'WebSocket-powered chat backend with typing indicators, message history, private rooms, and Redis-based session management.',
      tags: 'Node.js,WebSocket,Redis,JWT',
      link: '#',
    },
    {
      title: 'URL Shortener Service',
      description: 'High-performance URL shortener API supporting analytics, click tracking, and custom aliases.',
      tags: 'Node.js,Express,MongoDB',
      link: '#',
    },
  ];

  for (const project of projectsData) {
    await prisma.project.create({ data: project });
  }
  console.log(`Created ${projectsData.length} projects.`);

  console.log('Seeding complete! Admin user: admin / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
