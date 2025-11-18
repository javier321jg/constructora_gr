import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { ConstructionScene } from '../3D/ConstructionScene';
import { useHeroContent } from '../../hooks/useApiQueries';

export const Hero = () => {
  const { data: content, isLoading } = useHeroContent();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div id="home" className="h-screen flex items-center justify-center bg-gradient-to-br from-dark via-secondary to-dark relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-white text-lg font-medium">Cargando proyecto...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Background 3D Scene with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: scrollY * 0.5 }}
      >
        <ConstructionScene
          enableControls={false}
          particleCount={800}
          particleColor="#FF6B35"
          particleSpeed={1}
        />
      </motion.div>

      {/* Animated overlay gradient */}
      <div className="absolute inset-0 z-10">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${content?.overlay_color || '#1A1A2E'}99 0%, transparent 50%)`,
          }}
        />
        {/* Additional accent gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={16} className="text-accent" />
            <span className="text-sm font-medium text-white">Innovación en construcción</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <span className="bg-gradient-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
              {content?.title || 'Construyendo el Futuro'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            {content?.subtitle || 'Experiencia, calidad y compromiso en cada proyecto'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          >
            <motion.button
              onClick={() => {
                const element = document.getElementById('projects');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg shadow-2xl hover:shadow-primary/50 transition-all duration-300 text-base sm:text-lg"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 107, 53, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              {content?.cta_text || 'Ver Proyectos'}
            </motion.button>

            <motion.button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 text-base sm:text-lg"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              Contactar
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.button
          onClick={() => {
            const element = document.getElementById('services');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center text-white cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-xs sm:text-sm mb-2 opacity-80">Desliza para continuar</span>
          <ChevronDown size={24} className="opacity-80" />
        </motion.button>
      </motion.div>
    </section>
  );
};
