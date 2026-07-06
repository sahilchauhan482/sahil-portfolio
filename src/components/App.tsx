'use client';

import { ThemeProvider } from './ThemeProvider';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Contact from './Contact';
import Footer from './Footer';
import DesignSwitcher from './DesignSwitcher';
import VisitorGlobe from './VisitorGlobe';
import PortfolioChat from './PortfolioChat';
import CodeRainReveal from './CodeRainReveal';

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <CodeRainReveal />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <DesignSwitcher />
      <VisitorGlobe />
      <PortfolioChat />
    </ThemeProvider>
  );
}
