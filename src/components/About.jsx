import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import '../styles/about.css';

export default function About() {
  const ref = useInView();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="about" id="about" ref={ref}>
      <div className="container">

        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>About Me</h2>
          <div className="underline"></div>
        </motion.div>

        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >

          

          {/* RIGHT SIDE – TEXT */}
          <motion.div className="about-text-block" variants={containerVariants}>
            <motion.p variants={itemVariants} className="about-text">
              I’m a backend developer with a strong foundation in building clean, reliable,
              and scalable server-side applications. My main tech stack includes Java,
              Spring Boot, Node.js, TypeScript and NestJS. I focus on applying modern
              architectural principles and industry best practices to deliver maintainable
              and high-quality backend systems.
            </motion.p>

            <motion.p variants={itemVariants} className="about-text">
              Throughout my journey, I’ve built authentication systems, REST APIs, CRM platforms,
              FastFood delivery backends, Telegram bot integrations and numerous real-world CRUD
              applications. I enjoy solving complex backend challenges, designing efficient data flows,
              and creating production-ready solutions that perform reliably under high load.
            </motion.p>

            <motion.div variants={itemVariants} className="about-stats">
              <div className="stat">
                <h3>1+</h3>
                <p>Years Experience</p>
              </div>
              <div className="stat">
                <h3>20+</h3>
                <p>Projects Completed</p>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
