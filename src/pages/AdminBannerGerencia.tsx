import { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, ImagePlus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

interface Banner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

const BannerAdminPanel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('https://portalaeronauta.com/ads/banners/all');
      setBanners(response.data);
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este banner?')) return;

    try {
      await axios.delete(`https://portalaeronauta.com/ads/banners/${id}`);
      setBanners(banners.filter(banner => banner.id !== id));
      alert('Banner excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      alert('Erro ao excluir banner');
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await axios.patch(`https://portalaeronauta.com/ads/banners/${id}`, {
        isActive: !currentStatus
      });
      setBanners(banners.map(banner => 
        banner.id === id ? { ...banner, isActive: !currentStatus } : banner
      ));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-blue-100">
          Carregando banners...
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-8">
        <div className="max-w-7xl mx-auto mt-12">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 rounded-2xl shadow-2xl mb-8">
            <div className="flex items-center gap-4">
              <LayoutDashboard className="w-12 h-12 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Gerenciamento de Banners</h1>
                <p className="text-blue-200 mt-1">Gerencie os banners ativos e seus links de destino</p>
              </div>
            </div>
          </div>

          {/* Lista de Banners */}
          <div className="grid gap-6">
            {banners.map(banner => (
              <div 
                key={banner.id} 
                className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 transition-all hover:bg-white/20"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Preview da Imagem */}
                  <div className="relative group flex-shrink-0">
                    <img
                      src={banner.imageUrl}
                      alt="Banner"
                      className="w-64 h-32 object-cover rounded-lg border-4 border-blue-300 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <Link
                    to={`/banner/${banner.id}`}
                    className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <span>Ver Detalhes</span>
                  </Link>
                    </div>
                  </div>

                  {/* Controles */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <ImagePlus className="w-6 h-6 text-blue-300" />
                      <input
                        type="url"
                        value={banner.linkUrl}
                        readOnly
                        className="w-full bg-white/20 rounded-md px-4 py-2 text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => toggleActive(banner.id, banner.isActive)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                          banner.isActive 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {banner.isActive ? (
                          <>
                            <ToggleRight className="w-5 h-5" />
                            <span>Ativo</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5" />
                            <span>Inativo</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>Excluir Banner</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-blue-200">
                      <span className="bg-white/20 px-2 py-1 rounded-md">
                        ID: {banner.id}
                      </span>
                      <span className="bg-white/20 px-2 py-1 rounded-md">
                        Status: {banner.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!banners.length && (
            <div className="text-center py-16">
              <div className="text-blue-200 mb-4">
                <ImagePlus className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl text-blue-100 mb-2">
                Nenhum banner cadastrado ainda
              </h3>
              <p className="text-blue-300">
                Comece adicionando seu primeiro banner usando o formulário de upload
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BannerAdminPanel;