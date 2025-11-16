import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { useAuthStore } from '../context/useAuthStore';
import { contentApi, imageApi } from '../services/api';
import { HeroContent } from '../types';

export const AdminHero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<HeroContent>({
    id: 1,
    title: '',
    subtitle: '',
    cta_text: '',
    background_image: '',
    background_video: '',
    overlay_color: '#1A1A2E',
    overlay_opacity: 0.6,
    updated_at: ''
  });
  const [uploading, setUploading] = useState(false);
  const [backgroundType, setBackgroundType] = useState<'none' | 'image' | 'video' | '3d'>('3d');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    const fetchContent = async () => {
      try {
        const response = await contentApi.getHero();
        setContent(response.data);

        // Determinar tipo de fondo
        if (response.data.background_video) {
          setBackgroundType('video');
        } else if (response.data.background_image) {
          setBackgroundType('image');
        } else {
          setBackgroundType('3d');
        }
      } catch (error) {
        console.error('Error loading hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [isAuthenticated, navigate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', type === 'video' ? 'videos' : 'general');

      const response = await imageApi.uploadImage(formData);

      if (type === 'video') {
        setContent({ ...content, background_video: response.data.url, background_image: '' });
        setBackgroundType('video');
      } else {
        setContent({ ...content, background_image: response.data.url, background_video: '' });
        setBackgroundType('image');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveBackground = () => {
    setContent({ ...content, background_image: '', background_video: '' });
    setBackgroundType('3d');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Limpiar el campo que no se está usando
      const dataToSave = {
        ...content,
        background_image: backgroundType === 'image' ? content.background_image : '',
        background_video: backgroundType === 'video' ? content.background_video : '',
      };

      await contentApi.updateHero(dataToSave);
      alert('Contenido actualizado exitosamente');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error al guardar el contenido');
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
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-dark">Editar Sección Hero</h1>
            </div>
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
      </header>

      {/* Main Content */}
      <main className="container-custom py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold mb-4">Contenido de Texto</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título Principal
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Construyendo el Futuro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <textarea
                  value={content.subtitle}
                  onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Experiencia, calidad y compromiso en cada proyecto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={content.cta_text}
                  onChange={(e) => setContent({ ...content, cta_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Ver Proyectos"
                />
              </div>
            </div>
          </motion.div>

          {/* Fondo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold mb-4">Fondo de la Sección</h2>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setBackgroundType('3d');
                    handleRemoveBackground();
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    backgroundType === '3d'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Animación 3D (por defecto)
                </button>
                <button
                  onClick={() => setBackgroundType('image')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    backgroundType === 'image'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ImageIcon size={18} />
                    <span>Imagen</span>
                  </div>
                </button>
                <button
                  onClick={() => setBackgroundType('video')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                    backgroundType === 'video'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Video size={18} />
                    <span>Video</span>
                  </div>
                </button>
              </div>

              {backgroundType === 'image' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {content.background_image ? (
                    <div className="relative">
                      <img
                        src={`http://localhost:5000${content.background_image}`}
                        alt="Background"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        onClick={handleRemoveBackground}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload size={48} className="text-gray-400 mb-2" />
                      <span className="text-gray-600 mb-2">Subir imagen de fondo</span>
                      <span className="text-sm text-gray-400">PNG, JPG, WEBP (máx. 50MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              )}

              {backgroundType === 'video' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {content.background_video ? (
                    <div className="relative">
                      <video
                        src={`http://localhost:5000${content.background_video}`}
                        className="w-full h-64 object-cover rounded-lg"
                        controls
                      />
                      <button
                        onClick={handleRemoveBackground}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload size={48} className="text-gray-400 mb-2" />
                      <span className="text-gray-600 mb-2">Subir video de fondo</span>
                      <span className="text-sm text-gray-400">MP4, WEBM (máx. 50MB)</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileUpload(e, 'video')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>
              )}

              {uploading && (
                <div className="text-center text-primary">Subiendo archivo...</div>
              )}
            </div>
          </motion.div>

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold mb-4">Capa de Oscurecimiento</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color de Overlay
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={content.overlay_color}
                    onChange={(e) => setContent({ ...content, overlay_color: e.target.value })}
                    className="w-20 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.overlay_color}
                    onChange={(e) => setContent({ ...content, overlay_color: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="#1A1A2E"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opacidad: {Math.round((content.overlay_opacity || 0) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={content.overlay_opacity || 0}
                  onChange={(e) => setContent({ ...content, overlay_opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
