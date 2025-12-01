import { motion } from 'framer-motion';
import '../styles/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container">
        <div className="footer-content">
          <p>&copy; {currentYear} Rajabboy. All rights reserved.</p>
          <div className="footer-links">
            <motion.a href="#" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              Privacy
            </motion.a>
            <motion.a href="#" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              Terms
            </motion.a>
            <motion.a href="#" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              GitHub
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
