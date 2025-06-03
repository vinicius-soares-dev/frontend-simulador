import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const DashboardAluno = () => {
  const navigate = useNavigate();


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-r from-blue-800 via-blue-500 to-blue-300 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8" style={{ marginTop: "8rem"}}>
          <h1 className="text-3xl font-bold text-blue-800 mb-4">
            Olá 👋
          </h1>

          <p className="text-lg text-blue-700 mb-8">
            Bem-vindo de volta! Acesso Rápido
          </p>

          {/* Navegação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/simulados')}
              className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-medium"
            >
              📘 Acessar Simulados
            </button>
            <button
              onClick={() => navigate('/ranking')}
              className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-medium"
            >
              🏆 Ver Ranking
            </button>
            <button
              onClick={() => navigate('/perfil')}
              className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-medium"
            >
              👤 Meu Perfil
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardAluno;
