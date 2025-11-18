import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Building,
  Briefcase,
  Image,
  Settings,
  LogOut,
  FileText,
  Users,
  MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '../context/useAuthStore';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const adminSections = [
    {
      title: 'Contenido General',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      description: 'Editar Hero, Nosotros, Estadísticas',
      path: '/admin/content',
      comingSoon: false,
    },
    {
      title: 'Servicios',
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      description: 'Gestionar servicios ofrecidos',
      path: '/admin/services',
      comingSoon: false,
    },
    {
      title: 'Proyectos',
      icon: Building,
      color: 'from-green-500 to-green-600',
      description: 'Administrar proyectos y galerías',
      path: '/admin/projects',
      comingSoon: false,
    },
    {
      title: 'Mensajes',
      icon: MessageSquare,
      color: 'from-yellow-500 to-yellow-600',
      description: 'Ver mensajes de contacto',
      path: '/admin/messages',
      comingSoon: false,
    },
    {
      title: 'Imágenes',
      icon: Image,
      color: 'from-pink-500 to-pink-600',
      description: 'Biblioteca de imágenes',
      path: '',
      comingSoon: true,
    },
    {
      title: 'Configuración',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      description: 'Configuración del sitio',
      path: '',
      comingSoon: true,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark">Panel de Administración</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-primary transition-colors"
              >
                Ver sitio
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Proyectos</p>
                <p className="text-3xl font-bold text-primary">--</p>
              </div>
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <Building className="text-primary" size={28} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Servicios</p>
                <p className="text-3xl font-bold text-secondary">--</p>
              </div>
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Briefcase className="text-secondary" size={28} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Mensajes Nuevos</p>
                <p className="text-3xl font-bold text-accent">--</p>
              </div>
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="text-accent" size={28} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Admin Sections */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6">Gestionar Contenido</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => !section.comingSoon && handleNavigate(section.path)}
                disabled={section.comingSoon}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 text-left w-full ${
                  section.comingSoon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2'
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${section.color}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="text-white" size={28} />
                    </div>
                    {section.comingSoon && (
                      <span className="text-xs bg-gray-200 px-3 py-1 rounded-full font-semibold text-gray-600">
                        Próximamente
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                  <p className="text-gray-600 text-sm">{section.description}</p>

                  {!section.comingSoon && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-primary font-semibold text-sm hover:underline">
                        Administrar →
                      </span>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-primary to-accent text-white rounded-xl p-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Panel de Administración v1.0</h3>
              <p className="text-white/90 mb-4">
                Gestiona todo el contenido de tu sitio web desde este panel centralizado.
              </p>
              <ul className="space-y-2 text-sm">
                <li>✓ Actualización en tiempo real</li>
                <li>✓ Gestión de imágenes optimizadas</li>
                <li>✓ Editor WYSIWYG para contenido</li>
                <li>✓ Sistema de respaldo automático</li>
              </ul>
            </div>
            <div className="hidden md:block">
              <Users size={120} className="text-white/20" />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
