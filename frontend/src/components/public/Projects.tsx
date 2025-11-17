import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, X, Maximize2 } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { contentApi } from '../../services/api';
import { Project } from '../../types';
import { ImageCarousel } from '../shared/ImageCarousel';

export const Projects = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🔍 Cargando proyectos desde API...');
        const response = await contentApi.getProjects();
        console.log('✅ Proyectos recibidos:', response.data);
        setProjects(response.data);
      } catch (error) {
        console.error('❌ Error loading projects:', error);
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

  if (loading) {
    return (
      <section id="proyectos" className="section-padding bg-gradient-to-b from-white to-gray-50">
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
    <section id="proyectos" className="section-padding bg-gradient-to-b from-white to-gray-50" ref={ref}>
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
          <p className="section-subtitle max-w-2xl mx-auto">
            Cada proyecto es una historia de éxito. Descubre nuestra trayectoria a través de construcciones que transforman espacios.
          </p>
        </motion.div>

        {/* Filtros con animaciones */}
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
              className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-2xl scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
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
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: 'easeOut',
                    },
                  },
                }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 h-96 bg-gradient-to-br from-gray-800 to-gray-900">
                  {/* Imagen de fondo */}
                  <div className="absolute inset-0">
                    {project.main_image ? (
                      <img
                        src={project.main_image}
                        alt={project.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white text-7xl font-bold opacity-30">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:from-black/90 group-hover:via-black/70 transition-all duration-500" />

                  {/* Efecto de partículas en hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
                  </div>

                  {/* Contenido */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                      {/* Badge de categoría */}
                      <div className="mb-3">
                        <span className="inline-block bg-gradient-to-r from-primary to-secondary px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg">
                          {project.category}
                        </span>
                        {project.is_featured && (
                          <span className="inline-block bg-accent text-dark px-4 py-1.5 rounded-full text-xs font-bold ml-2 shadow-lg">
                            ⭐ Destacado
                          </span>
                        )}
                      </div>

                      {/* Título */}
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white drop-shadow-lg">
                        {project.name}
                      </h3>

                      {/* Ubicación */}
                      {project.location && (
                        <div className="flex items-center text-white/90 text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          <MapPin size={16} className="mr-2" />
                          <span>{project.location}</span>
                        </div>
                      )}

                      {/* Descripción corta */}
                      <p className="text-white/80 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                        {project.description}
                      </p>

                      {/* Botón Ver más */}
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300 transform translate-y-4 group-hover:translate-y-0">
                        <button className="flex items-center space-x-2 bg-white text-primary px-6 py-2.5 rounded-full font-bold hover:bg-primary hover:text-white transition-colors shadow-xl">
                          <Maximize2 size={18} />
                          <span>Ver Detalles</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Borde animado */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-pulse" />
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
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <MapPin size={48} className="text-gray-400" />
            </div>
            <p className="text-xl text-gray-500">No se encontraron proyectos en esta categoría</p>
          </motion.div>
        )}

        {/* Modal de proyecto con carrusel */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header con imagen principal */}
                <div className="relative h-80 md:h-96 overflow-hidden rounded-t-3xl">
                  {selectedProject.main_image ? (
                    <img
                      src={selectedProject.main_image}
                      alt={selectedProject.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white text-9xl font-bold opacity-30">
                        {selectedProject.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Botón cerrar */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-all shadow-xl hover:scale-110"
                  >
                    <X size={24} className="text-gray-800" />
                  </button>

                  {/* Título superpuesto */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="mb-3">
                      <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                        {selectedProject.category}
                      </span>
                      {selectedProject.status === 'En curso' && (
                        <span className="inline-block bg-accent text-dark px-5 py-2 rounded-full text-sm font-bold ml-2 shadow-lg">
                          🚧 En Curso
                        </span>
                      )}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
                      {selectedProject.name}
                    </h2>
                  </div>
                </div>

                {/* Contenido del modal */}
                <div className="p-8 md:p-12">
                  {/* Información clave */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {selectedProject.client && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl">
                        <span className="text-gray-500 text-sm font-semibold block mb-1">Cliente</span>
                        <span className="text-gray-900 font-bold text-lg">{selectedProject.client}</span>
                      </div>
                    )}
                    {selectedProject.location && (
                      <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-xl">
                        <span className="text-gray-500 text-sm font-semibold block mb-1">Ubicación</span>
                        <div className="flex items-center">
                          <MapPin size={18} className="mr-2 text-primary" />
                          <span className="text-gray-900 font-bold">{selectedProject.location}</span>
                        </div>
                      </div>
                    )}
                    {selectedProject.square_meters && (
                      <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-5 rounded-xl">
                        <span className="text-gray-500 text-sm font-semibold block mb-1">Área</span>
                        <span className="text-gray-900 font-bold text-lg">
                          {selectedProject.square_meters.toLocaleString()} m²
                        </span>
                      </div>
                    )}
                    {selectedProject.end_date && (
                      <div className="bg-gradient-to-br from-accent/5 to-accent/10 p-5 rounded-xl">
                        <span className="text-gray-500 text-sm font-semibold block mb-1">Finalización</span>
                        <div className="flex items-center">
                          <Calendar size={18} className="mr-2 text-accent" />
                          <span className="text-gray-900 font-bold">
                            {new Date(selectedProject.end_date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Descripción del Proyecto</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Galería con carrusel */}
                  {selectedProject.images && selectedProject.images.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">Galería de Imágenes</h3>
                      <ImageCarousel images={selectedProject.images} height="600px" />
                    </div>
                  )}

                  {/* Video de YouTube si existe */}
                  {selectedProject.youtube_video && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-6 text-gray-900">Video del Proyecto</h3>
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={selectedProject.youtube_video}
                          title={selectedProject.name}
                          className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
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
