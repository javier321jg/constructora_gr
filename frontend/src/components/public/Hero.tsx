import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ConstructionScene } from '../3D/ConstructionScene';
import { contentApi } from '../../services/api';
import { HeroContent } from '../../types';

export const Hero = () => {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await contentApi.getHero();
        setContent(response.data);
      } catch (error) {
        console.error('Error loading hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-dark to-secondary">
        <div className="animate-pulse text-white text-2xl">Cargando...</div>
      </div>
    );
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background 3D Scene */}
      <div className="absolute inset-0 z-0">
        <ConstructionScene
          enableControls={false}
          particleCount={800}
          particleColor="#FF6B35"
          particleSpeed={1}
        />
      </div>

      {/* Overlay oscuro */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(135deg, ${content?.overlay_color || '#1A1A2E'}${Math.round((content?.overlay_opacity || 0.6) * 255).toString(16)}, transparent)`,
        }}
      />

      {/* Contenido */}
      <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-5xl">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 text-shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="gradient-text bg-gradient-to-r from-white via-primary-light to-accent bg-clip-text text-transparent">
              {content?.title || 'Construyendo el Futuro'}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {content?.subtitle || 'Experiencia, calidad y compromiso en cada proyecto'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="#proyectos"
              className="btn-primary inline-block text-lg px-12 py-4 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {content?.cta_text || 'Ver Proyectos'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <a href="#servicios" className="text-white flex flex-col items-center">
          <span className="text-sm mb-2">Desliza hacia abajo</span>
          <ChevronDown size={32} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};
