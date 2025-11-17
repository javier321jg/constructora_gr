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
        const response = await contentApi.getServices(false);
        setServices(response.data);
      } catch (error) {
        console.error('Error loading services:', error);
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
        staggerChildren: 0.2,
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

  if (loading) {
    return (
      <section id="servicios" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card shimmer h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicios" className="section-padding bg-gray-50" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Nuestros <span className="text-primary">Servicios</span>
          </h2>
          <p className="section-subtitle">
            Ofrecemos soluciones integrales de construcción para proyectos de cualquier escala
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
                className="group relative"
              >
                <div
                  className="card h-full relative overflow-hidden cursor-pointer"
                  style={{ borderTop: `4px solid ${service.color}` }}
                >
                  {/* Imagen de fondo si existe */}
                  {service.image && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <img
                        src={`http://localhost:5000${service.image}`}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Fondo animado */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{ background: service.color }}
                  />

                  {/* Icono con animación 3D o Imagen */}
                  <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative z-10">
                    {service.image ? (
                      <div className="w-20 h-20 rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={`http://localhost:5000${service.image}`}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-16 h-16 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${service.color}20` }}
                      >
                        <Icon
                          size={32}
                          style={{ color: service.color }}
                          className="transform group-hover:rotate-12 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors relative z-10">
                    {service.name}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3 relative z-10">
                    {service.short_description}
                  </p>

                  {/* Botón hover */}
                  <div className="mt-auto pt-4 border-t border-gray-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 relative z-10">
                    <span className="text-primary font-semibold flex items-center">
                      Ver más
                      <svg
                        className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>

                  {/* Efecto de brillo */}
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 group-hover:left-full transition-all duration-700" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
