import { useState, useEffect } from 'react';
import Header from '../components/Header';

interface Escola {
  id: number;
  nome: string;
  aprovacoes: number;
  fotoUrl?: string;
}

const SchoolRanking = () => {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchEscolas = async () => {
      try {
        setCarregando(true);
        
        // Primeiro busca todas as escolas
        const escolasResponse = await fetch('https://portalaeronauta.com/escolas');
        if (!escolasResponse.ok) throw new Error('Erro ao carregar escolas');
        const escolasLista = await escolasResponse.json();

        // Para cada escola, busca o total de aprovações
        const escolasComAprovacoes = await Promise.all(
          escolasLista.map(async (escola: any) => {
            const response = await fetch(`https://portalaeronauta.com/escolas/${escola.id}/total-aprovations`);
            if (!response.ok) throw new Error(`Erro ao carregar aprovações para ${escola.nome}`);
            const data = await response.json();
            return {
              ...escola,
              aprovacoes: data.totalAprovations || 0
            };
          })
        );

        // Ordena por aprovações
        const escolasOrdenadas = escolasComAprovacoes.sort((a, b) => b.aprovacoes - a.aprovacoes);
        setEscolas(escolasOrdenadas);
        setCarregando(false);

      } catch (error) {
        setErro(error instanceof Error ? error.message : 'Erro desconhecido');
        setCarregando(false);
      }
    };

    fetchEscolas();
  }, []);

  const maxAprovacoes = Math.max(...escolas.map(e => e.aprovacoes)) || 1;

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 p-6 flex justify-center items-center">
        <div className="text-white text-xl">Carregando ranking...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 p-6 flex justify-center items-center">
        <div className="text-red-300 text-xl">Erro: {erro}</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 p-6 flex justify-center items-center">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-800 mb-10">
            🏫 Ranking das Escolas
          </h2>

          {/* Lista de escolas */}
          <div className="space-y-4">
            {escolas.map((escola, index) => (
              <div
                key={escola.id}
                className="bg-blue-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl font-bold">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    {escola.fotoUrl && (
                      <img
                        src={escola.fotoUrl}
                        alt={escola.nome}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-blue-900">{escola.nome}</p>
                      <p className="text-sm text-blue-600">{escola.aprovacoes} aprovações</p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3 mt-4 md:mt-0">
                  <div className="w-full h-3 bg-blue-200 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-700"
                      style={{ width: `${(escola.aprovacoes / maxAprovacoes) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolRanking;