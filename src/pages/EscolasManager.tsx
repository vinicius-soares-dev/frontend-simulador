import { BuildingLibraryIcon } from '@heroicons/react/16/solid';
import { useState, useEffect } from 'react';
import Header from '../components/Header';

interface Escola {
  id: number;
  nome: string;
  fotoUrl?: string;
}

const EscolasManager = () => {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [filtro, setFiltro] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const [novaFoto, setNovaFoto] = useState<File | null>(null);
  const [carregando, setCarregando] = useState(false);

  const API_URL = 'https://portalaeronauta.com/escolas';

  const buscarEscolas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEscolas(data);
    } catch (err) {
      console.error('Erro ao buscar escolas:', err);
    }
  };

  useEffect(() => {
    buscarEscolas();
  }, []);

  const handleCriarEscola = async () => {
    if (!novoNome || !novaFoto) {
      alert('Informe o nome e a foto da escola.');
      return;
    }

    try {
      setCarregando(true);

      const resCriar = await fetch(`${API_URL}/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoNome }),
      });

      if (!resCriar.ok) throw new Error('Erro ao criar escola');

      const escolaCriada = await resCriar.json();
      const escolaId = escolaCriada.id;

      const formData = new FormData();
      formData.append('foto', novaFoto);

      const resFoto = await fetch(`${API_URL}/upload-foto/${escolaId}`, {
        method: 'POST',
        body: formData,
      });

      if (!resFoto.ok) throw new Error('Erro ao enviar foto da escola');

      await buscarEscolas();
      setNovoNome('');
      setNovaFoto(null);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  const handleEditarEscola = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}/nome`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoNome }),
      });
      await buscarEscolas();
      setEditandoId(null);
      setNovoNome('');
    } catch (err) {
      console.error('Erro ao editar escola:', err);
    }
  };

  const handleExcluirEscola = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta escola?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      await buscarEscolas();
    } catch (err) {
      console.error('Erro ao excluir escola:', err);
    }
  };

  const escolasFiltradas = escolas.filter((escola) =>
    escola.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <>
      <Header />

      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-12">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">Gerenciar Escolas</h1>

        <input
          type="text"
          placeholder="Filtrar por nome..."
          className="border border-blue-300 rounded-md p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
          <input
            type="text"
            placeholder="Nome da nova escola"
            className="border border-blue-300 rounded-md p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="text-blue-700"
            onChange={(e) => {
              if (e.target.files) setNovaFoto(e.target.files[0]);
            }}
          />
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleCriarEscola}
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Criar'}
          </button>
        </div>

        <ul>
          {escolasFiltradas.length === 0 && (
            <p className="text-center text-gray-500">Nenhuma escola encontrada.</p>
          )}

          {escolasFiltradas.map((escola) => (
            <li
              key={escola.id}
              className="flex items-center gap-4 mb-5 border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              {escola.fotoUrl && escola.fotoUrl.trim() !== '' ? (
                <img
                  src={escola.fotoUrl}
                  alt={`Foto da escola ${escola.nome}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full border-2 border-blue-600">
                  <BuildingLibraryIcon className="w-8 h-8 text-blue-600" />
                </div>
              )}

              {editandoId === escola.id ? (
                <>
                  <input
                    className="border border-blue-300 rounded-md p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                    onClick={() => handleEditarEscola(escola.id)}
                  >
                    Salvar
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition"
                    onClick={() => setEditandoId(null)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-blue-900 font-semibold text-lg">{escola.nome}</span>
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md transition"
                    onClick={() => {
                      setEditandoId(escola.id);
                      setNovoNome(escola.nome);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                    onClick={() => handleExcluirEscola(escola.id)}
                  >
                    Excluir
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default EscolasManager;
