import { motion } from 'framer-motion';
import { Building2, HardHat, Home, Warehouse, Wrench, Ruler, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useServices } from '../../hooks/useApiQueries';
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
  const { data: services = [], isLoading } = useServices(false);

  // Servicios por defecto si no hay en la base de datos
  const defaultServices = [
    {
      id: 1,
      name: 'Construcción Residencial',
      short_description: 'Casas y desarrollos habitacionales de alta calidad',
      full_description: 'Construcción de viviendas personalizadas y desarrollos residenciales',
      icon: 'Home',
      color: '#FF6B35',
      order: 1,
      is_active: true,
    },
    {
      id: 2,
      name: 'Construcción Comercial',
      short_description: 'Espacios comerciales funcionales y modernos',
      full_description: 'Edificios comerciales, oficinas y centros de negocios',
      icon: 'Building2',
      color: '#004E89',
      order: 2,
      is_active: true,
    },
    {
      id: 3,
      name: 'Construcción Industrial',
      short_description: 'Infraestructura industrial robusta y eficiente',
      full_description: 'Naves industriales, almacenes y plantas de producción',
      icon: 'Warehouse',
      color: '#F7B801',
      order: 3,
      is_active: true,
    },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  if (isLoading) {
    return (
      <section id="services" className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card shimmer h-72" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" ref={ref}>
      {/* Decorative background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <span className="text-primary font-semibold text-sm">Nuestras Soluciones</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark">
            Servicios <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Profesionales</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ofrecemos soluciones integrales de construcción de clase mundial para proyectos de cualquier escala
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon || 'Building2'] || Building2;

            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="group relative h-full"
              >
                <div className="bg-white rounded-2xl p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden">
                  {/* Gradient background on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                    style={{ background: service.color }}
                  />

                  {/* Icon container */}
                  <div className="mb-8 relative z-10">
                    <motion.div
                      className="inline-flex p-4 rounded-xl"
                      style={{ backgroundColor: `${service.color}15` }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <Icon
                        size={40}
                        style={{ color: service.color }}
                      />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-3 text-dark group-hover:text-primary transition-colors duration-300 relative z-10">
                    {service.name}
                  </h3>

                  <p className="text-gray-600 mb-6 line-clamp-3 relative z-10">
                    {service.short_description}
                  </p>

                  {/* CTA */}
                  <motion.div
                    className="mt-auto flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300 relative z-10"
                    whileHover={{ x: 4 }}
                  >
                    <span>Conocer más</span>
                    <ArrowRight size={18} className="ml-2" />
                  </motion.div>

                  {/* Accent border */}
                  <div
                    className="absolute top-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: `linear-gradient(to right, ${service.color}, transparent)` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
