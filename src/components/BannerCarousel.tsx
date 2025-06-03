import { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const BannerCarousel = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('https://portalaeronauta.com/ads/banners');
        setBanners(response.data);
      } catch (error) {
        console.error('Erro ao buscar banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return <div className="h-40 bg-gray-100 animate-pulse rounded-lg" />;

  if (!banners.length) return null;

  return (
    <div className="my-8 mx-auto max-w-7xl px-4" style={{ marginTop: "2rem"}}>
      <Carousel
        showArrows
        infiniteLoop
        autoPlay
        interval={3000}
        showStatus={false}
        showThumbs={false}
        
      >
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={banner.imageUrl}
              alt="Banner promocional"
              className="w-full h-40 sm:h-56 md:h-64 lg:h-72 xl:h-80 object-cover rounded-xl"
              loading="lazy"
            />
          </a>
        ))}
      </Carousel>
    </div>
  );
};

export default BannerCarousel;