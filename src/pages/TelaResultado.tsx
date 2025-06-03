

const resultadoMock = {
  totalQuestoes: 10,
  acertos: 7,
  erros: 3,
  tempoTotal: '12m 30s',
  respostas: [
    { enunciado: 'O que é o profundor?', correta: true },
    { enunciado: 'O que é sustentação?', correta: true },
    { enunciado: 'Qual a função do flap?', correta: false },
    { enunciado: 'Quando ocorre estol?', correta: true },
    { enunciado: 'Qual a função do aileron?', correta: false },
    { enunciado: 'O que é arrasto?', correta: true },
    { enunciado: 'Como funciona o motor a reação?', correta: true },
    { enunciado: 'O que é peso máximo de decolagem?', correta: true },
    { enunciado: 'O que é VNE?', correta: false },
    { enunciado: 'Quando usar reverso?', correta: true },
  ],
};

const TelaResultado = () => {
  const { totalQuestoes, acertos, erros, tempoTotal, respostas } = resultadoMock;
  const percentual = Math.round((acertos / totalQuestoes) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-600 text-white p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white text-blue-900 rounded-2xl shadow-2xl p-8 mt-10 animate-fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center">🎯 Resultado do Simulado</h1>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="absolute top-0 left-0 w-full h-full">
                <circle
                  className="text-gray-300"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-green-500 transition-all duration-700"
                  strokeWidth="10"
                  strokeDasharray={314}
                  strokeDashoffset={314 - (314 * percentual) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="50"
                  cx="64"
                  cy="64"
                />
              </svg>
              <span className="absolute top-10 left-0 w-full text-center font-bold text-xl">
                {percentual}%
              </span>
            </div>
            <p className="mt-2 font-medium">Aproveitamento</p>
          </div>

          <div className="flex flex-col justify-center space-y-2">
            <p><strong>Total de Questões:</strong> {totalQuestoes}</p>
            <p><strong>Acertos:</strong> {acertos}</p>
            <p><strong>Erros:</strong> {erros}</p>
            <p><strong>Tempo:</strong> {tempoTotal}</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">📋 Revisão das Questões</h2>
        <ul className="space-y-3">
          {respostas.map((q, i) => (
            <li
              key={i}
              className={`p-4 rounded-xl border-2 transition ${
                q.correta
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-red-50 border-red-300 text-red-700'
              }`}
            >
              <span className="font-medium">Questão {i + 1}:</span> {q.enunciado}
              <span className="float-right font-bold">
                {q.correta ? '✅' : '❌'}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition">
            🔍 Revisar Questões
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelaResultado;
