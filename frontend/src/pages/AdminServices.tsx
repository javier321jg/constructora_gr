import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';
import { useAuthStore } from '../context/useAuthStore';
import { contentApi, imageApi } from '../services/api';

interface Service {
  id?: number;
  name: string;
  short_description: string;
  full_description: string;
  icon: string;
  image: string;
  color: string;
  order: number;
  is_active: boolean;
}

export const AdminServices = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    const fetchServices = async () => {
      try {
        const response = await contentApi.getServices();
        setServices(response.data || []);
      } catch (error) {
        console.error('Error loading services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [isAuthenticated, navigate]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'services');

      const response = await imageApi.uploadImage(formData);
      const newServices = [...services];
      newServices[index].image = response.data.url;
      setServices(newServices);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(null);
    }
  };

  const addService = () => {
    setServices([
      ...services,
      {
        name: '',
        short_description: '',
        full_description: '',
        icon: '',
        image: '',
        color: '#FF6B35',
        order: services.length,
        is_active: true,
      },
    ]);
  };

  const removeService = (index: number) => {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index: number, field: keyof Service, value: any) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    setServices(newServices);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Aquí deberías tener un endpoint en tu API para actualizar todos los servicios
      // Por ahora, esto es un placeholder
      await Promise.all(
        services.map((service) => {
          if (service.id) {
            return contentApi.updateService(service.id, service);
          } else {
            return contentApi.createService(service);
          }
        })
      );
      alert('Servicios actualizados exitosamente');
    } catch (error) {
      console.error('Error saving services:', error);
      alert('Error al guardar servicios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-dark">Administrar Servicios</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={addService}
                className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus size={18} />
                <span>Agregar Servicio</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {services.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-500 mb-4">No hay servicios todavía</p>
              <button
                onClick={addService}
                className="inline-flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                <Plus size={18} />
                <span>Agregar Primer Servicio</span>
              </button>
            </div>
          ) : (
            services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold">Servicio #{index + 1}</h3>
                  <button
                    onClick={() => removeService(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Servicio
                      </label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="Ej: Construcción Residencial"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción Corta
                      </label>
                      <input
                        type="text"
                        value={service.short_description}
                        onChange={(e) => updateService(index, 'short_description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="Descripción breve..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción Completa
                      </label>
                      <textarea
                        value={service.full_description}
                        onChange={(e) => updateService(index, 'full_description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                        placeholder="Descripción detallada..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <input
                          type="color"
                          value={service.color}
                          onChange={(e) => updateService(index, 'color', e.target.value)}
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado
                        </label>
                        <select
                          value={service.is_active ? 'active' : 'inactive'}
                          onChange={(e) => updateService(index, 'is_active', e.target.value === 'active')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagen del Servicio
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64">
                      {service.image ? (
                        <div className="relative h-full">
                          <img
                            src={`http://localhost:5000${service.image}`}
                            alt={service.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={() => updateService(index, 'image', '')}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                          <Upload size={48} className="text-gray-400 mb-2" />
                          <span className="text-gray-600">Subir imagen</span>
                          <span className="text-sm text-gray-400">PNG, JPG, WEBP</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, index)}
                            className="hidden"
                            disabled={uploading === index}
                          />
                        </label>
                      )}
                    </div>
                    {uploading === index && (
                      <div className="text-center text-primary mt-2">Subiendo...</div>
                    )}
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
