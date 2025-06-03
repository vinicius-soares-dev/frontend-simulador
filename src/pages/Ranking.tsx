import { useState, useEffect } from 'react';
import Header from '../components/Header';

interface Escola {
  id: number;
  nome: string;
  fotoUrl: string | null;
}

interface Usuario {
  id: number;
  nome: string;
  fotoUrl: string;
  aprovations: number[];
  escola: Escola | null;
  createdAt: string;
}

interface RankingAluno {
  nome: string;
  pontos: number;
  posicao: number;
  fotoUrl: string;
  escola: Escola | null;
}


const ITENS_POR_PAGINA = 10;



const TelaRanking = () => {
  const [rankingData, setRankingData] = useState<RankingAluno[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('https://portalaeronauta.com/auth/usuarios/');
        if (!response.ok) throw new Error('Erro ao carregar dados');
        
        const usuarios: Usuario[] = await response.json();
        
        const processarRanking = (usuarios: Usuario[]) => {
          return usuarios
            .map(usuario => ({
              ...usuario,
              pontos: usuario.aprovations?.length || 0,
            }))
            .sort((a, b) => b.pontos - a.pontos)
            .map((aluno, index) => ({
              nome: aluno.nome,
              pontos: aluno.pontos,
              posicao: index + 1,
              fotoUrl: aluno.fotoUrl,
              escola: aluno.escola
            }));
        };

        setRankingData(processarRanking(usuarios));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setLoading(false);
      }
    };

    fetchUsuarios();
  });

  const indiceInicial = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const dadosPagina = rankingData.slice(1, indiceInicial + ITENS_POR_PAGINA + 1);
  const totalPaginas = Math.ceil((rankingData.length - 1) / ITENS_POR_PAGINA);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white flex items-center justify-center">
        <p>Carregando ranking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white flex items-center justify-center">
        <p className="text-red-300">Erro: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white">
        <div className="max-w-4xl mx-auto" style={{ marginTop: "6rem"}}>
          <h1 className="text-3xl font-bold mb-6 text-center">🏆 Ranking de Alunos</h1>

          {/* Primeiro colocado fixo */}
          {rankingData.length > 0 && (
            <div className="mb-8 bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 rounded-xl shadow-xl">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={rankingData[0].fotoUrl} 
                      alt={rankingData[0].nome}
                      className="w-16 h-16 rounded-full border-4 border-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'fallback-image-url';
                        (e.target as HTMLImageElement).className = 'w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold';
                      }}
                    />
                    <span className="absolute -top-2 -right-2 text-3xl">🥇</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{rankingData[0].nome}</p>
                    {rankingData[0].escola && (
                      <p className="text-sm opacity-75">{rankingData[0].escola.nome}</p>
                    )}
                    <p className="text-sm">#1 Ranking</p>
                  </div>
                </div>
                <p className="text-3xl font-bold">{rankingData[0].pontos} pts</p>
              </div>
            </div>
          )}

          {/* Lista de ranking paginada */}
          <div className="space-y-4">
            {dadosPagina.map((aluno) => (
              <div
                key={aluno.nome}
                className="flex items-center justify-between bg-white text-blue-900 p-4 rounded-xl shadow-lg transition transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={aluno.fotoUrl}
                      alt={aluno.nome}
                      className="w-12 h-12 rounded-full border-2 border-blue-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'fallback-image-url';
                        (e.target as HTMLImageElement).className = 'w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold';
                      }}
                    />
                    {aluno.posicao <= 3 && (
                      <span className="absolute -top-2 -right-2 text-xl">
                        {aluno.posicao === 1 ? '🥇' : aluno.posicao === 2 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{aluno.nome}</p>
                    {aluno.escola && (
                      <p className="text-xs text-gray-500">{aluno.escola.nome}</p>
                    )}
                    <p className="text-sm text-gray-500">#{aluno.posicao}</p>
                  </div>
                </div>
                <p className="text-xl font-bold">{aluno.pontos} pts</p>
              </div>
            ))}
          </div>

          {/* Controles de paginação */}
          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-50 hover:bg-blue-500"
            >
              Anterior
            </button>
            <span>Página {paginaAtual} de {totalPaginas}</span>
            <button
              onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
              className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-50 hover:bg-blue-500"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TelaRanking;