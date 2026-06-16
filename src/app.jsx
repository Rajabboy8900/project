import { useState, useEffect } from 'react';
import './styles/global.css';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Work from './components/Work';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';
import { API_URL } from './config';

// Lightweight Scroll Progress Component to isolate state updates and prevent App-wide re-renders
function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Track site view on load
    if (!isAdmin) {
      fetch(`${API_URL}/api/analytics/view`, { method: 'POST' })
        .catch((err) => console.log('Error logging visitor view', err));
    }
  }, [isAdmin]);

  // Track Mouse Glow Movement
  useEffect(() => {
    if (isAdmin) return;
    const glow = document.getElementById('mouse-glow');
    const handleMouseMove = (e) => {
      if (!glow) return;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <>
      <div id="mouse-glow" className="mouse-glow" />
      <ScrollProgressBar />
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Work />
      <Blog />
      <Contact />
      <Footer />
    </>
  );
}

