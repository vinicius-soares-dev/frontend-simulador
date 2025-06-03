import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const TelaPerfil = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
    // Estado da escola
  const [escolas, setEscolas] = useState<any[]>([]);
  const [escolaId, setEscolaId] = useState<number | null>(null);
  const [filtroEscola, setFiltroEscola] = useState('');
  const navigate = useNavigate();


  const userId = localStorage.getItem('userId');
  
  
  useEffect(() => {
    const fetchEscolas = async () => {
      try {
        const res = await fetch('https://portalaeronauta.com/escolas');
        const data = await res.json();
        setEscolas(data);
      } catch (error) {
        console.error('Erro ao buscar escolas', error);
      }
    };
    
    fetchEscolas();
  }, []);

  const handleLogout = () => {
      const confirmar = window.confirm("Tem certeza que deseja sair?");
      if (confirmar) {
        localStorage.clear();
        navigate('/');
      }
  };
  
const handleAtualizarPerfil = async () => {
  try {
    setLoading(true);
    setMensagem('');
    
    const response = await fetch(`https://portalaeronauta.com/auth/update-user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nome, 
        email, 
        escolaId: escolaId || null // Garanta o envio mesmo se for null
      }),
    });
    
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao atualizar perfil');
      }
      
      if (fotoFile) {
        const formData = new FormData();
        formData.append('foto', fotoFile);
        
        const fotoResponse = await fetch(`https://portalaeronauta.com/auth/upload-foto/${userId}`, {
          method: 'POST',
          body: formData,
        });
        
        if (!fotoResponse.ok) {
          const data = await fotoResponse.json();
          throw new Error(data.message || 'Erro ao enviar foto');
        }
      }
      
      setMensagem('Perfil atualizado com sucesso!');
    } catch (error: any) {
      setMensagem(error.message || 'Erro ao atualizar');
    } finally {
      setLoading(false);
    }
  };
    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFotoFile(file); // armazena o arquivo
        const reader = new FileReader();
        reader.onloadend = () => setFotoPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    };

  //   const handleCriarNovaEscola = async () => {
  //   try {
  //     const res = await fetch('https://portalaeronauta.com/escolas/criar', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ nome: novaEscolaNome }),
  //     });

  //     const nova = await res.json();
  //     setEscolas((prev) => [...prev, nova]);
  //     setEscolaId(nova.id);
  //     setModalAberto(false);
  //     setNovaEscolaNome('');
  //   } catch (error) {
  //     console.error('Erro ao criar escola', error);
  //   }
  // };

  return (
    <>
    
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 text-blue-900">
        <a href='/dashboard'>Voltar</a>
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">👤 Meu Perfil</h1>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Sair
            </button>
          </div>


          {/* Foto de Perfil */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-blue-500 overflow-hidden shadow-lg">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="Foto de Perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-white text-2xl font-bold">
                    {nome[0]}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md">
                📷
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoChange}
                />
              </label>
            </div>
          </div>

          {/* Formulário */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold text-blue-600 mb-1">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-600 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
                <label className="block text-sm font-semibold text-blue-600 mb-1">Escola</label>
                <input
                  type="text"
                  placeholder="Buscar escola..."
                  className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                  value={filtroEscola}
                  onChange={(e) => setFiltroEscola(e.target.value)}
                />
                <select
                    value={escolaId ?? ''}
                    onChange={(e) => setEscolaId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecione uma escola</option>
                    {escolas
                      .filter((e) =>
                        e.nome.toLowerCase().includes(filtroEscola.toLowerCase())
                      )
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nome}
                        </option>
                      ))}
                  </select>

                {/* <button
                  type="button"
                  onClick={() => setModalAberto(true)}
                  className="text-sm text-blue-700 mt-2 underline"
                >
                  Não encontrou? Criar nova escola
                </button> */}
              </div>

              {/* {modalAberto && (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-blue-800">Criar Nova Escola</h2>
        <input
          type="text"
          placeholder="Nome da escola"
          className="w-full p-3 border border-blue-300 rounded-lg mb-4"
          value={novaEscolaNome}
          onChange={(e) => setNovaEscolaNome(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setModalAberto(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleCriarNovaEscola}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  )}
 */}

            {/* Botões */}
            <div className="flex justify-between items-center gap-4 mt-6">
              <button
                type="button"
                onClick={handleAtualizarPerfil}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md disabled:opacity-50"
              >
                {loading ? 'Salvando...' : '💾 Salvar Alterações'}
              </button>

            </div>

            {mensagem && (
              <p className={`mt-4 text-center font-medium ${mensagem.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                {mensagem}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default TelaPerfil;
