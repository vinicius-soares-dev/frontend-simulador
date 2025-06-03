import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';

const SuccessPage = () => {

    const location = useLocation();

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const status = params.get('status');       
    const collection_id = params.get('collection_id');
    const payment_id = params.get('payment_id');
    // ..
    if (status === 'approved') {

      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

  
      fetch('https://portalaeronauta.com/assinaturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // se você usa JWT
        },
        body: JSON.stringify({
          userId,
          plano: 'premium',
          mpSubscriptionId: collection_id,
          paymentMethod: { payment_id, site: params.get('site_id') },
        }),
      })
        .then((r) => r.json())
        .then((data) => {
        })
        .catch((err) => console.error('Erro ao ativar assinatura:', err));
    }
  }, [location.search]);

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 via-green-300 to-green-200 p-4">
        <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl mt-12 text-center">
          <svg
            className="mx-auto mb-6 w-20 h-20 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-3xl font-semibold text-green-700 mb-4">Pagamento realizado com sucesso!</h2>
          <p className="text-gray-700 mb-6">
            Obrigado por adquirir o plano. Você já pode acessar todos os benefícios exclusivos.
          </p>
          <Link to="/">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300">
              Voltar para Home
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;
