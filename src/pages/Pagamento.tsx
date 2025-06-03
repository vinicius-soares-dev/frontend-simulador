import { useEffect, useState } from 'react';

const Pagamento = () => {
  const [mensagem, setMensagem] = useState('Redirecionando para o pagamento...');

  useEffect(() => {
    const criarPreferencia = async () => {
      try {
        const userId = localStorage.getItem('userId');

        if (!userId) {
          alert('Usuário não autenticado.');
          return;
        }

        setMensagem('Buscando informações do usuário...');

        const usuarioRes = await fetch(`https://portalaeronauta.com/auth/usuarios/${userId}`);
        const usuario = await usuarioRes.json();

        if (!usuario.email) {
          alert('Email do usuário não encontrado.');
          return;
        }
      setMensagem('Criando preferência de pagamento...');
        const response = await fetch('https://portalaeronauta.com/payment/pagamento', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: usuario.email,
            plano: 'premium',
          })
        });

        const data = await response.json();

        if (data.init_point) {
           setMensagem('Redirecionando para o Mercado Pago...');
          window.location.href = data.init_point;
        } else {
          alert('Erro ao criar preferência de pagamento');
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao processar pagamento');
      }
    };

        // Timeout para feedback se estiver demorando demais
    const timeout = setTimeout(() => {
      setMensagem('Estamos demorando mais que o normal... Por favor, aguarde mais alguns segundos.');
    }, 5000);

    criarPreferencia();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="text-center p-10 text-lg">
      {mensagem}
    </div>
  );
};

export default Pagamento;
