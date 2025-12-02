import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/navigation.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  };

  return (
    <motion.nav
      className="nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="nav-container">
        <motion.div
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a href="#home">RajabboyDev</a>
        </motion.div>

        <ul className="nav-menu desktop">
          {['Home', 'About', 'Skills', 'Work', 'Contact'].map((item, i) => (
            <motion.li key={item} custom={i} variants={menuVariants} initial="hidden" animate="visible">
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </motion.li>
          ))}
        </ul>
        <motion.button
  className="nav-pattern"
  whileHover={{ scale: 1.1, rotate: 5 }}
  whileTap={{ scale: 0.95 }}
>
  <img src="/ornament.svg" alt="pattern" width="18" />
  Uzbek Pattern
</motion.button>


        <button className="nav-toggle mobile" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <motion.ul
          className="nav-menu mobile"
          variants={mobileMenuVariants}
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
        >
          {['Home', 'About', 'Skills', 'Work', 'Contact'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)}>
                {item}
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </motion.nav>
  );
}
