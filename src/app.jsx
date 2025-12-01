import './styles/global.css';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Work from './components/Work';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Work />
      <Contact />
      <Footer />
    </>
  );
}
