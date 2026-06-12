import { motion } from 'framer-motion';
import '../styles/hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="hero-greeting" style={{color: '#6b7280', fontSize: '1.2rem'}}>Hi,</p>
          <h1 className="hero-title">
            I'm <span className="accent">Rajabboy</span>
          </h1>
          <p className="hero-subtitle">Backend Developer</p>
          
          <div className="hero-socials">
            <a href="https://github.com/Rajabboy8900" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/rajabboy007/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://t.me/R_rajabovv" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="blob"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/image.png" alt="Rajabboy" className="profile-img" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}