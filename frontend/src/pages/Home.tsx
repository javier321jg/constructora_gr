import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';
import { Hero } from '../components/public/Hero';
import { Services } from '../components/public/Services';
import { Projects } from '../components/public/Projects';
import { About } from '../components/public/About';
import { Contact } from '../components/public/Contact';

export const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div id="inicio">
          <Hero />
        </div>
        <Services />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};
