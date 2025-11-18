import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Edit, Loader } from 'lucide-react';
import { useAuthStore } from '../context/useAuthStore';
import { contentApi } from '../services/api';
import { Service } from '../types';

export const AdminServices = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    full_description: '',
    icon: 'Building2',
    color: '#FF6B35',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await contentApi.getServices(true);
        setServices(response.data);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [isAuthenticated, navigate]);

  const handleAddNew = () => {
    setEditingId(-1);
    setFormData({
      name: '',
      short_description: '',
      full_description: '',
      icon: 'Building2',
      color: '#FF6B35',
    });
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      short_description: service.short_description,
      full_description: service.full_description,
      icon: service.icon || 'Building2',
      color: service.color || '#FF6B35',
    });
  };

  const handleSave = async () => {
    try {
      if (editingId === -1) {
        // Create new
        const response = await contentApi.createService(formData);
        setServices([...services, response.data]);
      } else if (editingId !== null) {
        // Update existing
        await contentApi.updateService(editingId, formData);
        setServices(
          services.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
        );
      }
      setEditingId(null);
      alert('Servicio guardado correctamente');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error al guardar el servicio');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await contentApi.deleteService(id);
        setServices(services.filter((s) => s.id !== id));
        alert('Servicio eliminado correctamente');
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Error al eliminar el servicio');
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
              <h1 className="text-2xl font-bold">Gestionar Servicios</h1>
            </div>
            <button
              onClick={handleAddNew}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Nuevo Servicio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${service.color}20` }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: service.color }}
                    >
                      {service.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {service.short_description}
                </p>
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setEditingId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingId === -1 ? 'Nuevo Servicio' : 'Editar Servicio'}
                  </h2>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-600 hover:text-gray-900 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="input-field w-full"
                      placeholder="Nombre del servicio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Descripción Corta
                    </label>
                    <textarea
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          short_description: e.target.value,
                        })
                      }
                      className="input-field w-full resize-none"
                      rows={3}
                      placeholder="Descripción breve..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Descripción Completa
                    </label>
                    <textarea
                      value={formData.full_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          full_description: e.target.value,
                        })
                      }
                      className="input-field w-full resize-none"
                      rows={4}
                      placeholder="Descripción detallada..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Icono</label>
                      <select
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                        className="input-field w-full"
                      >
                        <option>Building2</option>
                        <option>HardHat</option>
                        <option>Home</option>
                        <option>Warehouse</option>
                        <option>Wrench</option>
                        <option>Ruler</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Color</label>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) =>
                          setFormData({ ...formData, color: e.target.value })
                        }
                        className="w-full h-10 border rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
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
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
