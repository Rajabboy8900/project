import { motion } from 'framer-motion';
import { API_URL } from '../config';
import '../styles/hero.css';

export default function Hero() {
  const trackClick = async (type) => {
    try {
      await fetch(`${API_URL}/api/analytics/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
    } catch (err) {
      console.log('Error logging analytics click', err);
    }
  };

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
            <a href="https://github.com/Rajabboy8900" target="_blank" rel="noreferrer" onClick={() => trackClick('github')}>GitHub</a>
            <a href="https://www.linkedin.com/in/rajabboy007/" target="_blank" rel="noreferrer" onClick={() => trackClick('linkedin')}>LinkedIn</a>
            <a href="https://t.me/R_rajabovv" target="_blank" rel="noreferrer" onClick={() => trackClick('telegram')}>Telegram</a>
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
            <img src="/icon.png" alt="Rajabboy Icon" className="profile-img" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}