import { useState } from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const GestaoAssinaturasPage = () => {
  const [assinaturas, setAssinaturas] = useState([
    {
      id: 1,
      nomeServico: 'Serviço Premium',
      status: 'Ativo',
      dataInicio: '2025-01-15',
      proximoPagamento: '2025-02-15',
      pagamentoAutomatico: true,
    },
    {
      id: 2,
      nomeServico: 'Plano Básico',
      status: 'Ativo',
      dataInicio: '2025-02-01',
      proximoPagamento: '2025-03-01',
      pagamentoAutomatico: false,
    },
  ]);

  const [historico, setHistorico] = useState([
    {
      dataPagamento: '2025-01-15',
      valorPago: 'R$ 100,00',
      status: 'Pago',
      agendamento: '2025-01-20',
    },
    {
      dataPagamento: '2025-02-01',
      valorPago: 'R$ 120,00',
      status: 'Pago',
      agendamento: '2025-02-05',
    },
  ]);

  const handleTogglePagamentoAutomatico = (id: number) => {
    setAssinaturas(assinaturas.map((assinatura) =>
      assinatura.id === id ? { ...assinatura, pagamentoAutomatico: !assinatura.pagamentoAutomatico } : assinatura
    ));
  };



  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-opacity-90 text-white py-6 z-20 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-4xl font-extrabold text-black">Gestão de Assinaturas</h1>

        </div>
      </header>

      {/* Gestao de Assinaturas Section */}
      <section className="py-32 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Minhas Assinaturas Ativas</h2>
          
          {/* Listagem de Assinaturas Ativas */}
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {assinaturas.map((assinatura) => (
              <div key={assinatura.id} className="bg-white p-6 rounded-xl shadow-xl transition-transform transform hover:scale-105 duration-300 hover:shadow-2xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{assinatura.nomeServico}</h3>
                <p className="text-gray-700 mb-2">Status: <span className={`font-semibold ${assinatura.status === 'Ativo' ? 'text-green-500' : 'text-red-500'}`}>{assinatura.status}</span></p>
                <p className="text-gray-700 mb-2">Data de Início: {assinatura.dataInicio}</p>
                <p className="text-gray-700 mb-2">Próximo Pagamento: {assinatura.proximoPagamento}</p>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id={`pagamentoAutomatico-${assinatura.id}`}
                    checked={assinatura.pagamentoAutomatico}
                    onChange={() => handleTogglePagamentoAutomatico(assinatura.id)}
                    className="mr-2 rounded-lg transition-all duration-300"
                  />
                  <label htmlFor={`pagamentoAutomatico-${assinatura.id}`} className="text-lg text-gray-700">
                    {assinatura.pagamentoAutomatico ? <FaCheckCircle className="text-green-500 inline mr-2" /> : <FaRegCircle className="text-gray-400 inline mr-2" />}
                    Pagamento Automático
                  </label>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-4xl font-bold text-center text-gray-800 my-10">Histórico de Pagamentos e Agendamentos</h2>

          {/* Histórico de Pagamentos */}
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Últimos Pagamentos</h3>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-lg text-gray-600">Data do Pagamento</th>
                  <th className="px-6 py-3 text-left text-lg text-gray-600">Valor Pago</th>
                  <th className="px-6 py-3 text-left text-lg text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-lg text-gray-600">Agendamento</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300 hover:bg-gray-50">
                    <td className="px-6 py-3 text-lg text-gray-700">{item.dataPagamento}</td>
                    <td className="px-6 py-3 text-lg text-gray-700">{item.valorPago}</td>
                    <td className="px-6 py-3 text-lg">{item.status === 'Pago' ? <span className="text-green-500">{item.status}</span> : <span className="text-red-500">{item.status}</span>}</td>
                    <td className="px-6 py-3 text-lg text-gray-700">{item.agendamento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-6">
        <p>&copy; 2025 Sistema de Gestão de Assinaturas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default GestaoAssinaturasPage;
