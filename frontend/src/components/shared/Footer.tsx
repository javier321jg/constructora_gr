import { motion } from 'framer-motion';
import { Building, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { useContactInfo, useSiteConfig } from '../../hooks/useApiQueries';

export const Footer = () => {
  const { data: contactInfo } = useContactInfo();
  const { data: siteConfig } = useSiteConfig();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <footer className="bg-dark text-white pt-20 pb-8 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Columna 1: Logo y descripción */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Building className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold">
                {siteConfig?.company_name || 'Constructora GR'}
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              {siteConfig?.slogan || 'Construyendo tus sueños'}
            </p>
            <p className="text-gray-400 text-sm">
              {siteConfig?.meta_description || 'Empresa constructora líder en proyectos de calidad.'}
            </p>
          </motion.div>

          {/* Columna 2: Enlaces rápidos */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {[
                { id: 'home', label: 'Inicio' },
                { id: 'services', label: 'Servicios' },
                { id: 'projects', label: 'Proyectos' },
                { id: 'about', label: 'Nosotros' },
                { id: 'contact', label: 'Contacto' },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Columna 3: Contacto */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              {contactInfo?.address && (
                <li className="flex items-start space-x-3">
                  <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
                  <span className="text-gray-400 text-sm">{contactInfo.address}</span>
                </li>
              )}
              {contactInfo?.phone_primary && (
                <li className="flex items-center space-x-3">
                  <Phone size={20} className="text-primary flex-shrink-0" />
                  <a
                    href={`tel:${contactInfo.phone_primary}`}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {contactInfo.phone_primary}
                  </a>
                </li>
              )}
              {contactInfo?.email_general && (
                <li className="flex items-center space-x-3">
                  <Mail size={20} className="text-primary flex-shrink-0" />
                  <a
                    href={`mailto:${contactInfo.email_general}`}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {contactInfo.email_general}
                  </a>
                </li>
              )}
            </ul>
          </motion.div>

          {/* Columna 4: Redes sociales */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              {contactInfo?.facebook_url && (
                <a
                  href={contactInfo.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {contactInfo?.instagram_url && (
                <a
                  href={contactInfo.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <Instagram size={20} />
                </a>
              )}
              {contactInfo?.linkedin_url && (
                <a
                  href={contactInfo.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Horario</h4>
              <p className="text-gray-400 text-sm">
                {contactInfo?.schedule || 'Lunes a Viernes: 9:00 - 18:00'}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer bottom */}
        <motion.div
          className="border-t border-gray-700 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {siteConfig?.footer_copyright || `© ${currentYear} Constructora GR. Todos los derechos reservados.`}
            </p>

            {/* Botón scroll to top */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-dark transition-all hover:scale-110"
              aria-label="Volver arriba"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
