import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { FaGoogle, FaFacebook } from 'react-icons/fa';
import axios from 'axios';
import '../index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    setLoadingLogin(true);

    try {
      const response = await axios.post('https://portalaeronauta.com/auth/login', {
        email,
        senha,
      });

      const token = response.data.token;
      const user = response.data.user;
      const role = user.role
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', role); 

      setErro('');
      if(role === "admin") {
        return navigate('/admin')
      };
      navigate('/dashboard'); 
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Erro ao fazer login.';
      setErro(message);
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-800 via-blue-500 to-blue-300 p-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">Bem-vindo de volta!</h2>
        
        {erro && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded-lg text-center">
            {erro}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-6">
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
          
          <div className="mb-6">
            <label htmlFor="senha" className="block text-lg text-blue-600">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-4 mt-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
            />
          </div>
          
          <button type="submit"  className={`w-full text-white p-4 rounded-lg transition duration-300 focus:ring-2 focus:outline-none ${
            loadingLogin ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }`}>
             {loadingLogin ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/cadastro" className="text-blue-500 hover:underline text-lg">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>

        {/* <div className="mt-8 space-y-4">
      <button
        onClick={() => window.location.href = 'http://localhost:4000/auth/google'}
        className="w-full bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 flex items-center justify-center"
      >
        <FaGoogle className="mr-2" />
        Entrar com Google
      </button>
          <button className="w-full bg-blue-700 text-white p-4 rounded-lg hover:bg-blue-800 transition duration-300 flex items-center justify-center">
            <FaFacebook className="mr-2" />
            Entrar com Facebook
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
