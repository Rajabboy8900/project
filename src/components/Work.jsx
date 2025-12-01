import { motion } from 'framer-motion';
import '../styles/work.css';

export default function Work() {
  const projects = [
    {
      id: 1,
      title: 'FastFood Delivery Backend',
      description:
        'Full backend system including authentication, JWT tokens, refresh tokens, role-based access, products, orders, branches, and courier modules built with TypeScript and Prisma.',
      tags: ['TypeScript', 'Node.js', 'Prisma', 'PostgreSQL'],
      link: '#',
    },
    {
      id: 2,
      title: 'CRM Management System',
      description:
        'Complete CRM backend featuring students, groups, payments, attendance, notifications, filtering, pagination, and admin-level access using NestJS.',
      tags: ['NestJS', 'PostgreSQL', 'Prisma', 'JWT'],
      link: '#',
    },
    {
      id: 3,
      title: 'Spring Boot REST API Service',
      description:
        'Scalable REST API with layered architecture, JPA, pagination, search, validation, error handling, and JWT authentication written in Java + Spring Boot.',
      tags: ['Java', 'Spring Boot', 'Spring Data JPA', 'MySQL'],
      link: '#',
    },
    {
      id: 4,
      title: 'Telegram Quiz Bot Backend',
      description:
        'Telegram bot backend supporting user statistics, score tracking, difficulty levels, and real-time quiz logic.',
      tags: ['Node.js', 'Telegraf', 'PostgreSQL', 'Redis'],
      link: '#',
    },
    {
      id: 5,
      title: 'Algo Trading Bot',
      description:
        'Python-based trading bot capable of executing automated strategies, analyzing market data, and generating entry/exit signals.',
      tags: ['Python', 'Pandas', 'NumPy', 'Trading APIs'],
      link: '#',
    },
    {
      id: 6,
      title: 'E-Learning Platform Backend',
      description:
        'Backend system with courses, lessons, user authentication, payments, teacher dashboard, and progress tracking.',
      tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
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
