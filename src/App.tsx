import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Register";
import DashboardAluno from "./pages/DashboardAluno";
import Simulados from "./pages/Simulados";
import SimuladoExecucao from "./pages/SimuladoExec.tsx";
import TelaResultado from "./pages/TelaResultado";
import TelaDesempenho from "./pages/Desempenho";
import TelaRanking from "./pages/Ranking";
import TelaPerfil from "./pages/Perfil";
import TelaUploadQuestoes from "./pages/Admin";
import TelaGerenciarQuestoes from "./pages/AdminGerencia";
import UpgradePremium from "./pages/Upgrade";
import SchoolRanking from "./pages/RankingEscolas";
import GestaoAssinaturasPage from "./pages/Test";
import CategoriaSimulados from "./pages/CategoriaSimulados.tsx.tsx";
import TelaAdicaoManualQuestoes from "./pages/TelaAdicaoManualQuestoes.tsx";
import AdsPage from "./pages/AdminAds.tsx";
import BannerAdminPanel from "./pages/AdminBannerGerencia.tsx";
import BannerViewPage from "./components/BannerViewPage.tsx";
import DesafioInsanoExecucao from "./pages/DesafioInsano.tsx";
import AdminRoute from './components/AdminRoute'; 
import EscolasManager from "./pages/EscolasManager.tsx";
import SuccessPage from "./pages/Sucesso.tsx";
import FailurePage from "./pages/Falha.tsx";
import PendingPage from "./pages/Pending.tsx";
import Pagamento from "./pages/Pagamento.tsx";
import CursosAdmin from "./pages/CursosAdmin.tsx";

function App() {
  return (
     <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dashboard" element={<DashboardAluno />} />
        <Route path="/simulados" element={<Simulados />} />
        <Route path="/simuladoexec" element={<SimuladoExecucao />} />
        <Route path="/resultado" element={<TelaResultado />} />
        <Route path="/desempenho" element={<TelaDesempenho />} />
        <Route path="/ranking" element={<TelaRanking />} />
        <Route path="/perfil" element={<TelaPerfil />} />
        <Route path="/banner/:id" element={<BannerViewPage />} />
        <Route path="/upgrade" element={<UpgradePremium />} />
        <Route path="/ranking/escolas" element={<SchoolRanking />} />
        <Route path="/test" element={<GestaoAssinaturasPage />} />
        <Route path="/modulos/categorias/:id" element={<CategoriaSimulados />} />
        <Route path="/curso/:id" element={<SimuladoExecucao />} />
        <Route path="/simulados/desafio-insano" element={<DesafioInsanoExecucao />} />
        <Route path="/sucesso" element={<SuccessPage />} />
        <Route path="/falha" element={<FailurePage />} />
        <Route path="/pendente" element={<PendingPage />} />
        <Route path="/pagamento" element={<Pagamento />} />

        {/* Rotas administrativas protegidas */}
        <Route path="/admin" element={
          <AdminRoute>
            <TelaUploadQuestoes />
          </AdminRoute>
        } />

        <Route path="/admin/questoes" element={
          <AdminRoute>
            <TelaGerenciarQuestoes />
          </AdminRoute>
        } />

        <Route path="/admin/ads" element={
          <AdminRoute>
            <AdsPage />
          </AdminRoute>
        } />

        <Route path="/admin/ads/configuracoes" element={
          <AdminRoute>
            <BannerAdminPanel />
          </AdminRoute>
        } />

        <Route path="/admin/create" element={
          <AdminRoute>
            <TelaAdicaoManualQuestoes />
          </AdminRoute>
        } />

              <Route path="/admin/escolas" element={
          <AdminRoute>
            <EscolasManager />
          </AdminRoute>
        } />

                <Route path="/admin/cursos/editor" element={
          <AdminRoute>
            <CursosAdmin />
          </AdminRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App
