import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, Keyboard } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface ImageCarouselProps {
  images: Array<{
    id: number;
    image_url: string;
    caption?: string;
  }>;
  height?: string;
  autoplay?: boolean;
}

export const ImageCarousel = ({ images, height = '500px', autoplay = true }: ImageCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
        <p className="text-gray-500 text-lg">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div ref={carouselRef} className="w-full animate-fade-in">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow, Keyboard]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={autoplay ? {
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        keyboard={{
          enabled: true,
        }}
        loop={images.length > 1}
        className="image-carousel"
        style={{ height }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.id} style={{ width: 'auto', maxWidth: '800px' }}>
            <div className="relative w-full h-full group">
              <img
                src={image.image_url}
                alt={image.caption || `Imagen ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay con caption */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg font-semibold">{image.caption}</p>
                </div>
              )}

              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .image-carousel {
          padding: 40px 20px;
        }

        .image-carousel .swiper-slide {
          background-position: center;
          background-size: cover;
        }

        .image-carousel .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #fff;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .image-carousel .swiper-pagination-bullet-active {
          opacity: 1;
          background: #FF6B35;
          transform: scale(1.3);
        }

        .image-carousel .swiper-button-next,
        .image-carousel .swiper-button-prev {
          color: #fff;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .image-carousel .swiper-button-next:hover,
        .image-carousel .swiper-button-prev:hover {
          background: rgba(255, 107, 53, 0.9);
          transform: scale(1.1);
        }

        .image-carousel .swiper-button-next::after,
        .image-carousel .swiper-button-prev::after {
          font-size: 20px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .image-carousel {
            padding: 20px 10px;
          }

          .image-carousel .swiper-button-next,
          .image-carousel .swiper-button-prev {
            width: 40px;
            height: 40px;
          }

          .image-carousel .swiper-button-next::after,
          .image-carousel .swiper-button-prev::after {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};
