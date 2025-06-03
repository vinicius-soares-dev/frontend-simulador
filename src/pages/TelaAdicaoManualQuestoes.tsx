import  { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

interface Questao {
  codigo: string;
  pergunta: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  resposta: string;
}

interface Curso {
  id: number;
  nome: string;
  categoriaId: number;
}

interface Modulo {
  id: number;
  nome: string;
  categoriaId: number;  // Alterado de cursoId para categoriaId
}

interface Categoria {
  id: number;
  nome: string;
}

const TelaAdicaoManualQuestoes = () => {
  const [novaQuestao, setNovaQuestao] = useState<Partial<Questao>>({
    alternativas: { A: '', B: '', C: '', D: '' }
  });
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);

  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [moduloSelecionado, setModuloSelecionado] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const fetchDadosIniciais = async () => {
      try {
        setCarregando(true);
        const [resCategorias, resCursos] = await Promise.all([
          fetch('https://portalaeronauta.com/modulos/categorias'),
          fetch('https://portalaeronauta.com/cursos/listar-cursos')
        ]);
        
        const categorias = await resCategorias.json();
        const cursos = await resCursos.json();
        
        setCategorias(categorias);
        setCursos(cursos);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchDadosIniciais();
  }, []);

useEffect(() => {
  const fetchModulos = async () => {
    if (categoriaSelecionada) {  // Alterado de cursoSelecionado para categoriaSelecionada
      try {
        const response = await fetch(`https://portalaeronauta.com/modulos/categorias/${categoriaSelecionada}`);
        const categoriaComCursos = await response.json();
        setModulos(categoriaComCursos.cursos);  // Extrai a lista de cursos da resposta
      } catch (error) {
        console.error('Erro ao buscar módulos:', error);
      }
    }
  };

  fetchModulos();
}, [categoriaSelecionada]); 

  const criarNovaCategoria = async () => {
    const nome = prompt('Digite o nome da nova categoria:');
    if (!nome) return;

    try {
      const response = await fetch('https://portalaeronauta.com/modulos/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome })
      });

      if (!response.ok) throw new Error('Erro ao criar categoria');
      
      const novaCategoria = await response.json();
      setCategorias([...categorias, novaCategoria]);
      setCategoriaSelecionada(novaCategoria.id);
      setFeedback({ type: 'success', message: 'Categoria criada com sucesso!' });
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Erro desconhecido' });
    }
  };

const criarNovoModulo = async () => {  // Renomeado de criarNovoCurso para criarNovoModulo
  if (!categoriaSelecionada) {
    setFeedback({ type: 'error', message: 'Selecione um curso primeiro!' });
    return;
  }

  const nome = prompt('Digite o nome do novo módulo:');
  if (!nome) return;

  try {
    const response = await fetch('https://portalaeronauta.com/cursos/criar-curso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nome, 
        categoriaId: categoriaSelecionada  // Mantém o relacionamento correto
      })
    });

    if (!response.ok) throw new Error('Erro ao criar módulo');
    
    const novoModulo = await response.json();
    setModulos([...modulos, novoModulo]);
    setModuloSelecionado(novoModulo.id);
    setFeedback({ type: 'success', message: 'Módulo criado com sucesso!' });
  } catch (error) {
    setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Erro desconhecido' });
  }
};

 


const handleInputChange = (field: string, value: string) => {
  if (field.startsWith('alternativa')) {
    const letra = field.split('-')[1] as 'A' | 'B' | 'C' | 'D';
    setNovaQuestao(prev => ({
      ...prev,
      alternativas: {
        A: prev.alternativas?.A || '',
        B: prev.alternativas?.B || '',
        C: prev.alternativas?.C || '',
        D: prev.alternativas?.D || '',
        [letra]: value
      }
    }));
  } else {
    setNovaQuestao(prev => ({ ...prev, [field]: value }));
  }
};

  const validarQuestao = (): boolean => {
    if (!novaQuestao.codigo?.trim()) {
      setFeedback({ type: 'error', message: 'Código da questão é obrigatório' });
      return false;
    }
    if (!novaQuestao.pergunta?.trim()) {
      setFeedback({ type: 'error', message: 'Texto da pergunta é obrigatório' });
      return false;
    }
    if (!novaQuestao.alternativas?.A?.trim() || 
        !novaQuestao.alternativas?.B?.trim() || 
        !novaQuestao.alternativas?.C?.trim() || 
        !novaQuestao.alternativas?.D?.trim()) {
      setFeedback({ type: 'error', message: 'Todas as alternativas devem ser preenchidas' });
      return false;
    }
    if (!novaQuestao.resposta?.match(/^[A-D]$/i)) {
      setFeedback({ type: 'error', message: 'Resposta deve ser A, B, C ou D' });
      return false;
    }
    return true;
  };

  const handleAdicionarQuestao = () => {
    if (!validarQuestao()) return;

    const questaoCompleta: Questao = {
      codigo: novaQuestao.codigo!,
      pergunta: novaQuestao.pergunta!,
      alternativas: novaQuestao.alternativas!,
      resposta: novaQuestao.resposta!.toUpperCase()
    };

    if (editandoId !== null) {
      // Edição existente
      const novasQuestoes = [...questoes];
      novasQuestoes[editandoId] = questaoCompleta;
      setQuestoes(novasQuestoes);
      setEditandoId(null);
    } else {
      // Nova questão
      setQuestoes(prev => [...prev, questaoCompleta]);
    }

    setNovaQuestao({});
    setFeedback({ type: 'success', message: 'Questão salva com sucesso!' });
  };

  const handleEditarQuestao = (index: number) => {
    setNovaQuestao(questoes[index]);
    setEditandoId(index);
  };

  const handleExcluirQuestao = (index: number) => {
    setQuestoes(prev => prev.filter((_, i) => i !== index));
    setFeedback({ type: 'success', message: 'Questão removida com sucesso!' });
  };

