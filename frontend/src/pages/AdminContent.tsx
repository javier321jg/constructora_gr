import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { useAuthStore } from '../context/useAuthStore';
import { contentApi } from '../services/api';
import { HeroContent, AboutContent, Statistics } from '../types';

export const AdminContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'stats'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hero Content State
  const [heroContent, setHeroContent] = useState<HeroContent>({
    id: 1,
    title: '',
    subtitle: '',
    cta_text: '',
    background_image: '',
    background_video: '',
    overlay_color: '#1A1A2E',
    overlay_opacity: 0.6,
  });

  // About Content State
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    id: 1,
    title: 'Sobre Nosotros',
    description: '',
    mission: '',
    vision: '',
    values: [],
    main_image: '',
  });

  // Statistics State
  const [statistics, setStatistics] = useState<Statistics>({
    id: 1,
    years_experience: 0,
    projects_completed: 0,
    happy_clients: 0,
    square_meters: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    const fetchContent = async () => {
      try {
        const [hero, about, stats] = await Promise.all([
          contentApi.getHero(),
          contentApi.getAbout(),
          contentApi.getStatistics(),
        ]);
        setHeroContent(hero.data);
        setAboutContent(about.data);
        setStatistics(stats.data);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [isAuthenticated, navigate]);

  const handleSaveHero = async () => {
    setSaving(true);
    try {
      await contentApi.updateHero(heroContent);
      alert('Hero actualizado correctamente');
    } catch (error) {
      console.error('Error saving hero:', error);
      alert('Error al guardar hero');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async () => {
    setSaving(true);
    try {
      await contentApi.updateAbout(aboutContent);
      alert('About actualizado correctamente');
    } catch (error) {
      console.error('Error saving about:', error);
      alert('Error al guardar about');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStats = async () => {
    setSaving(true);
    try {
      await contentApi.updateStatistics(statistics);
      alert('Estadísticas actualizadas correctamente');
    } catch (error) {
      console.error('Error saving stats:', error);
      alert('Error al guardar estadísticas');
    } finally {
      setSaving(false);
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Editar Contenido General</h1>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="container-custom flex space-x-8">
          {['hero', 'about', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'hero' && 'Hero'}
              {tab === 'about' && 'Sobre Nosotros'}
              {tab === 'stats' && 'Estadísticas'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="container-custom py-12">
        {/* Hero Section */}
        {activeTab === 'hero' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Título Principal</label>
                <input
                  type="text"
                  value={heroContent.title}
                  onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                  className="input-field w-full"
                  placeholder="Construyendo el Futuro"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Subtítulo</label>
                <textarea
                  value={heroContent.subtitle}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, subtitle: e.target.value })
                  }
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="Experiencia, calidad y compromiso en cada proyecto"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Texto del Botón</label>
                <input
                  type="text"
                  value={heroContent.cta_text}
                  onChange={(e) =>
                    setHeroContent({ ...heroContent, cta_text: e.target.value })
                  }
                  className="input-field w-full"
                  placeholder="Ver Proyectos"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Color de Overlay</label>
                  <input
                    type="color"
                    value={heroContent.overlay_color}
                    onChange={(e) =>
                      setHeroContent({ ...heroContent, overlay_color: e.target.value })
                    }
                    className="w-full h-12 border rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Opacidad Overlay</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={heroContent.overlay_opacity}
                    onChange={(e) =>
                      setHeroContent({
                        ...heroContent,
                        overlay_opacity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-1">{heroContent.overlay_opacity}</p>
                </div>
              </div>

              <button
                onClick={handleSaveHero}
                disabled={saving}
                className="btn-primary flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* About Section */}
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Descripción</label>
                <textarea
                  value={aboutContent.description}
                  onChange={(e) =>
                    setAboutContent({ ...aboutContent, description: e.target.value })
                  }
                  className="input-field w-full resize-none"
                  rows={4}
                  placeholder="Descripción de la empresa..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Misión</label>
                <textarea
                  value={aboutContent.mission}
                  onChange={(e) =>
                    setAboutContent({ ...aboutContent, mission: e.target.value })
                  }
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="Misión de la empresa..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Visión</label>
                <textarea
                  value={aboutContent.vision}
                  onChange={(e) =>
                    setAboutContent({ ...aboutContent, vision: e.target.value })
                  }
                  className="input-field w-full resize-none"
                  rows={3}
                  placeholder="Visión de la empresa..."
                />
              </div>

              <button
                onClick={handleSaveAbout}
                disabled={saving}
                className="btn-primary flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Statistics Section */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Años de Experiencia</label>
                <input
                  type="number"
                  value={statistics.years_experience}
                  onChange={(e) =>
                    setStatistics({
                      ...statistics,
                      years_experience: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input-field w-full"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Proyectos Completados</label>
                <input
                  type="number"
                  value={statistics.projects_completed}
                  onChange={(e) =>
                    setStatistics({
                      ...statistics,
                      projects_completed: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input-field w-full"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Clientes Satisfechos</label>
                <input
                  type="number"
                  value={statistics.happy_clients}
                  onChange={(e) =>
                    setStatistics({
                      ...statistics,
                      happy_clients: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input-field w-full"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">m² Construidos</label>
                <input
                  type="number"
                  value={statistics.square_meters}
                  onChange={(e) =>
                    setStatistics({
                      ...statistics,
                      square_meters: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input-field w-full"
                  min="0"
                />
              </div>
            </div>

            <button
              onClick={handleSaveStats}
              disabled={saving}
              className="btn-primary flex items-center space-x-2 mt-8"
            >
              {saving ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};
