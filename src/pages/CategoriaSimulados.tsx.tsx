// CategoriaSimulados.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Aviacao from "../assets/img/aviacao.jpg";
import Header from '../components/Header';

interface Curso {
  id: number;
  nome: string;
  categoriaId: number;
  createdAt: string;
  updatedAt: string;
  questoes: Array<{
    id: number;
    codigo: string;
    pergunta: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
    resposta: string;
    cursoId: number;
    createdAt: string;
  }>;
}

interface CategoriaResponse {
  id: number;
  nome: string;
  cursos: Curso[];
}


const CategoriaSimulados = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState<CategoriaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [temAssinatura, setTemAssinatura] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole'); 
  setRole(userRole || '');

  if (userId) {
    fetch(`https://portalaeronauta.com/assinaturas/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setTemAssinatura(data.possuiAssinatura);
      })
      .catch((err) => {
        console.error('Erro ao verificar assinatura:', err);
      });
  }
}, []);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch(`https://portalaeronauta.com/modulos/categorias/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CategoriaResponse = await response.json();
      
        if (data && data.cursos) {
          setCategoria(data);
        } else {
          throw new Error('Estrutura de dados inválida');
        }
        
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        setError('Falha ao carregar cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, [id]);

const handleIniciarCurso = (curso: Curso) => {
  navigate(`/curso/${curso.id}`, {
    state: {
      curso: {
        id: curso.id,
        nome: curso.nome,
        questoes: curso.questoes,
        imagem: Aviacao // Usando a imagem importada
      }
    }
  });
};

  if (loading) {
    return <div className="text-white text-center p-6">Carregando cursos...</div>;
  }

  if (error) {
    return <div className="text-red-300 text-center p-6">{error}</div>;
  }

  return (
    <>
      <Header />
    
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white p-6">
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-bold">✈️ Cursos Disponíveis - {categoria?.nome}</h2>
        </header>

        <div className="mb-12 bg-blue-800/30 p-6 rounded-xl border-2 border-blue-400 mx-auto max-w-4xl">
    <h3 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Como Funciona o Simulado
    </h3>
    
    <div className="space-y-4 text-blue-100">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <strong className="font-semibold">20 Questões Selecionadas:</strong>
          <p className="mt-1">O sistema escolherá aleatoriamente 20 questões do banco de questões do curso</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <strong className="font-semibold">Tempo Limite de 30 minutos:</strong>
          <p className="mt-1">Você terá 30 minutos para completar todas as questões</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <strong className="font-semibold">Aprovação com 70% de Acertos:</strong>
          <p className="mt-1">
            Você precisará acertar pelo menos <span className="text-green-300">14 das 20 questões</span> para ser aprovado<br />
            <span className="text-sm opacity-75">(Taxa mínima exigida pela ANAC para certificação)</span>
          </p>
        </div>
      </div>
    </div>
  </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {categoria?.cursos && categoria.cursos.length > 0 ? (
            categoria.cursos.map((curso) => (
              <div
                key={curso.id}
                className="relative group bg-white text-blue-900 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.03]"
              >
                {/* Imagem padrão temporária - substitua conforme necessidade */}
                <img
                  src={Aviacao}
                  alt={curso.nome}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-2xl font-semibold mb-2">{curso.nome}</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                      {curso.questoes.length} questões
                    </span>
                    <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                      Criado em: {new Date(curso.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {temAssinatura || role === 'admin' ? (
                    <button
                      onClick={() => handleIniciarCurso(curso)}
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                    >
                      Iniciar Prova
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/upgrade')}
                      className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded"
                    >
                      Seja Premium para fazer essa prova
                    </button>
                  )}
  
                </div>
              </div>
            ))
          ) : (
            <div className="text-white text-center col-span-full">
              Nenhum curso disponível nesta categoria
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriaSimulados;