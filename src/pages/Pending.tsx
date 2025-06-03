import { Link } from 'react-router-dom';
import Header from '../components/Header';

const PendingPage = () => {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 p-4">
        <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl mt-12 text-center">
          <svg
            className="mx-auto mb-6 w-20 h-20 text-yellow-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3"
            />
          </svg>
          <h2 className="text-3xl font-semibold text-yellow-700 mb-4">Pagamento pendente</h2>
          <p className="text-gray-700 mb-6">
            Seu pagamento está aguardando confirmação. Assim que aprovado, você terá acesso ao plano.
          </p>
          <Link to="/">
            <button className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition duration-300">
              Voltar para Home
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default PendingPage;
