import { useNavigate } from 'react-router-dom';
import {  Trophy, Award, UserCircle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';

interface Usuario {
  id: number;
  nome: string;
  fotoUrl: string;
  aprovations: number[];
  escola: {
    id: number;
    nome: string;
    fotoUrl: string | null;
  } | null;
  createdAt: string;
}

interface EscolaRanking {
  nome: string;
  aprovacoes: number;
  id: number;
  fotoUrl: string | null;
}

const Home = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://portalaeronauta.com/auth/usuarios/');
        if (!response.ok) throw new Error('Erro ao carregar dados');
        const data: Usuario[] = await response.json();
        setUsuarios(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchData();
  }, []);

  const alunosRanking = useMemo(() => {
    return usuarios
      .sort((a, b) => (b.aprovations?.length || 0) - (a.aprovations?.length || 0))
      .slice(0, 10);
  }, [usuarios]);

  const escolasRanking = useMemo(() => {
    const escolasMap = new Map<number, EscolaRanking>();

    usuarios.forEach(usuario => {
      if (usuario.escola) {
        const aprovacoes = usuario.aprovations?.length || 0;
        const escola = escolasMap.get(usuario.escola.id);

        if (escola) {
          escola.aprovacoes += aprovacoes;
        } else {
          escolasMap.set(usuario.escola.id, {
            id: usuario.escola.id,
            nome: usuario.escola.nome,
            aprovacoes,
            fotoUrl: usuario.escola.fotoUrl || null,
          });
        }
      }
    });

    return Array.from(escolasMap.values())
      .sort((a, b) => b.aprovacoes - a.aprovacoes)
      .slice(0, 10);
  }, [usuarios]);

  const token = localStorage.getItem('token');

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white flex items-center justify-center">
        <p className="text-red-300">Erro: {error}</p>
      </div>
    );
  }

  const renderCard = (
    nome: string,
    fotoUrl: string | null,
    info: string,
    aprovacoes: number,
    index: number
  ) => (
    <div
      key={index}
      className={`bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center transition-all duration-300 w-50 ${
        index === 0 ? 'border-4 border-yellow-400' : 'hover:border-blue-300 border-2 border-transparent'
      }`}
    >
      {fotoUrl ? (
        <img
          src={fotoUrl}
          alt={nome}
          className="w-60 h-55 rounded-full object-cover mb-2 border-2 border-blue-600"
        />
      ) : (
        <UserCircle className="w-20 h-20 text-blue-400 mb-2" />
      )}
      <span className="font-semibold text-blue-900 truncate">{nome}</span>
      <span className="text-xs text-gray-500">{aprovacoes} {aprovacoes == 1 ? 'aprovação' : 'aprovações'}</span>
        <span className="text-xs text-gray-500">{info}</span>
      <span className="mt-1 text-xs font-medium text-gray-500">#{index + 1}</span>

    </div>
  );

  return (
    <>
      <Header />
      <div className="pt-20">
        <BannerCarousel />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
        <section className="text-center py-16 px-6">
          <h2 className="text-4xl font-extrabold mb-4 mt-8">
            O caminho para sua aprovação começa aqui!
          </h2>
          <p className="text-lg mb-6 text-blue-100 max-w-2xl mx-auto">
            Veja os destaques, acompanhe o ranking e prepare-se com os melhores simulados do Brasil.
          </p>
          {!token && (
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Fazer Login
            </button>
          )}
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">

          {/* Alunos Ranking */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <Trophy className="text-yellow-400 w-8 h-8" />
              Top 10 Alunos
            </h3>
            {loading ? (
              <div className="flex gap-4 flex-wrap justify-center">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-40 h-48 bg-blue-300/20 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-center">
               {alunosRanking.map((aluno, index) =>
                renderCard(
                  aluno.nome,
                  aluno.fotoUrl,
                  aluno.escola?.nome || 'Sem escola',
                  aluno.aprovations?.length || 0,
                  index
                )
              )}


              </div>
            )}
          </div>

          {/* Escolas Ranking */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <Award className="text-yellow-400 w-8 h-8" />
              Top 10 Escolas
            </h3>
            {loading ? (
              <div className="flex gap-4 flex-wrap justify-center">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-40 h-48 bg-blue-300/20 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-center">
              {escolasRanking.map((escola, index) =>
                  renderCard(
                    escola.nome,
                    escola.fotoUrl,
                    escola.nome, // ou algum outro info (ex: 'Top Escola')
                    escola.aprovacoes,
                    index
                  )
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
