import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

interface Banner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

const BannerViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`https://portalaeronauta.com/ads/banners/${id}`);
        setBanner(response.data);
      } catch (error) {
        console.error('Erro ao carregar banner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-blue-100">
          Carregando banner...
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center">
        <div className="text-2xl text-red-300">Banner não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          Voltar para o gerenciamento
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center gap-8">
            <img
              src={banner.imageUrl}
              alt="Banner completo"
              className="w-full max-w-4xl rounded-xl border-4 border-blue-300 shadow-lg"
            />
            
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-blue-100">Link de Destino</h2>
              <a
                href={banner.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 text-lg break-all"
              >
                {banner.linkUrl}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-white/20 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-300">Status</p>
                <p className={`text-lg font-semibold ${
                  banner.isActive ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {banner.isActive ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-300">ID do Banner</p>
                <p className="text-lg font-semibold text-blue-100">#{banner.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerViewPage;