
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend, ResponsiveContainer
} from 'recharts';
import Header from '../components/Header';

const historico = [
  { data: '01/04', acertos: 7, total: 10 },
  { data: '05/04', acertos: 8, total: 10 },
  { data: '10/04', acertos: 6, total: 10 },
  { data: '15/04', acertos: 9, total: 10 },
];

const desempenhoPorCategoria = [
  { categoria: 'Teoria de Voo', acertos: 80 },
  { categoria: 'Meteorologia', acertos: 65 },
  { categoria: 'Motores', acertos: 90 },
  { categoria: 'Regulamentos', acertos: 75 },
];

const TelaDesempenho = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">📈 Seu Desempenho</h1>

          {/* Histórico */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">🗂️ Histórico de Simulados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {historico.map((item, i) => (
                <div
                  key={i}
                  className="bg-white text-blue-900 rounded-xl shadow-lg p-4 hover:scale-105 transition"
                >
                  <p className="font-medium">Data: {item.data}</p>
                  <p>Acertos: {item.acertos}/{item.total}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(item.acertos / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico por categoria */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">📊 Desempenho por Categoria</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={desempenhoPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="acertos" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de linha - evolução */}
          <div>
            <h2 className="text-xl font-semibold mb-4">📉 Evolução ao Longo do Tempo</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="acertos" stroke="#60a5fa" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default TelaDesempenho;
