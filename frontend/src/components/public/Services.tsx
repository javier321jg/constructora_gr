import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, HardHat, Home, Warehouse, Wrench, Ruler } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { contentApi } from '../../services/api';
import { Service } from '../../types';

const iconMap: Record<string, any> = {
  Building2,
  HardHat,
  Home,
  Warehouse,
  Wrench,
  Ruler,
};

export const Services = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🔍 Cargando servicios desde API...');
        const response = await contentApi.getServices(false);
        console.log('✅ Servicios recibidos:', response.data);
        setServices(response.data);
      } catch (error) {
        console.error('❌ Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Servicios por defecto si no hay en la base de datos
  const defaultServices = [
    {
      id: 1,
      name: 'Construcción Residencial',
      short_description: 'Casas y desarrollos habitacionales de alta calidad con diseños personalizados',
      full_description: 'Construcción de viviendas personalizadas y desarrollos residenciales',
      icon: 'Home',
      color: '#FF6B35',
      order: 1,
      is_active: true,
    },
    {
      id: 2,
      name: 'Construcción Comercial',
      short_description: 'Espacios comerciales funcionales, modernos y adaptados a tus necesidades',
      full_description: 'Edificios comerciales, oficinas y centros de negocios',
      icon: 'Building2',
      color: '#004E89',
      order: 2,
      is_active: true,
    },
    {
      id: 3,
      name: 'Construcción Industrial',
      short_description: 'Infraestructura industrial robusta, eficiente y de última generación',
      full_description: 'Naves industriales, almacenes y plantas de producción',
      icon: 'Warehouse',
      color: '#F7B801',
      order: 3,
      is_active: true,
    },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  console.log('📊 Servicios a mostrar:', displayServices.length, displayServices);

  if (loading) {
    return (
      <section id="servicios" className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card shimmer h-80" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicios" className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" ref={ref}>
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Nuestros <span className="text-primary">Servicios</span>
          </h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Ofrecemos soluciones integrales de construcción para proyectos de cualquier escala.
            Calidad, experiencia y profesionalismo en cada obra.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon || 'Building2'] || Building2;

            return (
              <motion.div
                key={service.id}
                className="group relative"
                variants={{
                  hidden: { opacity: 0, y: 60, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1],
                    },
                  },
                }}
              >
                <div className="h-full relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Borde superior colorido */}
                  <div
                    className="absolute top-0 left-0 right-0 h-2 transition-all duration-500 group-hover:h-3"
                    style={{ background: `linear-gradient(90deg, ${service.color}, ${service.color}dd)` }}
                  />

                  {/* Fondo animado */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${service.color}, transparent)` }}
                  />

                  <div className="p-8 relative">
                    {/* Icono con animación 3D y efecto de flotación */}
                    <motion.div
                      className="mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500"
                      style={{ transformStyle: 'preserve-3d' }}
                      initial={{ scale: 0, rotate: 180 }}
                      animate={isVisible ? { scale: 1, rotate: 0 } : {}}
                      transition={{
                        delay: index * 0.15 + 0.3,
                        duration: 0.8,
                        type: 'spring',
                        stiffness: 200,
                      }}
                    >
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${service.color}20, ${service.color}40)`,
                        }}
                      >
                        {/* Efecto de brillo en el icono */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <Icon
                          size={40}
                          style={{ color: service.color }}
                          className="relative z-10 transform group-hover:rotate-12 transition-transform duration-500"
                        />
                      </div>

                      {/* Sombra del icono animada */}
                      <div
                        className="absolute top-0 left-0 w-20 h-20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                        style={{ backgroundColor: service.color }}
                      />
                    </motion.div>

                    {/* Contenido */}
                    <h3 className="text-2xl font-bold mb-4 transition-colors duration-300 group-hover:text-primary">
                      {service.name}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {service.short_description}
                    </p>

                    {/* Separador animado */}
                    <div className="mb-6 overflow-hidden">
                      <div
                        className="h-1 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                        style={{ backgroundColor: service.color }}
                      />
                    </div>

                    {/* Botón de acción */}
                    <div className="transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                      <button
                        className="flex items-center space-x-2 font-bold transition-all duration-300"
                        style={{ color: service.color }}
                      >
                        <span>Más información</span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Efecto de brillo diagonal */}
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-1000 pointer-events-none" />

                  {/* Esquinas decorativas */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                    <div
                      className="absolute top-0 right-0 w-full h-full"
                      style={{
                        background: `linear-gradient(135deg, transparent 50%, ${service.color} 50%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Sombra externa animada */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"
                  style={{ backgroundColor: service.color }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Patrón de fondo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Tienes un proyecto en mente?
              </h3>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Contáctanos hoy y recibe una consulta gratuita. Transformemos tus ideas en realidad.
              </p>
              <a
                href="#contacto"
                className="inline-block bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-accent hover:text-dark transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Solicitar Cotización
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
