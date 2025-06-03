// Simulados.tsx (Lista de categorias)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/img/portalaeronauta.jpg";
import Header from '../components/Header';

interface Categoria {
  id: number;
  nome: string;
  imagem: string;
}

const Simulados = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('https://portalaeronauta.com/modulos/categorias');
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  if (loading) {
    return <div className="text-white text-center p-6">Carregando categorias...</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white p-6">
        <header className="mb-12 text-center" style={{ marginTop: "3rem"}}>
          <h2 className="text-4xl font-bold">Simulados Disponíveis</h2>
          <p className="text-blue-200 mt-2 text-lg">Selecione um curso para ver os módulos disponíveis</p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
           <div
    className="relative group bg-gradient-to-br from-red-50 to-orange-100 text-red-900 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer h-48 border-2 border-red-200 hover:border-red-300"
    onClick={() => navigate('/simulados/desafio-insano')}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-400 rounded-2xl transition-all duration-300"></div>

    <div className="p-4 flex flex-col items-center h-full justify-center relative z-10">
      <div className="w-20 h-20 mb-3 flex items-center justify-center animate-pulse">
        <span className="text-4xl">🔥</span>
      </div>
      <h3 className="text-xl font-bold text-center px-2 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
        Desafio Insano
      </h3>
      <p className="text-sm text-red-600 mt-2 text-center">
        50 questões em 1 hora!<br/>
      </p>
    </div>
  </div>
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="relative group bg-gradient-to-br from-blue-50 to-white text-blue-900 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer h-48 border-2 border-blue-100 hover:border-blue-200"
              onClick={() => navigate(`/modulos/categorias/${categoria.id}`)}
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Borda animada */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded-2xl transition-all duration-300"></div>

              <div className="p-4 flex flex-col items-center h-full justify-center relative z-10">
                <img
                  src={Logo}
                  alt='logo aeronauta'
                  className="w-20 h-20 mb-3 object-contain transform group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-xl font-bold text-center px-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {categoria.nome}
                </h3>
                
                {/* Efeito de fundo decorativo */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-50/50 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Simulados;