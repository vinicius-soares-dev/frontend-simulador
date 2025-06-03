import React, { useState } from 'react';
import { Link,  useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !senha) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Objeto com os dados do cadastro
      const data = {
        nome,
        email,
        senha,

      };

      // Enviando a requisição com conteúdo JSON
      const response = await axios.post('https://portalaeronauta.com/auth/register', data, {
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      setMensagem(response.data.message || 'Cadastro realizado com sucesso!');
      navigate('/login');
      setErro('');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao cadastrar.';
      setErro(msg);
      setMensagem('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-800 via-blue-500 to-blue-300 p-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">Crie sua conta</h2>

        {erro && <div className="bg-red-500 text-white p-2 mb-4 rounded-lg text-center">{erro}</div>}
        {mensagem && <div className="bg-green-500 text-white p-2 mb-4 rounded-lg text-center">{mensagem}</div>}

        <form onSubmit={handleCadastro}>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-lg text-blue-600">Nome</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-4 mt-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu nome"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg text-blue-600">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 mt-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="senha" className="block text-lg text-blue-600">Senha</label>
            <input
              type={mostrarSenha ? 'text' : 'password'}
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-4 mt-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              placeholder="Crie uma senha"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-12 text-blue-500"
            >
              {mostrarSenha ? '🙈' : '👁️'}
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300">
            Cadastrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-500 hover:underline text-lg">Já tem uma conta? Faça login</Link>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
