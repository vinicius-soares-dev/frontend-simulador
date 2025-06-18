import React, { useState, useEffect } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import Header from '../components/Header';
import "../assets/styles/loader.css";

interface Questao {
  codigo: string;
  pergunta: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  resposta: string;
}

const TelaUploadQuestoes = () => {
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [ultimasQuestoes, setUltimasQuestoes] = useState<string[]>([]);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [cursos, setCursos] = useState<{ id: number, nome: string, categoriaId: number }[]>([]);
  const [cursoId, setCursoId] = useState<number | null>(null); 
  const [isLoadingCurso, setIsLoadingCurso] = useState(false);
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
const [novaEscolaNome, setNovaEscolaNome] = useState('');
const [escolas, setEscolas] = useState<{ id: number; nome: string }[]>([]);
const [escolaId, setEscolaId] = useState<number | null>(null);
const [isUploading, setIsUploading] = useState(false);
const modulosFiltrados = cursos.filter(curso => curso.categoriaId === categoriaId);



  const fetchCategoriasECursos = async () => {
    try {
      const [resCategorias, resCursos] = await Promise.all([
        fetch('https://portalaeronauta.com/modulos/categorias'),
        fetch('https://portalaeronauta.com/cursos/listar-cursos')
      ]);

      const dataCategorias = await resCategorias.json();
      const dataCursos = await resCursos.json();

      setCategorias(dataCategorias);
      setCursos(dataCursos);
    } catch (error) {
      console.error('Erro ao buscar cursos ou módulos:', error);
    }
  };

  useEffect(() => {
  fetchCategoriasECursos();
}, []);

console.log(escolas);
console.log(escolaId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        const questoesExtraidas = rows.slice(1).map((row) => ({
          codigo: String(row[0] ?? ''),
          pergunta: String(row[1] ?? ''),
          alternativas: {
            A: String(row[2] ?? ''),
            B: String(row[3] ?? ''),
            C: String(row[4] ?? ''),
            D: String(row[5] ?? ''),
          },
          resposta: String(row[6] ?? ''),
        }));

        setQuestoes(questoesExtraidas);
        setFeedback(null);
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || questoes.length === 0 || cursoId === null) {
      setFeedback({ type: 'error', message: 'Nenhum arquivo ou questões válidas foram lidas, ou curso não selecionado.' });
      return;
    };

    setIsUploading(true);

    const questoesConvertidas = questoes.map((q) => ({
      codigo: q.codigo,
      pergunta: q.pergunta,
      alternativaA: q.alternativas.A,
      alternativaB: q.alternativas.B,
      alternativaC: q.alternativas.C,
      alternativaD: q.alternativas.D,
      resposta: q.resposta,
    }));

    try {

    const response = await fetch('https://portalaeronauta.com/questoes/upload-questoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questoes: questoesConvertidas, cursoId }),
    });

    // 1) Parser do JSON
    const data = await response.json();

    // 2) Se status não OK ou nenhum registro criado → erro
    if (!response.ok || data.created === 0) {
      throw new Error(
        data.message ||
        'Nenhuma questão foi inserida. Verifique duplicatas ou formato.'
      );
    }

    // 3) Sucesso real: exibe quantas entraram
    setFeedback({
      type: 'success',
      message: `${data.created} questões importadas com sucesso!`
    });


      const novasQuestoes = questoes.slice(0, 5).map((q, idx) => `${idx + 1}. ${q.pergunta}`);
      setUltimasQuestoes(novasQuestoes);

      setFile(null);
      setQuestoes([]);
    }catch (error: any) {
      setFeedback({
        type: 'error',
        message: error.message || 'Erro ao importar as questões.'
      });
    }
    finally {
      setIsUploading(false); 
    }
  };

