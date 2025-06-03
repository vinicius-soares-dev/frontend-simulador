import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProtecaoTela } from '../hooks/useProtecaoTela';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';




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

interface RespostaAluno {
  numero: number;
  pergunta: string;
  respostaAluno: string;
  respostaCorreta: string;
  resultado: string; // Ex: "Correta" ou "Errada"
}

const SimuladoExecucao = () => {
  const { state } = useLocation() as { state: CursoState };
  const navigate = useNavigate();
  const { cursoId } = useParams();
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [tempoRestante, setTempoRestante] = useState(1800); // 2 horas em segundos
  const [provaFinalizada, setProvaFinalizada] = useState(false);
  const [aprovado, setAprovado] = useState(false);
   const userId = localStorage.getItem('userId');
  const [bloqueado, setBloqueado] = useState(false);


function gerarPDF(respostas: RespostaAluno[]) {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.text('Gabarito - Resultado do Teste', 14, 20);

  // Formata os dados para o corpo da tabela
  const dadosTabela = respostas.map((item, index) => [
    (index + 1).toString(),
    item.pergunta,
    item.respostaAluno,
    item.respostaCorreta,
    item.resultado,
  ]);

  // Cria a tabela
  autoTable(doc, {
    head: [['Nº', 'Pergunta', 'Sua Resposta', 'Resposta Correta', 'Resultado']],
    body: dadosTabela,
    startY: 30,
    styles: { fontSize: 10, cellWidth: 'wrap' },
    columnStyles: {
      1: { cellWidth: 80 }, // Ajuste da coluna "Pergunta"
    },
  });

  // Salva o PDF
  doc.save('gabarito.pdf');
}

  useProtecaoTela();

   useEffect(() => {
    // Desabilitar menu de contexto (botão direito)
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Desabilitar arrastar imagens
    const handleDragStart = (e: DragEvent) => e.preventDefault();
    document.addEventListener('dragstart', handleDragStart);

    // Estilos anti-print
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.head.removeChild(style);
    };
  }, []);

    useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Você perderá seu progresso!';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Verificar se já fez o curso
   const verificarAprovacao = async () => {
      try {
        const response = await fetch(`https://portalaeronauta.com/auth/usuarios/${userId}`);
        const user = await response.json();
        
        if (user.aprovations?.includes(state.curso.id)) {
          alert('Você já completou este curso!');
          navigate('/simulados');
        }
      } catch (error) {
        console.error('Erro ao verificar aprovações:', error);
      }
    };

    if (userId) verificarAprovacao();

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [userId]);


    useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' && !provaFinalizada) {
        setBloqueado(true);
        setProvaFinalizada(true);
        alert('Prova finalizada por saída da tela!');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [provaFinalizada]);

  // 4. Bloquear após finalização
  useEffect(() => {
    if (bloqueado) {
      localStorage.setItem(`bloqueio-${userId}-${cursoId}`, 'true');
    }
  }, [bloqueado, userId, cursoId]);


  useEffect(() => {
    if (!state?.curso) {
      navigate('/modulos/categorias');
      return;
    }

    const selecionarQuestoes = () => {
      const todasQuestoes = state.curso.questoes;
      const shuffled = [...todasQuestoes].sort(() => Math.random() - 0.5);
      setQuestoes(shuffled.slice(0, 20));
    };

    selecionarQuestoes();
  }, [state, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

useEffect(() => {
  const atualizarAprovacoes = async () => {
    if (provaFinalizada && aprovado) {
      try {
        const userId = localStorage.getItem('userId');
        const cursoId = state?.curso.id;
        
        if (!userId || !cursoId) return;

        const response = await fetch(`https://portalaeronauta.com/auth/increment-aprovations/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cursoId })
        });

        if (!response.ok) throw new Error('Falha ao atualizar aprovações');
        
        const data = await response.json();
  
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  if (provaFinalizada) {
    atualizarAprovacoes();
  }
}, [provaFinalizada, aprovado, state?.curso.id]);

  const handleResposta = (resposta: string) => {
    const novasRespostas = [...respostas];
    novasRespostas[questaoAtual] = resposta;
    setRespostas(novasRespostas);

    if (questaoAtual < questoes.length - 1) {
      setTimeout(() => setQuestaoAtual(prev => prev + 1), 500);
    } else {
      setProvaFinalizada(true);
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
      aprovado: (acertos / questoes.length) >= 0.70
    };
  };

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!state?.curso) return null;

  useEffect(() => {
  if (provaFinalizada || tempoRestante === 0) {
    const resultado = calcularResultado();
    setAprovado(resultado.aprovado);
  }
}, [provaFinalizada, tempoRestante, questoes, respostas]); 

  if (provaFinalizada || tempoRestante === 0) {
  const resultado = calcularResultado();
  const estaAprovado = resultado.aprovado;

  const respostasAluno: RespostaAluno[] = questoes.map((questao, index) => {
  const respostaAluno = respostas[index] || 'Não respondida';
  const respostaCorreta = questao.resposta;
  const resultado = respostaAluno === respostaCorreta ? 'Correta' : 'Errada';

  return {
    numero: index + 1,
    pergunta: questao.pergunta,
    respostaAluno,
    respostaCorreta,
    resultado,
  };
});



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 flex items-center justify-center">
      <div className="bg-white text-blue-900 rounded-xl p-8 max-w-2xl w-full shadow-xl">
        <div className={`text-center p-6 rounded-lg mb-6 ${estaAprovado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="text-xl font-bold">
            {estaAprovado ? '🎉 Parabéns, você foi aprovado!' : '😞 Infelizmente não foi desta vez'}
          </p>
          <p className="mt-2">
            {estaAprovado 
              ? 'Você atingiu os requisitos mínimos para certificação!'
              : 'Você precisa acertar pelo menos 70% das perguntas para aprovação'}
          </p>
          
          {/* Adicione esta mensagem condicional */}
          {estaAprovado && (
            <p className="mt-4 text-sm text-blue-600">
              +1 aprovação adicionada ao seu histórico
            </p>
          )}
        </div>

        {/* Gabarito com correção */}
<div className="mt-6">
  <h2 className="text-lg font-semibold mb-4">Gabarito</h2>
  <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
    {questoes.map((questao, index) => {
      const respostaUsuario = respostas[index];
      const correta = respostaUsuario === questao.resposta;
      return (
        <li key={questao.id} className={`p-4 rounded-lg border ${correta ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <p className="font-medium text-blue-800">{index + 1}. {questao.pergunta}</p>
          <p className="text-sm mt-1"><strong>Sua resposta:</strong> {respostaUsuario}</p>
          {!correta && (
            <p className="text-sm text-red-700"><strong>Correta:</strong> {questao.resposta}</p>
          )}
        </li>
      );
    })}
  </ul>
<button onClick={() => gerarPDF(respostasAluno)}
  className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
>
  Baixar Gabarito em PDF
</button>

</div>


          <button
            onClick={() => navigate('/simulados')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Voltar para Simulados
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white/10 p-4 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold">{state.curso.nome}</h1>
            <p className="text-sm opacity-80">Questão {questaoAtual + 1} de {questoes.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <img 
              src={state.curso.imagem} 
              alt="Curso" 
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="text-3xl font-mono bg-white/20 px-6 py-2 rounded-lg">
              {formatarTempo(tempoRestante)}
            </div>
          </div>
        </div>

        <div className="bg-white text-blue-900 rounded-xl p-8 shadow-xl">
          <p className="text-xl font-semibold mb-6">
            {questoes[questaoAtual]?.pergunta}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['A', 'B', 'C', 'D'].map((letra) => {
              const resposta = questoes[questaoAtual]?.[`alternativa${letra}` as keyof Questao];
              const respostaSelecionada = respostas[questaoAtual];
              const correta = questoes[questaoAtual]?.resposta === letra;

              return (
                <button
                  key={letra}
                  onClick={() => handleResposta(letra)}
                  disabled={!!respostaSelecionada}
                  className={`p-4 text-left rounded-lg transition-all ${
                    respostaSelecionada === letra
                      ? correta
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <span className="font-bold mr-3">{letra}.</span>
                  {resposta}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 bg-white/10 p-4 rounded-lg">
          <div className="h-2 bg-white/20 rounded-full">
            <div
              className="h-full bg-green-400 rounded-full transition-all"
              style={{ width: `${((questaoAtual + 1) / questoes.length) * 100}%` }}
            />
          </div>
          <p className="text-center mt-2">
            Progresso: {questaoAtual + 1}/{questoes.length}
          </p>
        </div>
      </div>

      
    </div>

    
  );
};

export default SimuladoExecucao;