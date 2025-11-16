import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MailOpen, Trash2, Phone, Calendar } from 'lucide-react';
import { useAuthStore } from '../context/useAuthStore';
import { contactApi } from '../services/api';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const AdminMessages = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await contactApi.getMessages();
        setMessages(response.data || []);
      } catch (error) {
        console.error('Error loading messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [isAuthenticated, navigate]);

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await contactApi.markAsRead(messageId);
      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (messageId: number) => {
    if (confirm('¿Estás seguro de eliminar este mensaje?')) {
      try {
        await contactApi.deleteMessage(messageId);
        setMessages(messages.filter((msg) => msg.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error al eliminar el mensaje');
      }
    }
  };

  const selectMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  const unreadCount = messages.filter((msg) => !msg.is_read).length;

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
              <div>
                <h1 className="text-2xl font-bold text-dark">Mensajes de Contacto</h1>
                <p className="text-sm text-gray-600">
                  {unreadCount} mensaje{unreadCount !== 1 ? 's' : ''} sin leer
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Mensajes */}
          <div className="lg:col-span-1 space-y-4">
            {messages.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Mail size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No hay mensajes</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => selectMessage(message)}
                  className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all hover:shadow-xl ${
                    selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
                  } ${!message.is_read ? 'border-l-4 border-primary' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {message.is_read ? (
                        <MailOpen size={16} className="text-gray-400" />
                      ) : (
                        <Mail size={16} className="text-primary" />
                      )}
                      <h3 className={`font-semibold ${!message.is_read ? 'text-primary' : ''}`}>
                        {message.name}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{message.subject}</p>
                  <p className="text-xs text-gray-500 truncate mb-2">{message.message}</p>
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(message.created_at)}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Detalle del Mensaje */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2" />
                      {selectedMessage.email}
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center">
                        <Phone size={16} className="mr-2" />
                        {selectedMessage.phone}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Calendar size={14} className="mr-2" />
                    {formatDate(selectedMessage.created_at)}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Mensaje:</h3>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <Mail size={18} />
                    <span>Responder por Email</span>
                  </a>
                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Phone size={18} />
                      <span>Llamar</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center h-full flex items-center justify-center">
                <div>
                  <MailOpen size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-400">Selecciona un mensaje para ver los detalles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
