import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Edit, Loader, Image as ImageIcon } from 'lucide-react';
import { useAuthStore } from '../context/useAuthStore';
import { contentApi } from '../services/api';
import { Project } from '../types';

export const AdminProjects = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Residencial',
    location: '',
    client: '',
    status: 'En curso',
    square_meters: 0,
    start_date: '',
    end_date: '',
    is_featured: false,
    main_image: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

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
  }, [isAuthenticated, navigate]);

  const handleAddNew = () => {
    setEditingId(-1);
    setFormData({
      name: '',
      description: '',
      category: 'Residencial',
      location: '',
      client: '',
      status: 'En curso',
      square_meters: 0,
      start_date: '',
      end_date: '',
      is_featured: false,
      main_image: '',
    });
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description,
      category: project.category,
      location: project.location || '',
      client: project.client || '',
      status: project.status || 'En curso',
      square_meters: project.square_meters || 0,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      is_featured: project.is_featured || false,
      main_image: project.main_image || '',
    });
  };

  const handleSave = async () => {
    try {
      if (editingId === -1) {
        const response = await contentApi.createProject(formData);
        setProjects([...projects, response.data]);
      } else if (editingId !== null) {
        await contentApi.updateProject(editingId, formData);
        setProjects(
          projects.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
        );
      }
      setEditingId(null);
      alert('Proyecto guardado correctamente');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      try {
        await contentApi.deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
        alert('Proyecto eliminado correctamente');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error al eliminar el proyecto');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold">Gestionar Proyectos</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Nuevo Proyecto</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-40 bg-gray-200">
                  {project.main_image ? (
                    <img
                      src={project.main_image}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                      <ImageIcon className="text-white" size={48} />
                    </div>
                  )}
                  {project.is_featured && (
                    <div className="absolute top-3 right-3 bg-accent text-dark px-3 py-1 rounded-full text-xs font-bold">
                      Destacado
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.category}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {project.location && (
                    <p className="text-sm text-gray-700 mb-4">
                      <span className="font-semibold">Ubicación:</span> {project.location}
                    </p>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary"
                    >
                      <Edit size={18} className="inline mr-1" /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-600"
                    >
                      <Trash2 size={18} className="inline mr-1" /> Eliminar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingId !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 max-h-screen overflow-y-auto"
              onClick={() => setEditingId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full p-8 my-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingId === -1 ? 'Nuevo Proyecto' : 'Editar Proyecto'}
                  </h2>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-600 hover:text-gray-900 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6 max-h-96 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input-field w-full"
                      placeholder="Nombre del proyecto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Descripción</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="input-field w-full resize-none"
                      rows={3}
                      placeholder="Descripción del proyecto..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Categoría</label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="input-field w-full"
                      >
                        <option>Residencial</option>
                        <option>Comercial</option>
                        <option>Industrial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Estado</label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="input-field w-full"
                      >
                        <option>En curso</option>
                        <option>Completado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Ubicación</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="input-field w-full"
                      placeholder="Ubicación del proyecto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Cliente</label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      className="input-field w-full"
                      placeholder="Nombre del cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">m² Construidos</label>
                    <input
                      type="number"
                      value={formData.square_meters}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          square_meters: parseInt(e.target.value) || 0,
                        })
                      }
                      className="input-field w-full"
                      min="0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Fecha Inicio</label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData({ ...formData, start_date: e.target.value })
                        }
                        className="input-field w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Fecha Fin</label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) =>
                          setFormData({ ...formData, end_date: e.target.value })
                        }
                        className="input-field w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({ ...formData, is_featured: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-semibold">
                      Marcar como destacado
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6 border-t mt-6">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex-1"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
