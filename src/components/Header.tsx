import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/img/portalaeronauta.png';
import Avatar from '../assets/img/cms.png';

interface UserData {
  id: number;
  nome: string;
  fotoUrl: string;
  role: string;

}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);


  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://portalaeronauta.com/auth/usuarios/${userId}`);
        if (!response.ok) throw new Error('Erro ao buscar usuário');
        
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const navLinks = [
    { name: 'Home', path: '/'},
    { name: 'Simulados', path: '/simulados' },
    { name: 'Plano', path: '/upgrade' },
    { name: 'Ranking', path: '/ranking' },
  ];

  const adminLinks = [
    { name: 'Home', path: '/'},
    { name: 'Admin', path: '/admin' },
    { name: 'Questoes', path: '/admin/questoes' },
    { name: 'Ads', path: '/admin/ads' },
    { name: 'Escolas', path: '/admin/escolas'},
    { name: 'Adicionar', path: '/admin/create' },
    { name: 'Configurações', path: '/admin/ads/configuracoes' },
  ]

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Menu Hamburguer */}
          <div className="flex justify-between items-center w-full md:w-auto">
  {/* Logo à esquerda */}
  <img
    className="h-12 w-auto"
    src={Logo}
    alt="Portal Aeronauta"
  />

            {/* Botão menu hamburguer à direita (só no mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>


          {/* Links de Navegação (Desktop) */}
        <nav className="hidden md:flex space-x-8">
          {userData?.role === 'admin' ? (
            adminLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all
                  ${isActive ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`
                }
              >
                {link.name}
              </NavLink>
            ))
          ) : (
            navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all
                  ${isActive ? 'text-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`
                }
              >
                {link.name}
              </NavLink>
            ))
          )}
        </nav>

        
{token && (
  <div className="hidden md:flex items-center space-x-4">
    <NavLink
      to="/perfil"
      className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-all"
    >
      <span className="mr-2">Meu Perfil</span>
      {userData?.role === 'admin' ? (
        <img
          className="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-blue-500 object-cover"
          src={userData?.fotoUrl || Avatar}
          alt="Avatar do usuário"
          onError={(e) => {
            (e.target as HTMLImageElement).src = Avatar;
          }}
        />
      ) : null}
    </NavLink>
  </div>
)}
         {/* Menu Mobile */}
{isMenuOpen && (
  <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50">
    <nav className="flex flex-col px-4 py-4 space-y-2">
      {(userData?.role === 'admin' ? adminLinks : navLinks).map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={() => setIsMenuOpen(false)}
          className={({ isActive }) =>
            `block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium ${
              isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}

      <NavLink
        to="/perfil"
        onClick={() => setIsMenuOpen(false)}
        className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50"
      >
        <span className="mr-2">Meu Perfil</span>
        {userData?.role === 'admin' && (
          <img
            className="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-blue-500 object-cover"
            src={userData?.fotoUrl || Avatar}
            alt="Avatar do usuário"
            onError={(e) => {
              (e.target as HTMLImageElement).src = Avatar;
            }}
          />
        )}
      </NavLink>
    </nav>
  </div>
)}

        </div>
      </div>
    </header>
  );
};

export default Header;