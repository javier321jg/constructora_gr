import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Target, Eye, Award, Users } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { contentApi } from '../../services/api';
import { AboutContent, Statistics } from '../../types';

const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{displayValue.toLocaleString()}</span>;
};

export const About = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [aboutResponse, statsResponse] = await Promise.all([
          contentApi.getAbout(),
          contentApi.getStatistics(),
        ]);
        setAboutContent(aboutResponse.data);
        setStatistics(statsResponse.data);
      } catch (error) {
        console.error('Error loading about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <section id="nosotros" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="shimmer h-96 rounded-xl" />
            <div className="shimmer h-96 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  const defaultValues = aboutContent?.values || ['Calidad', 'Compromiso', 'Innovación', 'Responsabilidad'];

  return (
    <section id="nosotros" className="section-padding bg-gray-50" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Sobre <span className="text-primary">Nosotros</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {aboutContent?.description || 'Somos una empresa constructora con años de experiencia en el sector.'}
            </p>

            {/* Misión */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Target className="text-primary" size={24} />
                </div>
                <h3 className="text-2xl font-bold">Misión</h3>
              </div>
              <p className="text-gray-700 ml-16">
                {aboutContent?.mission || 'Construir proyectos de excelencia.'}
              </p>
            </div>

            {/* Visión */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                  <Eye className="text-secondary" size={24} />
                </div>
                <h3 className="text-2xl font-bold">Visión</h3>
              </div>
              <p className="text-gray-700 ml-16">
                {aboutContent?.vision || 'Ser la empresa constructora líder en la región.'}
              </p>
            </div>

            {/* Valores */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                  <Award className="text-accent" size={24} />
                </div>
                <h3 className="text-2xl font-bold">Valores</h3>
              </div>
              <div className="flex flex-wrap gap-3 ml-16">
                {defaultValues.map((value, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white px-4 py-2 rounded-full shadow-md font-semibold text-primary"
                  >
                    {value}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Imagen con estadísticas superpuestas */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              {aboutContent?.main_image ? (
                <img
                  src={aboutContent.main_image}
                  alt="Sobre nosotros"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary via-accent to-secondary" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Estadísticas */}
        {statistics && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter value={statistics.years_experience} />+
                </div>
                <div className="text-gray-600 font-semibold">Años de Experiencia</div>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="text-5xl font-bold text-secondary mb-2">
                  <AnimatedCounter value={statistics.projects_completed} />+
                </div>
                <div className="text-gray-600 font-semibold">Proyectos Completados</div>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="text-5xl font-bold text-accent mb-2">
                  <AnimatedCounter value={statistics.happy_clients} />+
                </div>
                <div className="text-gray-600 font-semibold">Clientes Satisfechos</div>
              </div>

              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter value={statistics.square_meters} />
                </div>
                <div className="text-gray-600 font-semibold">
                  m² Construidos
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
