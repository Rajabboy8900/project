import { motion } from 'framer-motion';
import '../styles/work.css';

export default function Work() {
  const projects = [
    {
      id: 1,
      title: 'FastFood Delivery Backend',
      description:
        'Complete backend architecture for a delivery service, including authentication, JWT/refresh tokens, role-based access, products, categories, orders, branches, and couriers. Built with TypeScript, Node.js, and Prisma.',
      tags: ['TypeScript', 'Node.js', 'Prisma', 'PostgreSQL'],
      link: '#',
    },
    {
      id: 2,
      title: 'CRM Management System',
      description:
        'Advanced CRM backend with modules for students, groups, payments, attendance, filtering, pagination, notifications, and full admin authentication. Built using NestJS and PostgreSQL.',
      tags: ['NestJS', 'PostgreSQL', 'Prisma', 'JWT'],
      link: '#',
    },
  
    {
      id: 4,
      title: 'Telegram Quiz Bot Backend',
      description:
        'Telegram bot backend supporting quiz logic, scoring system, difficulty levels, user statistics, and real-time question delivery. Built with Telegraf and PostgreSQL.',
      tags: ['Node.js', 'Telegraf', 'PostgreSQL', 'Redis'],
      link: '#',
    },
   
    {
      id: 6,
      title: 'E-Learning Platform Backend',
      description:
        'Backend system featuring courses, lessons, teacher dashboard, authentication, payments, and user progress tracking. Designed for scalable education systems.',
      tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      link: '#',
    },
    {
      id: 7,
      title: 'Hotel Booking Backend',
      description:
        'Reservation backend with room availability, booking management, user authentication, payment integration, and admin dashboard features.',
      tags: ['TypeScript', 'NestJS', 'PostgreSQL'],
      link: '#',
    },
    {
      id: 8,
      title: 'Real-Time Chat API',
      description:
        'WebSocket-powered chat backend with typing indicators, message history, private rooms, and Redis-based session management.',
      tags: ['Node.js', 'WebSocket', 'Redis', 'JWT'],
      link: '#',
    },
    {
      id: 9,
      title: 'URL Shortener Service',
      description:
        'High-performance URL shortener API supporting analytics, click tracking, and custom aliases.',
      tags: ['Node.js', 'Express', 'MongoDB'],
      link: '#',
    },
  
  ];
  
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="work" id="work">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Work</h2>
          <div className="underline"></div>
        </motion.div>

        <motion.div
          className="work-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {projects.map((project) => (
            <motion.a
              key={project.id}
              href={project.link}
              className="work-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="work-card-header">
                <h3>{project.title}</h3>
                <motion.svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  whileHover={{ x: 5, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </motion.svg>
              </div>

              <p className="work-description">{project.description}</p>

              <div className="work-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="work-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
