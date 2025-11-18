import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, X, Award, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useProjects } from '../../hooks/useApiQueries';
import { LazyImage } from '../shared/LazyImage';
import { Project } from '../../types';

export const Projects = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const { data: projects = [], isLoading } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Residencial', 'Comercial', 'Industrial'];

  const filteredProjects = selectedCategory === 'Todos'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="shimmer h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden" ref={ref}>
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <span className="text-primary font-semibold text-sm">Portfolio de Proyectos</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark">
            Proyectos <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Destacados</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra trayectoria a través de proyectos exitosos que transforman espacios
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                layout
                className="group cursor-pointer h-full"
                onClick={() => setSelectedProject(project)}
                whileHover={{ y: -8 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-96 bg-white border border-gray-200">
                  {/* Image Container */}
                  <div className="absolute inset-0 overflow-hidden">
                    {project.main_image ? (
                      <LazyImage
                        src={project.main_image}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Award size={80} className="text-primary/30" />
                      </div>
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Featured Badge */}
                  {project.is_featured && (
                    <motion.div
                      className="absolute top-4 right-4 z-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="bg-gradient-to-r from-accent to-primary text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1">
                        <Award size={14} />
                        Destacado
                      </div>
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    {/* Category Badge */}
                    <motion.div
                      className="mb-4 inline-block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <span className="bg-primary/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {project.category}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors duration-300">
                      {project.name}
                    </h3>

                    {/* Location */}
                    {project.location && (
                      <motion.div
                        className="flex items-center text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                      >
                        <MapPin size={16} className="mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">{project.location}</span>
                      </motion.div>
                    )}

                    {/* Description */}
                    <motion.p
                      className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {project.description}
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                      className="mt-4 flex items-center text-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                    >
                      <span>Ver detalles</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-500"
          >
            <p className="text-xl">No se encontraron proyectos en esta categoría</p>
          </motion.div>
        )}

        {/* Modal de proyecto */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header del modal */}
                <div className="relative h-64 md:h-96">
                  {selectedProject.main_image ? (
                    <img
                      src={selectedProject.main_image}
                      alt={selectedProject.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
                  )}

                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Contenido del modal */}
                <div className="p-8">
                  <div className="mb-4">
                    <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {selectedProject.category}
                    </span>
                    {selectedProject.status === 'En curso' && (
                      <span className="inline-block bg-accent text-dark px-4 py-2 rounded-full text-sm font-semibold ml-2">
                        En Curso
                      </span>
                    )}
                  </div>

                  <h2 className="text-4xl font-bold mb-4">{selectedProject.name}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-600">
                    {selectedProject.client && (
                      <div>
                        <span className="font-semibold">Cliente:</span> {selectedProject.client}
                      </div>
                    )}
                    {selectedProject.location && (
                      <div className="flex items-center">
                        <MapPin size={18} className="mr-2" />
                        {selectedProject.location}
                      </div>
                    )}
                    {selectedProject.square_meters && (
                      <div>
                        <span className="font-semibold">Área:</span> {selectedProject.square_meters.toLocaleString()} m²
                      </div>
                    )}
                    {selectedProject.end_date && (
                      <div className="flex items-center">
                        <Calendar size={18} className="mr-2" />
                        {new Date(selectedProject.end_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {selectedProject.description}
                  </p>

                  {/* Image Gallery */}
                  {selectedProject.images && selectedProject.images.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold mb-6">Galería de Imágenes</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedProject.images.map((image, idx) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="overflow-hidden rounded-lg"
                          >
                            <LazyImage
                              src={image.image_url}
                              alt={image.caption || selectedProject.name}
                              className="w-full h-40 object-cover hover:scale-110 transition-transform duration-300 cursor-zoom-in"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
