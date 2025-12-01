import { motion } from 'framer-motion';
import '../styles/skills.css';

export default function Skills() {
  const skillCategories = [
    {
      name: 'Backend',
      skills: [
        "JavaScript",
        "TypeScript",
        "Node.js",
        "Express.js",
        "NestJS",
        "Java (intermediate)",
        "Spring Boot ",
        "Spring WebFlux (basic)",
        "SQL",
        "HTML (basic)",
        "CSS (basic)"
      ]
          },
    {
      name: 'Databases',
      skills: ['PostgreSQL', 'MongoDB', 'Mongoose', 'TypeORM', 'MySQL'],
    },
    {
      name: 'DevOps',
      skills: ['Docker', 'AWS', 'CI/CD', 'Linux'],
    },
    {
      name: 'Tools',
      skills: ['Git', 'REST APIs', 'GraphQL', 'Postman', 'VS Code'],
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="skills" id="skills">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Skills</h2>
          <div className="underline"></div>
        </motion.div>

        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {skillCategories.map((category) => (
            <motion.div key={category.name} className="skill-card" variants={itemVariants}>
              <h3>{category.name}</h3>
              <div className="skill-tags">
                {category.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    className="skill-tag"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
