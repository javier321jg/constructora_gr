import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Facebook, Instagram, Linkedin, Clock } from 'lucide-react';
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
  const formRef = useRef<HTMLFormElement>(null);

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
      <section id="contacto" className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="shimmer h-96 rounded-xl" />
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden" ref={ref}>
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="text-primary">Contáctanos</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Estamos listos para ayudarte con tu próximo proyecto. Cuéntanos tu idea y hagámosla realidad juntos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Información de contacto */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
          >
            {/* Dirección */}
            <motion.div
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
              variants={{
                hidden: { opacity: 0, x: -50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                },
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MapPin className="text-primary" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Dirección</h4>
                  <p className="text-gray-600 leading-relaxed">{contactInfo?.address || 'No disponible'}</p>
                </div>
              </div>
              <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full" />
            </motion.div>

            {/* Teléfono */}
            <motion.div
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
              variants={{
                hidden: { opacity: 0, x: -50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                },
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary/20 to-secondary/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Phone className="text-secondary" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Teléfono</h4>
                  <p className="text-gray-600">{contactInfo?.phone_primary || 'No disponible'}</p>
                  {contactInfo?.phone_secondary && (
                    <p className="text-gray-600 mt-1">{contactInfo.phone_secondary}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-secondary to-primary transition-all duration-500 rounded-full" />
            </motion.div>

            {/* Email */}
            <motion.div
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
              variants={{
                hidden: { opacity: 0, x: -50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                },
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-accent/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Mail className="text-accent" size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Email</h4>
                  <p className="text-gray-600 break-all">{contactInfo?.email_general || 'No disponible'}</p>
                  {contactInfo?.email_sales && (
                    <p className="text-gray-600 mt-1 break-all">{contactInfo.email_sales}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-accent to-primary transition-all duration-500 rounded-full" />
            </motion.div>

            {/* Horario */}
            <motion.div
              className="bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl p-8 shadow-2xl text-white relative overflow-hidden"
              variants={{
                hidden: { opacity: 0, x: -50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                },
              }}
            >
              {/* Patrón de fondo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock size={32} />
                  <h4 className="font-bold text-xl">Horario de Atención</h4>
                </div>
                <p className="text-lg">{contactInfo?.schedule || 'Lunes a Viernes: 9:00 - 18:00'}</p>
              </div>
            </motion.div>

            {/* Redes sociales */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg"
              variants={{
                hidden: { opacity: 0, x: -50, scale: 0.95 },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1],
                  },
                },
              }}
            >
              <h4 className="font-bold text-xl mb-5 text-gray-900">Síguenos en Redes</h4>
              <div className="flex space-x-4">
                {contactInfo?.facebook_url && (
                  <a
                    href={contactInfo.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Facebook size={28} />
                  </a>
                )}
                {contactInfo?.instagram_url && (
                  <a
                    href={contactInfo.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Instagram size={28} />
                  </a>
                )}
                {contactInfo?.linkedin_url && (
                  <a
                    href={contactInfo.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-800 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Linkedin size={28} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {formStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 rounded-3xl p-16 text-center shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
                  className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-xl"
                >
                  <CheckCircle size={56} className="text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-green-700 mb-3">
                  ¡Mensaje Enviado Exitosamente!
                </h3>
                <p className="text-gray-700 text-lg">
                  Gracias por contactarnos. Nuestro equipo te responderá a la brevedad.
                </p>
              </motion.div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl"
                style={{ opacity: 0 }}
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Envíanos un Mensaje</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-bold mb-2 text-gray-700 group-focus-within:text-primary transition-colors">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none"
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold mb-2 text-gray-700 group-focus-within:text-primary transition-colors">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-bold mb-2 text-gray-700 group-focus-within:text-secondary transition-colors">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all duration-300 outline-none"
                        placeholder="+52 123 456 7890"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold mb-2 text-gray-700 group-focus-within:text-secondary transition-colors">
                        Asunto *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all duration-300 outline-none"
                        placeholder="Cotización de proyecto"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold mb-2 text-gray-700 group-focus-within:text-accent transition-colors">
                      Mensaje *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all duration-300 outline-none resize-none"
                      placeholder="Cuéntanos sobre tu proyecto..."
                    />
                  </div>

                  {formStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl font-semibold"
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formStatus === 'loading' ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send size={24} />
                        <span>Enviar Mensaje</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-gray-500 text-sm">
                    * Campos obligatorios
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
