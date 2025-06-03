import { Link } from 'react-router-dom';
import Header from '../components/Header';

const FailurePage = () => {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-400 via-red-300 to-red-200 p-4">
        <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl mt-12 text-center">
          <svg
            className="mx-auto mb-6 w-20 h-20 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h2 className="text-3xl font-semibold text-red-700 mb-4">Pagamento não concluído</h2>
          <p className="text-gray-700 mb-6">
            Ocorreu um problema ao processar seu pagamento. Por favor, tente novamente.
          </p>
          <Link to="/pagamento">
            <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300">
              Tentar Novamente
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default FailurePage;
