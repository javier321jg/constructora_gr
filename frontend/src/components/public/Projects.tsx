import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, X } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { contentApi } from '../../services/api';
import { Project } from '../../types';

export const Projects = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await contentApi.getProjects();
        setProjects(response.data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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

  if (loading) {
    return (
      <section id="proyectos" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="shimmer h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="proyectos" className="section-padding bg-white" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">
            Nuestros <span className="text-primary">Proyectos</span>
          </h2>
          <p className="section-subtitle">
            Descubre nuestra trayectoria a través de proyectos exitosos
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Grid de proyectos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                layout
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-80">
                  {/* Imagen */}
                  <div className="absolute inset-0">
                    {project.main_image ? (
                      <img
                        src={`http://localhost:5000${project.main_image}`}
                        alt={project.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white text-6xl font-bold opacity-20">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Contenido */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="mb-2">
                      <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-semibold">
                        {project.category}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{project.name}</h3>

                    {project.location && (
                      <div className="flex items-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        <MapPin size={16} className="mr-1" />
                        <span>{project.location}</span>
                      </div>
                    )}

                    <p className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Badge de destacado */}
                  {project.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-accent text-dark px-3 py-1 rounded-full text-xs font-bold">
                        Destacado
                      </span>
                    </div>
                  )}
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
                      src={`http://localhost:5000${selectedProject.main_image}`}
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

                  {/* Galería de imágenes */}
                  {selectedProject.images && selectedProject.images.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold mb-4">Galería del Proyecto</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedProject.images.map((image) => (
                          <img
                            key={image.id}
                            src={`http://localhost:5000${image.image_url}`}
                            alt={image.caption || selectedProject.name}
                            className="w-full h-40 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                          />
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
