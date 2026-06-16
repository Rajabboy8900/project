import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import '../styles/work.css';

const defaultProjects = [
  {
    id: 1,
    title: 'FastFood Delivery Backend',
    description:
      'Complete backend architecture for a delivery service, including authentication, JWT/refresh tokens, role-based access, products, categories, orders, branches, and couriers. Built with TypeScript, Node.js, and Prisma.',
    longDescription: 'Bu loyiha tezkor yetkazib berish (FastFood Delivery) xizmatlari uchun yaratilgan to\'liq API tizimidir. Tizimda xaridorlar, kurerlar, filiallar va administratorlar uchun alohida roliklar mavjud. Buyurtma yaratilganda real-vaqtda kurerlarga bildirishnoma boradi. Shuningdek, JWT tokenlar bilan xavfsizlik va refresh token mexanizmi o\'rnatilgan. Baza bilan tezkor ishlash uchun Prisma ORM va PostgreSQL ishlatilgan.',
    tags: ['TypeScript', 'Node.js', 'Prisma', 'PostgreSQL'],
    link: '#',
    githubLink: 'https://github.com/Rajabboy8900',
    imageUrl: '/icon.png',
  },
  {
    id: 2,
    title: 'CRM Management System',
    description:
      'Advanced CRM backend with modules for students, groups, payments, attendance, filtering, pagination, notifications, and full admin authentication. Built using NestJS and PostgreSQL.',
    longDescription: 'O\'quv markazlari faoliyatini avtomatlashtirish uchun mo\'ljallangan yirik CRM tizimi backendi. O\'quvchilar guruhlari, davomat nazorati, oylik to\'lovlar tizimi va sms-xabarnomalar moduli mavjud. NestJS freymvorkining eng so\'nggi arxitekturaviy yondashuvlari (CQRS, microservices) asosida yozilgan. Tizimda to\'liq audit va loglar yuritiladi.',
    tags: ['NestJS', 'PostgreSQL', 'Prisma', 'JWT'],
    link: '#',
    githubLink: 'https://github.com/Rajabboy8900',
    imageUrl: '/icon.png',
  },
  {
    id: 4,
    title: 'Telegram Quiz Bot Backend',
    description:
      'Telegram bot backend supporting quiz logic, scoring system, difficulty levels, user statistics, and real-time question delivery. Built with Telegraf and PostgreSQL.',
    longDescription: 'Foydalanuvchilar o\'tishida bilimlar darajasini sinash uchun Telegram viktorina bot. Telegraf.js kutubxonasi yordamida yozilgan. Tezkor hisob-kitoblar va keshlar uchun Redis ishlatilgan. Har bir foydalanuvchining shaxsiy reytingi va yutuqlari ma\'lumotlar bazasida saqlanadi. Savollar dinamik ravishda toifalarga qarab taqsimlanadi.',
    tags: ['Node.js', 'Telegraf', 'PostgreSQL', 'Redis'],
    link: '#',
    githubLink: 'https://github.com/Rajabboy8900',
    imageUrl: '/icon.png',
  },
];

export default function Work() {
  const [projects, setProjects] = useState(defaultProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const parsed = data.map((p) => ({
            ...p,
            tags: typeof p.tags === 'string' ? p.tags.split(',') : p.tags,
          }));
          setProjects(parsed);
        }
      })
      .catch((err) => console.log('Error fetching projects, using static data', err));
  }, []);

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

  const filters = ['All', 'Node.js', 'NestJS', 'PostgreSQL', 'TypeScript', 'MongoDB'];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter((project) => 
        project.tags && project.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase()))
      );

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

        {/* Project Filters */}
        <div className="work-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <motion.div
          className="work-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              className="work-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedProject(project)}
              style={{ cursor: 'pointer' }}
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
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* PROJECT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              className="project-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={() => setSelectedProject(null)}>&times;</button>
              
              {selectedProject.imageUrl && (
                <div className="modal-image-container">
                  <img src={selectedProject.imageUrl} alt={selectedProject.title} className="modal-image" />
                </div>
              )}

              <h3 className="modal-title">{selectedProject.title}</h3>
              
              <div className="modal-tags">
                {selectedProject.tags.map((tag) => (
                  <span key={tag} className="modal-tag">{tag}</span>
                ))}
              </div>

              <div className="modal-body">
                <p className="modal-short-desc">{selectedProject.description}</p>
                {selectedProject.longDescription && (
                  <div className="modal-long-desc">
                    <h4>Batafsil ma'lumot:</h4>
                    <p>{selectedProject.longDescription}</p>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                {selectedProject.link && selectedProject.link !== '#' && (
                  <a href={selectedProject.link} target="_blank" rel="noreferrer" className="btn-primary-link">View Live</a>
                )}
                {selectedProject.githubLink && (
                  <a href={selectedProject.githubLink} target="_blank" rel="noreferrer" className="btn-secondary-link">View Source Code</a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
