import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuthStore } from '../context/useAuthStore';
import { contentApi, imageApi } from '../services/api';

interface ProjectForm {
  id?: number;
  name: string;
  client: string;
  location: string;
  start_date: string;
  end_date: string;
  category: 'Residencial' | 'Comercial' | 'Industrial';
  status: 'En curso' | 'Completado';
  description: string;
  main_image: string;
  square_meters: number;
  budget: number;
  youtube_video: string;
  is_featured: boolean;
  images: Array<{ id?: number; image_url: string; caption: string; order: number }>;
}

export const AdminProjects = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<ProjectForm[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectForm | null>(null);
  const [uploading, setUploading] = useState(false);

  const emptyProject: ProjectForm = {
    name: '',
    client: '',
    location: '',
    start_date: '',
    end_date: '',
    category: 'Residencial',
    status: 'Completado',
    description: '',
    main_image: '',
    square_meters: 0,
    budget: 0,
    youtube_video: '',
    is_featured: false,
    images: [],
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await contentApi.getProjects();
        setProjects(response.data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, navigate]);

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editingProject) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'projects');

      const response = await imageApi.uploadImage(formData);
      setEditingProject({ ...editingProject, main_image: response.data.url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !editingProject) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('folder', 'projects');

        const response = await imageApi.uploadImage(formData);
        const newImage = {
          image_url: response.data.url,
          caption: '',
          order: editingProject.images.length + i,
        };
        setEditingProject({
          ...editingProject,
          images: [...editingProject.images, newImage],
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error al subir las imágenes');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      images: editingProject.images.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!editingProject) return;

    setSaving(true);
    try {
      if (editingProject.id) {
        await contentApi.updateProject(editingProject.id, editingProject);
      } else {
        await contentApi.createProject(editingProject);
      }

      // Recargar proyectos
      const response = await contentApi.getProjects();
      setProjects(response.data || []);
      setEditingProject(null);
      alert('Proyecto guardado exitosamente');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error al guardar el proyecto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
      await contentApi.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      alert('Proyecto eliminado');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  // Vista de edición
  if (editingProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-dark">
                  {editingProject.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                </h1>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                <span>{saving ? 'Guardando...' : 'Guardar'}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="container-custom py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Información básica */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Información del Proyecto</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Edificio Residencial Vista Mar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                  <input
                    type="text"
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                  <input
                    type="text"
                    value={editingProject.location}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="Completado">Completado</option>
                    <option value="En curso">En curso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Área (m²)</label>
                  <input
                    type="number"
                    value={editingProject.square_meters}
                    onChange={(e) => setEditingProject({ ...editingProject, square_meters: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto ($)</label>
                  <input
                    type="number"
                    value={editingProject.budget}
                    onChange={(e) => setEditingProject({ ...editingProject, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                  <input
                    type="date"
                    value={editingProject.start_date}
                    onChange={(e) => setEditingProject({ ...editingProject, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                  <input
                    type="date"
                    value={editingProject.end_date}
                    onChange={(e) => setEditingProject({ ...editingProject, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingProject.is_featured}
                      onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Marcar como destacado</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Imagen principal */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Imagen Principal</h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {editingProject.main_image ? (
                  <div className="relative">
                    <img
                      src={`http://localhost:5000${editingProject.main_image}`}
                      alt="Principal"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setEditingProject({ ...editingProject, main_image: '' })}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload size={48} className="text-gray-400 mb-2" />
                    <span className="text-gray-600 mb-2">Subir imagen principal</span>
                    <span className="text-sm text-gray-400">PNG, JPG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Galería de imágenes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Galería de Imágenes</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {editingProject.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`http://localhost:5000${image.image_url}`}
                      alt={`Galería ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <ImageIcon size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Agregar imágenes</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {uploading && (
                <div className="text-center text-primary">Subiendo imágenes...</div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Vista de lista
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold text-dark">Administrar Proyectos</h1>
            </div>
            <button
              onClick={() => setEditingProject(emptyProject)}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus size={18} />
              <span>Nuevo Proyecto</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-500 mb-4">No hay proyectos todavía</p>
              <button
                onClick={() => setEditingProject(emptyProject)}
                className="inline-flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <Plus size={18} />
                <span>Crear Primer Proyecto</span>
              </button>
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {project.main_image ? (
                  <img
                    src={`http://localhost:5000${project.main_image}`}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">{project.name.charAt(0)}</span>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => project.id && handleDelete(project.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
