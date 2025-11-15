import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { contactApi } from '../../services/api';
import { ContactInfo } from '../../types';

export const Contact = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await contactApi.getInfo();
        setContactInfo(response.data);
      } catch (error) {
        console.error('Error loading contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setErrorMessage('');

    try {
      await contactApi.sendMessage(formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error: any) {
      setFormStatus('error');
      setErrorMessage(error.response?.data?.error || 'Error al enviar el mensaje');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <section id="contacto" className="section-padding bg-white">
        <div className="container-custom">
          <div className="shimmer h-96 rounded-xl" />
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="section-padding bg-white" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            Contáctanos
          </h2>
          <p className="section-subtitle">
            Estamos listos para ayudarte con tu próximo proyecto
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Información de contacto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>

              {/* Dirección */}
              <div className="flex items-start mb-6 group cursor-pointer">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary transition-colors">
                  <MapPin className="text-primary group-hover:text-white transition-colors" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Dirección</h4>
                  <p className="text-gray-600">{contactInfo?.address || 'No disponible'}</p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex items-start mb-6 group cursor-pointer">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-secondary transition-colors">
                  <Phone className="text-secondary group-hover:text-white transition-colors" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Teléfono</h4>
                  <p className="text-gray-600">{contactInfo?.phone_primary || 'No disponible'}</p>
                  {contactInfo?.phone_secondary && (
                    <p className="text-gray-600">{contactInfo.phone_secondary}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start mb-6 group cursor-pointer">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent transition-colors">
                  <Mail className="text-accent group-hover:text-white transition-colors" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Email</h4>
                  <p className="text-gray-600">{contactInfo?.email_general || 'No disponible'}</p>
                  {contactInfo?.email_sales && (
                    <p className="text-gray-600">{contactInfo.email_sales}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-gradient-to-br from-primary to-secondary text-white p-6 rounded-2xl">
              <h4 className="font-bold text-xl mb-3">Horario de Atención</h4>
              <p>{contactInfo?.schedule || 'Lunes a Viernes: 9:00 - 18:00'}</p>
            </div>

            {/* Redes sociales */}
            <div>
              <h4 className="font-bold text-xl mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                {contactInfo?.facebook_url && (
                  <a
                    href={contactInfo.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Facebook size={24} />
                  </a>
                )}
                {contactInfo?.instagram_url && (
                  <a
                    href={contactInfo.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Instagram size={24} />
                  </a>
                )}
                {contactInfo?.linkedin_url && (
                  <a
                    href={contactInfo.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            {formStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-50 border-2 border-green-500 rounded-2xl p-12 text-center"
              >
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  ¡Mensaje Enviado!
                </h3>
                <p className="text-gray-700">
                  Gracias por contactarnos. Te responderemos pronto.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nombre *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+52 123 456 7890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Asunto *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Motivo de contacto"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Mensaje *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Cuéntanos sobre tu proyecto..."
                  />
                </div>

                {formStatus === 'error' && (
                  <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="btn-primary w-full md:w-auto flex items-center justify-center space-x-2"
                >
                  {formStatus === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
