import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import '../styles/hero.css';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="hero" id="home">
      <div className="container hero-content">
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <motion.p variants={itemVariants} className="hero-greeting">
            Hi,
          </motion.p>

          <motion.h1 variants={itemVariants} className="hero-title">
            I'm <span className="ac cent">Rajabboy</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-subtitle">
            Backend developer
          </motion.p>

          <motion.div variants={itemVariants} className="hero-cta-group">
            <motion.button
              className="hero-cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-socials">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: '#4f46e5' }}
              whileTap={{ scale: 0.95 }}
            >
              GitHub
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: '#4f46e5' }}
              whileTap={{ scale: 0.95 }}
            >
              LinkedIn
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: '#4f46e5' }}
              whileTap={{ scale: 0.95 }}
            >
              Twitter
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          variants={floatingVariants}
          animate="animate"
        >
          <div className="blob"></div>
        </motion.div>
      </div>
    </section>
  );
}