const handleCreateCurso = async () => {
  if (!categoriaId) {
    alert('Selecione um curso primeiro!');
    return;
  }

  const nomeCurso = prompt('Digite o nome do novo curso:');
  if (!nomeCurso) return;

  setIsLoadingCurso(true);
  try {
    const response = await fetch('https://portalaeronauta.com/cursos/criar-curso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nomeCurso, categoriaId }),
    });

    if (!response.ok) throw new Error('Erro ao criar curso');

    const novoCurso = await response.json();
    await fetchCategoriasECursos(); 
    setCursos((prevCursos) => [...prevCursos, novoCurso]);
    setCursoId(novoCurso.id);
    setFeedback({ type: 'success', message: 'Curso criado com sucesso!' });
  } catch (error: any) {
    setFeedback({ type: 'error', message: error.message || 'Erro ao criar curso' });
  } finally {
    setIsLoadingCurso(false);
  }
};


  const handleCreateCategoria = async () => {
  const nomeCategoria = prompt('Digite o nome do novo curso:');
  if (!nomeCategoria) return;

  try {
    const response = await fetch('https://portalaeronauta.com/modulos/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: nomeCategoria }),
    });

    if (!response.ok) throw new Error('Erro ao criar curso');

    const novaCategoria = await response.json();
    await fetchCategoriasECursos(); 
    setCategorias((prev) => [...prev, novaCategoria]);
    setCategoriaId(novaCategoria.id);
    setFeedback({ type: 'success', message: 'Curso criada com sucesso!' });
  } catch (error: any) {
    setFeedback({ type: 'error', message: error.message || 'Erro ao criar curso' });
  }
};

const handleCriarNovaEscola = async () => {
  try {
    const res = await fetch('https://portalaeronauta.com/escolas/criar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novaEscolaNome }),
    });

    const nova = await res.json();
    setEscolas((prev) => [...prev, nova]);
    setEscolaId(nova.id);
    setModalAberto(false);
    setNovaEscolaNome('');
  } catch (error) {
    console.error('Erro ao criar escola', error);
  }
};



  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-6 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-2xl text-blue-900">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">📤 Upload de Questões</h1>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Selecione o curso:</label>
          <select
            onChange={(e) => setCategoriaId(Number(e.target.value))}
            className="w-full p-2 border rounded"
            value={categoriaId ?? ''}
          >
            <option value="" disabled>Selecione um curso</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
          <button
            onClick={handleCreateCategoria}
            className="mt-2 text-blue-600 underline"
          >
            + Criar novo curso
          </button>
          <button
            onClick={() => setModalAberto(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            style={{ marginLeft: "3rem"}}
          >
            + Nova Escola
          </button>

        </div>


          {/* Seleção de Curso */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Selecione o módulo</label>
            <select
              className="form-control"
              value={cursoId || ''}
              onChange={(e) => setCursoId(Number(e.target.value))}
            >
              <option value="">Selecione um módulo</option>
              {modulosFiltrados.map((modulo) => (
                <option key={modulo.id} value={modulo.id}>
                  {modulo.nome}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateCurso}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg flex justify-center items-center gap-2"
              disabled={isLoadingCurso}
            >
              {isLoadingCurso ? 'Criando módulo...' : 'Criar Novo Módulo'}
            </button>
          </div>

          {/* Upload */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Selecionar arquivo (.xlsx)</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="block w-full border border-gray-300 rounded-lg p-2"
              />
              {file && <span>{file.name}</span>}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mb-6 p-4 rounded-lg ${feedback.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {feedback.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
              <span className="ml-2">{feedback.message}</span>
            </div>
          )}

          {/* Pré-visualização */}
          {questoes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">Pré-visualização das questões:</h3>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {questoes.map((q, idx) => (
                  <li key={idx} className="bg-gray-100 p-3 rounded">
                    <strong>{q.codigo}</strong> - {q.pergunta}
                    <ul className="ml-4 text-sm mt-1">
                      <li>A: {q.alternativas.A}</li>
                      <li>B: {q.alternativas.B}</li>
                      <li>C: {q.alternativas.C}</li>
                      <li>D: {q.alternativas.D}</li>
                    </ul>
                    <p className="text-xs mt-1">Resposta correta: <strong>{q.resposta}</strong></p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Últimas questões */}
          <div className="mb-6">
            <h2 className="font-semibold text-xl mb-2">Últimas questões importadas:</h2>
            <ul>
              {ultimasQuestoes.map((questao, index) => (
                <li key={index} className="mb-2">{questao}</li>
              ))}
            </ul>
          </div>

          {/* Botão de upload */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            style={{
              backgroundColor: isUploading ? '#ccc' : '#007bff',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isUploading ? (
              <>
                <span className="loader"></span> Enviando...
              </>
            ) : (
              <>
                <AiOutlineUpload /> Enviar Questões
              </>
            )}
          </button>

        </div>
      </div>

      {modalAberto && (
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

    </>
  );
};

export default TelaUploadQuestoes;
