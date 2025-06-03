import '../index.css';
import Header from '../components/Header';
import { useEffect, useState } from 'react';

type AssinaturaData = {
  possuiAssinatura: boolean;
  status: 'active' | 'paused' | 'pending';
  diasRestantes: number;
};

const UpgradePremium = () => {
  const [assin, setAssin] = useState<AssinaturaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      setLoading(false);
      return;
    }

    fetch(`https://portalaeronauta.com/assinaturas/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setAssin(data);
        } else {
          console.error("Resposta inesperada:", data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  let buttonText = 'Começar Agora – R$ 54,90';
  let disabled = false;
  let onClick = () => window.location.assign('/pagamento');

  if (assin && assin.possuiAssinatura && assin.status === 'active') {
    const d = assin.diasRestantes;
    if (d > 7) {
      buttonText = `Seu plano vence em ${d} dias`;
      disabled = true;
    } else if (d >= 0) {
      buttonText = `Renovar plano (${d} dias restantes)`;
    } else {
      buttonText = 'Plano pausado – renovar agora';
    }
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-800 via-blue-500 to-blue-300 p-4">
        <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-2xl" style={{ marginTop: "3rem" }}>
          <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">Plano Premium</h2>

          <div className="text-center mb-6">
            <p className="text-xl text-gray-700 mb-4">
              Aproveite todos os benefícios do plano Premium por apenas <strong>R$ 54,90/bimestre</strong> e tenha acesso a conteúdos e ferramentas exclusivas.
            </p>
          </div>

          {/* Benefícios */}
          <div className="space-y-4 mb-6">
            {[
              "Gabarito do Simulado",
              "Simulados Realizados",
              "Questões Favoritadas",
              "Ferramenta Pré-Banca"
            ].map((beneficio, i) => (
              <div className="flex items-center" key={i}>
                <svg className="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-2 text-lg text-gray-800">{beneficio}</span>
              </div>
            ))}
          </div>

          {/* Botão */}
          <div className="text-center">
            <button
              onClick={onClick}
              disabled={disabled}
              className={`w-full py-4 rounded-lg transition duration-300 
                ${disabled
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpgradePremium;
