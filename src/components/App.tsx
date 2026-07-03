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
import ScrollAudio from './ScrollAudio';

export default function App() {
  return (
    <ThemeProvider>
      <ScrollAudio />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <DesignSwitcher />
    </ThemeProvider>
  );
}
