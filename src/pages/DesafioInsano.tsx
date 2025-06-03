import { useState, useEffect } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

interface Questao {
  id: number;
  codigo: string;
  pergunta: string;
  alternativaA: string;
  alternativaB: string;
  alternativaC: string;
  alternativaD: string;
  resposta: string;
}

interface CursoState {
  curso: {
    id: number;
    nome: string;
    imagem: string;
    questoes: Questao[];
  };
}

const DesafioInsanoExecucao = () => {
  const { state } = useLocation() as { state: CursoState };
  const navigate = useNavigate();
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [tempoRestante, setTempoRestante] = useState(3600); // 1 hora em segundos
  const [provaFinalizada, setProvaFinalizada] = useState(false);
  const [aprovado, setAprovado] = useState(false);

  const userId = localStorage.getItem('userId');
  const [bloqueado, setBloqueado] = useState(false);
  const [acessoPermitido, setAcessoPermitido] = useState(true);
  const [carregando, setCarregando] = useState(true);
  

  // Medidas de segurança
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    
    const style = document.createElement('style');
    style.innerHTML = `@media print { body { display: none !important; } }`;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.head.removeChild(style);
    };
  }, []);

useEffect(() => {
  const verificarAcessoPremium = async () => {
    try {
      const userRole = localStorage.getItem('userRole');
      
      // Se for admin, libera acesso imediatamente
      if (userRole === 'admin') {
        setAcessoPermitido(true);
        setCarregando(false);
        return;
      }

      // Se não for admin, verifica assinatura
      const [statusResponse, userResponse] = await Promise.all([
        fetch(`https://portalaeronauta.com/api/verificar-acesso/${userId}`),
        fetch(`https://portalaeronauta.com/auth/usuarios/${userId}`)
      ]);

      const statusData = await statusResponse.json();
      const userData = await userResponse.json();

      if (statusData.podeParticipar && userData.assinatura?.status === 'active') {
        setAcessoPermitido(true);
      } else {
        setAcessoPermitido(false);
      }

    } catch (error) {
      console.error('Erro na verificação:', error);
      setAcessoPermitido(false);
    } finally {
      setCarregando(false);
    }
  };

  if (userId) verificarAcessoPremium();
}, [userId, navigate]);

  // Bloqueio de saída
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Você perderá seu progresso!';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Controle de visibilidade
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' && !provaFinalizada) {
        setBloqueado(true);
        finalizarProva(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [provaFinalizada]);

useEffect(() => {
  const carregarQuestoesDesafio = async () => {
    try {
      const response = await fetch(`https://portalaeronauta.com/api/questoes`);
      const data = await response.json();
      
      const shuffled = data.sort(() => Math.random() - 0.5);
      setQuestoes(shuffled.slice(0, 50));

    } catch (error) {
      console.error('Erro ao carregar questões:', error);
      navigate('/simulados');
    }
  };

  carregarQuestoesDesafio();
}, [navigate]);

  // Temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 0) {
          finalizarProva(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const finalizarProva = async (bloqueado: boolean) => {
    setProvaFinalizada(true);
    setBloqueado(bloqueado);
    
    try {
      await fetch('https://portalaeronauta.com/desafio-insano/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          cursoId: state.curso.id,
          data: new Date()
        })
      });
    } catch (error) {
      console.error('Erro ao registrar tentativa:', error);
    }
  };

  const handleResposta = (resposta: string) => {
    const novasRespostas = [...respostas];
    novasRespostas[questaoAtual] = resposta;
    setRespostas(novasRespostas);

    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(prev => prev + 1);
    } else {
      finalizarProva(false);
    }
  };

  const calcularResultado = () => {
    const acertos = questoes.reduce((acc, questao, index) => (
      questao.resposta === respostas[index] ? acc + 1 : acc
    ), 0);
    
    return {
      acertos,
      total: questoes.length,
      percentual: (acertos / questoes.length) * 100,
      aprovado: acertos >= 45 // 90%
    };
  };

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

    if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Verificando acesso...</div>
      </div>
    );
  }

  if (!acessoPermitido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white p-6 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-lg border border-white/20">
            <div className="mb-8">
              <span className="text-6xl">🔥</span>
              <h1 className="text-4xl font-bold mt-4">Desafio Insano Bloqueado</h1>
              <p className="text-xl mt-2 text-purple-200">Acesso exclusivo para membros premium</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4 justify-center">
                <span className="text-2xl">🎯</span>
                <p className="text-lg">50 questões desafiantes em 1 hora</p>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <span className="text-2xl">🏆</span>
                <p className="text-lg">Certificado de superação</p>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <span className="text-2xl">💎</span>
                <p className="text-lg">Estatísticas detalhadas</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/upgrade')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105"
            >
              Torne-se Premium Agora!
            </button>

            <p className="mt-6 text-purple-300">
              Já é premium? <button 
                onClick={() => window.location.reload()}
                className="underline hover:text-white transition-colors"
              >
                Recarregar acesso
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (provaFinalizada || tempoRestante === 0) {
    const resultado = calcularResultado();
    setAprovado(resultado.aprovado);

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 text-white p-6 flex items-center justify-center">
        <div className="bg-white text-red-900 rounded-xl p-8 max-w-2xl w-full shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">🔥 Resultado do Desafio Insano 🔥</h2>
            <div className={`p-4 rounded-lg ${resultado.aprovado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="text-xl font-bold">
                {resultado.aprovado ? 'DESAFIO COMPLETO!' : 'DESAFIO FALHADO!'}
              </p>
              <p className="text-4xl font-mono mt-2">{resultado.acertos}/50</p>
              <p className="mt-2">{resultado.percentual.toFixed(1)}% de acertos</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span>Tempo restante:</span>
              <span>{formatarTempo(tempoRestante)}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={bloqueado ? 'text-red-600' : 'text-green-600'}>
                {bloqueado ? 'Bloqueado por saída de tela' : 'Finalizado normalmente'}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/simulados')}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar para Simulados
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 bg-white/10 p-4 rounded-lg">
            <div>
              <h1 className="text-2xl font-bold">DESAFIO INSANO - {state?.curso.nome}</h1>
              <p className="text-sm opacity-80">Questão {questaoAtual + 1} de 50</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-mono bg-white/20 px-6 py-2 rounded-lg">
                {formatarTempo(tempoRestante)}
              </div>
            </div>
          </div>

          <div className="bg-white text-red-900 rounded-xl p-8 shadow-xl">
            <p className="text-xl font-semibold mb-6">
              {questoes[questaoAtual]?.pergunta}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((letra) => (
                <button
                  key={letra}
                  onClick={() => handleResposta(letra)}
                  className={`p-4 text-left rounded-lg transition-colors ${
                    respostas[questaoAtual] === letra
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <span className="font-bold mr-3">{letra}.</span>
                  {questoes[questaoAtual]?.[`alternativa${letra}` as keyof Questao]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-white/10 p-4 rounded-lg">
            <div className="h-2 bg-white/20 rounded-full">
              <div
                className="h-full bg-red-400 rounded-full transition-all"
                style={{ width: `${((questaoAtual + 1) / 50) * 100}%` }}
              />
            </div>
            <p className="text-center mt-2">
              Progresso: {questaoAtual + 1}/50
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesafioInsanoExecucao;