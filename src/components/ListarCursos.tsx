import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Curso {
  id: number;
  nome: string;
  categoriaId: number;
}

interface Categoria {
  id: number;
  nome: string;
}

interface CursoComCategoria extends Curso {
  nomeCategoria: string;
}

const ListaCursos: React.FC = () => {
  const [cursos, setCursos] = useState<CursoComCategoria[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarCursosECategorias = async () => {
    try {
      const [resCursos, resCategorias] = await Promise.all([
        axios.get<Curso[]>('https://portalaeronauta.com/cursos/listar-cursos'),
        axios.get('https://portalaeronauta.com/modulos/categorias'),
      ]);

      const categoriasMap: Record<number, string> = {};
      resCategorias.data.forEach((cat: Categoria) => {
        categoriasMap[cat.id] = cat.nome;
      });

      const cursosComCategoria: CursoComCategoria[] = resCursos.data.map((curso) => ({
        ...curso,
        nomeCategoria: categoriasMap[curso.categoriaId] || 'Desconhecida',
      }));

      setCursos(cursosComCategoria);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      alert('Erro ao carregar cursos e categorias');
    } finally {
      setLoading(false);
    }
  };

  const excluirCurso = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;
    try {
      await axios.delete(`https://portalaeronauta.com/cursos/cursos/${id}`);
      setCursos((prev) => prev.filter((curso) => curso.id !== id));
    } catch (err) {
      alert('Erro ao excluir curso.');
    }
  };

  useEffect(() => {
    carregarCursosECategorias();
  }, []);

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Lista de Módulos</h2>

        {loading ? (
          <p className="text-center text-blue-500">Carregando módulos...</p>
        ) : cursos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum módulo encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {cursos.map((curso) => (
              <li
                key={curso.id}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-blue-800">{curso.nome}</p>
                  <p className="text-sm text-blue-600">Curso: {curso.nomeCategoria}</p>
                </div>
                <button
                  onClick={() => excluirCurso(curso.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListaCursos;
