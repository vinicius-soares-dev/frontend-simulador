import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const TelaGerenciarQuestoes = () => {
  const [filter, setFilter] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [questoes, setQuestoes] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<any | null>(null);
  const [cursoSelecionado, setCursoSelecionado] = useState<any | null>(null);
  const [loadingCurso, setLoadingCurso] = useState(false);
  const [loadingCategoria, setLoadingCategoria] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('https://portalaeronauta.com/modulos/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    fetchCategorias();
  }, []);


  const handleCategoriaClick = async (categoria: any) => {
    if (loadingCategoria) return;
    setLoadingCategoria(true);
    try {
      const response = await axios.get(`https://portalaeronauta.com/modulos/categorias/${categoria.id}`);
      setCursos(response.data.cursos);
      setCategoriaSelecionada(categoria);
      setCursoSelecionado(null);
    } catch (error) {
      console.error('Erro ao buscar módulos:', error);
    } finally {
      setLoadingCategoria(false);
    }
  };

  const handleCursoClick = async (curso: any) => {
    if (loadingCurso) return;
    setLoadingCurso(true);
    try {
      const response = await axios.get(`https://portalaeronauta.com/questoes/${curso.id}`);
      setQuestoes(response.data);
      setCursoSelecionado(curso);
      setModalVisible(true);
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
    }  finally {
    setLoadingCurso(false);
  }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCursoSelecionado(null);
  };

  const handleExcluirCategoria = async (categoria: any) => {
    if (!window.confirm(`Deseja realmente excluir a categoria "${categoria.nome}"?`)) return;
    try {
      await axios.delete(`https://portalaeronauta.com/modulos/categorias/${categoria.id}`);
  
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id));
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria. Tente novamente.');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-6 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-2xl text-blue-900 mt-12">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">🔧 Gerenciar Questões</h1>

          {/* Filtro */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-full">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-blue-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Buscar por nome"
              />
              <FaSearch className="absolute right-3 top-3 text-blue-500" size={20} />
            </div>
          </div>

          {/* Lista de Categorias */}
          {!categoriaSelecionada ? (
            <>
              <h2 className="text-2xl font-semibold text-blue-700 mb-2">Cursos</h2>
              <div className="space-y-4 mb-6">
                {categorias
                  .filter((categoria) => categoria.nome.toLowerCase().includes(filter.toLowerCase()))
                  .map((categoria) => (
                  <div
                    key={categoria.id}
                    className={`bg-blue-50 p-4 rounded-lg shadow-md flex justify-between items-center hover:bg-blue-100 ${
                      loadingCategoria ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <span
                      className="text-lg font-semibold text-gray-800 cursor-pointer"
                      onClick={() => handleCategoriaClick(categoria)}
                    >
                      {categoria.nome}
                      {loadingCategoria && categoriaSelecionada?.id === categoria.id && ' (carregando...)'}
                    </span>
                    <button
                      onClick={() => handleExcluirCategoria(categoria)}
                      className="text-red-600 hover:text-red-800 font-semibold bg-red-100 px-3 py-1 rounded"
                    >
                      Excluir
                    </button>
                  </div>

                  ))}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => { setCategoriaSelecionada(null); setCursos([]); }}
                className="mb-4 text-sm text-blue-600 underline"
              >
                ← Voltar para cursos
              </button>

              <h2 className="text-2xl font-semibold text-blue-700 mb-2">
                Módulos do curso "{categoriaSelecionada.nome}"
              </h2>
              <div className="space-y-4 mb-6">
                {cursos
                  .filter((curso) => curso.nome.toLowerCase().includes(filter.toLowerCase()))
                  .map((curso) => (
                    <div
                      key={curso.id}
                       className={`bg-blue-50 p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-100 ${
                          loadingCurso ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      onClick={() => handleCursoClick(curso)}
                    >
                      <h3 className="text-lg font-semibold text-gray-800">{curso.nome}   {loadingCurso && cursoSelecionado?.id === curso.id && ' (carregando...)'}</h3>
                    </div>
                  ))}
                 
              </div>
               <span onClick={() => navigate('/admin/cursos/editor')}>Deseja excluir algum módulo? clique aqui</span>
            </>
          )}

          {/* Modal de Questões */}
          {modalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-3xl h-auto max-h-[90vh] overflow-y-auto">
                <button
                  onClick={handleModalClose}
                  className="mb-4 text-sm text-blue-600 underline"
                >
                  ← Voltar para módulos
                </button>
                <h2 className="text-2xl font-bold mb-4 text-blue-800">
                  Questões do módulo: {cursoSelecionado?.nome}
                </h2>

                {questoes.length === 0 ? (
                  <div className="text-center text-lg text-gray-500">Nenhuma questão encontrada.</div>
                ) : (
                  <div className="space-y-4">
                    {questoes.map((questao) => {
                      const alternativas = [
                        questao.alternativaA,
                        questao.alternativaB,
                        questao.alternativaC,
                        questao.alternativaD,
                      ];
                      return (
                        <div key={questao.id} className="mb-6 p-4 border-b border-gray-300">
                          <div className="text-xl font-semibold text-blue-700 mb-2">
                            {questao.pergunta}
                          </div>
                          <div className="space-y-2 mb-4">
                            {alternativas.map((alt, idx) => alt && (
                              <div key={idx} className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                                {String.fromCharCode(65 + idx)}. {alt}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4">
                            <div className="text-lg font-semibold text-blue-600">Resposta Correta:</div>
                            <div className="p-2 bg-green-100 text-green-800 rounded-lg mt-2">
                              {questao[`alternativa${questao.resposta}`]}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {cursoSelecionado && (
                  <button
                    onClick={async () => {
                      if (window.confirm(`Deseja realmente deletar TODAS as questões do curso "${cursoSelecionado.nome}"?`)) {
                        try {
                          await axios.delete(`https://portalaeronauta.com/questoes/curso/${cursoSelecionado.id}`);
                          setQuestoes([]); 
                          alert('Questões deletadas com sucesso!');
                        } catch (error) {
                          console.error('Erro ao deletar questões:', error);
                          alert('Erro ao deletar questões. Tente novamente.');
                        }
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded mb-4"
                  >
                    🗑️ Deletar todas as questões do curso
                  </button>
                )}


                <button
                  onClick={handleModalClose}
                  className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TelaGerenciarQuestoes;
