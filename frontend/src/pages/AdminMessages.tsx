import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Mail, Phone, CheckCircle, Loader } from 'lucide-react';
import { useAuthStore } from '../context/useAuthStore';
import { contactApi } from '../services/api';
import { ContactMessage } from '../types';

export const AdminMessages = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await contactApi.getMessages(filter === 'unread');
        setMessages(response.data);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAuthenticated, navigate, filter]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await contactApi.markAsRead(id);
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      try {
        await contactApi.deleteMessage(id);
        setMessages(messages.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        alert('Mensaje eliminado correctamente');
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error al eliminar el mensaje');
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
              <h1 className="text-2xl font-bold">Mensajes de Contacto</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'unread'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sin Leer
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No hay mensajes</p>
                </div>
              ) : (
                <div className="divide-y max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.button
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (!message.is_read) {
                            handleMarkAsRead(message.id);
                          }
                        }}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                          selectedMessage?.id === message.id
                            ? 'border-l-primary bg-primary/5'
                            : !message.is_read
                            ? 'border-l-yellow-500 bg-yellow-50/30'
                            : 'border-l-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 line-clamp-1">
                            {message.name}
                          </h4>
                          {!message.is_read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{message.email}</p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {message.subject}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedMessage.name}</h2>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="flex items-center space-x-1 hover:text-primary transition-colors"
                      >
                        <Mail size={18} />
                        <span>{selectedMessage.email}</span>
                      </a>
                      {selectedMessage.phone && (
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="flex items-center space-x-1 hover:text-primary transition-colors"
                        >
                          <Phone size={18} />
                          <span>{selectedMessage.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!selectedMessage.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Marcar como leído"
                      >
                        <CheckCircle size={24} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-xs bg-primary text-white px-3 py-1 rounded-full">
                    {selectedMessage.subject}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(selectedMessage.created_at).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 text-lg">Mensaje</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 flex items-center justify-center min-h-96">
                <div className="text-center text-gray-500">
                  <Mail size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-xl">Selecciona un mensaje para verlo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