const handleEnviarTodas = async () => {
  if (!moduloSelecionado) { // Lembre-se: moduloSelecionado = cursoId no backend
    setFeedback({ type: 'error', message: 'Selecione um módulo antes de enviar' });
    return;
  }

  if (questoes.length === 0) {
    setFeedback({ type: 'error', message: 'Adicione pelo menos uma questão antes de enviar' });
    return;
  }

  try {
    // Ajustar a estrutura das questões para o formato esperado pelo backend
    const questoesParaEnviar = questoes.map(q => ({
      codigo: q.codigo,
      pergunta: q.pergunta,
      alternativaA: q.alternativas.A,
      alternativaB: q.alternativas.B,
      alternativaC: q.alternativas.C,
      alternativaD: q.alternativas.D,
      resposta: q.resposta.toUpperCase(),
      cursoId: moduloSelecionado // Aqui usamos o ID do módulo (que é o cursoId no backend)
    }));

    const response = await fetch('https://portalaeronauta.com/questoes/upload-questoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questoes: questoesParaEnviar,
        cursoId: moduloSelecionado // Adicionar cursoId aqui conforme esperado pelo backend
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao enviar questões');
    }

    setFeedback({ type: 'success', message: 'Questões enviadas com sucesso!' });
    setQuestoes([]);
  } catch (error) {
    setFeedback({ 
      type: 'error', 
      message: error instanceof Error ? error.message : 'Erro desconhecido ao enviar questões'
    });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          ✍️ Adição Manual de Questões
        </h1>

        {/* Seleção Hierárquica */}
       <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Curso</label>
            <div className="flex gap-2">
              <select
                className="w-full p-2 border rounded-lg"
                value={categoriaSelecionada || ''}
                onChange={(e) => setCategoriaSelecionada(Number(e.target.value))}
              >
                <option value="" disabled>Selecione um curso</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                ))}
              </select>
              <button
                onClick={criarNovaCategoria}
                className="px-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Módulo</label>
            <div className="flex gap-2">
              <select
                className="w-full p-2 border rounded-lg"
                value={moduloSelecionado || ''}
                onChange={(e) => setModuloSelecionado(Number(e.target.value))}
                disabled={!categoriaSelecionada}
              >
                <option value="" disabled>Selecione um módulo</option>
                {modulos.map(modulo => (
                  <option key={modulo.id} value={modulo.id}>{modulo.nome}</option>
                ))}
              </select>
              <button
                onClick={criarNovoModulo}  // Alterado de criarNovoCurso para criarNovoModulo
                className="px-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                disabled={!categoriaSelecionada}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Formulário de Adição */}
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editandoId !== null ? 'Editar Questão' : 'Nova Questão'}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label>Código da Questão</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={novaQuestao.codigo || ''}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label>Pergunta</label>
              <textarea
                className="w-full p-2 border rounded h-24"
                value={novaQuestao.pergunta || ''}
                onChange={(e) => handleInputChange('pergunta', e.target.value)}
              />
            </div>

            {['A', 'B', 'C', 'D'].map((letra) => (
              <div key={letra}>
                <label>Alternativa {letra}</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={novaQuestao.alternativas?.[letra as 'A'] || ''}
                  onChange={(e) => handleInputChange(`alternativa-${letra}`, e.target.value)}
                />
              </div>
            ))}

            <div className="col-span-2">
              <label>Resposta Correta</label>
              <select
                className="w-full p-2 border rounded"
                value={novaQuestao.resposta || ''}
                onChange={(e) => handleInputChange('resposta', e.target.value)}
              >
                <option value="">Selecione a resposta correta</option>
                {['A', 'B', 'C', 'D'].map((letra) => (
                  <option key={letra} value={letra}>Alternativa {letra}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAdicionarQuestao}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <FaPlus /> {editandoId !== null ? 'Salvar Edição' : 'Adicionar Questão'}
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {feedback.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Lista de Questões Adicionadas */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Questões Adicionadas ({questoes.length})</h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {questoes.map((questao, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 shadow-sm relative group">
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditarQuestao(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleExcluirQuestao(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">{questao.codigo}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Resposta: {questao.resposta}
                  </span>
                </div>

                <p className="mb-2">{questao.pergunta}</p>

                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(questao.alternativas).map(([letra, texto]) => (
                    <div key={letra} className="flex items-center gap-2">
                      <span className="font-medium">{letra}:</span>
                      <span className="text-gray-600">{texto}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão de Envio Final */}
        <button
          onClick={handleEnviarTodas}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
          disabled={questoes.length === 0}
        >
          <FaCheckCircle /> Enviar Todas as Questões
        </button>
      </div>
    </div>
  );
};

export default TelaAdicaoManualQuestoes;