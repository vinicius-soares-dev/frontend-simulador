# ✈️ Portal de Simulados de Aviação

Plataforma web desenvolvida com **React + TypeScript + Vite**, focada na preparação de alunos por meio de simulados interativos, rankings e gamificação.

---

## 📚 Funcionalidades Principais

- **Upload de questões via Excel**: o administrador pode importar perguntas diretamente por planilhas.
- **Simulados personalizados ou aleatórios** por categoria.
- **Feedback imediato**: acertos e erros aparecem assim que a questão é respondida.
- **Dashboard do Aluno**: histórico, desempenho, pontuação e simulados realizados.
- **Ranking em tempo real** dos melhores alunos e por escolas.
- **Sistema de pontuação e gamificação** para engajar os usuários.
- **Login e cadastro** para alunos e administradores.
- **Área administrativa** com gestão de questões, banners, anúncios, cursos e escolas.
- **Integração com pagamentos**, upgrades e acesso premium.

---

## 🚀 Tecnologias Utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- ESLint + Prettier
- TailwindCSS (opcional)
- Integração com APIs de pagamento

---

## 📁 Estrutura de Rotas

| Caminho                         | Componente                     | Descrição |
|---------------------------------|--------------------------------|-----------|
| `/`                             | `Home`                         | Página inicial |
| `/login`                        | `Login`                        | Login de usuários |
| `/cadastro`                     | `Register`                     | Cadastro de novos usuários |
| `/dashboard`                   | `DashboardAluno`               | Painel do aluno |
| `/simulados`                   | `Simulados`                    | Listagem de simulados |
| `/simuladoexec`               | `SimuladoExecucao`            | Execução do simulado |
| `/resultado`                   | `TelaResultado`               | Resultado após simulado |
| `/desempenho`                  | `TelaDesempenho`              | Análise de desempenho |
| `/ranking`                     | `TelaRanking`                 | Ranking geral dos alunos |
| `/ranking/escolas`            | `SchoolRanking`               | Ranking por escola |
| `/perfil`                      | `TelaPerfil`                  | Perfil do aluno |
| `/upgrade`                     | `UpgradePremium`              | Página de upgrade premium |
| `/modulos/categorias/:id`     | `CategoriaSimulados`          | Simulados por categoria |
| `/curso/:id`                   | `SimuladoExecucao`            | Execução de curso específico |
| `/simulados/desafio-insano`   | `DesafioInsanoExecucao`       | Simulado especial (hardcore) |
| `/banner/:id`                 | `BannerViewPage`              | Visualização de banner promocional |
| `/pagamento`                  | `Pagamento`                   | Tela de pagamento |
| `/sucesso`                    | `SuccessPage`                 | Pagamento aprovado |
| `/falha`                      | `FailurePage`                 | Pagamento recusado |
| `/pendente`                   | `PendingPage`                 | Pagamento em análise |
| `/test`                       | `GestaoAssinaturasPage`       | Gestão de assinaturas (teste) |

---

## 🔐 Rotas Administrativas (protegidas por `AdminRoute`)

| Caminho                                 | Componente                   | Descrição |
|-----------------------------------------|------------------------------|-----------|
| `/admin`                                | `TelaUploadQuestoes`         | Upload de questões por Excel |
| `/admin/questoes`                       | `TelaGerenciarQuestoes`      | Gerenciamento de questões cadastradas |
| `/admin/create`                         | `TelaAdicaoManualQuestoes`   | Adição manual de novas questões |
| `/admin/ads`                            | `AdsPage`                    | Gerenciamento de anúncios |
| `/admin/ads/configuracoes`             | `BannerAdminPanel`           | Configuração de banners publicitários |
| `/admin/escolas`                        | `EscolasManager`             | Gerenciar escolas cadastradas |
| `/admin/cursos/editor`                 | `CursosAdmin`                | Editor e gerenciamento de cursos |

---

## 🛠️ Em breve

- Personalização de perfil do aluno
- Certificados digitais
- Fórum de dúvidas entre usuários
- Integração com redes sociais
- Relatórios PDF do desempenho
- Dark mode 🌙

---

## 📞 Contato

Este projeto está sendo desenvolvido por [VG Tech Solutions](https://vgtechsolutions.com.br).  
Entre em contato para parcerias, sugestões ou suporte!

---

## 📌 Licença

Este projeto é privado e protegido por direitos autorais. O uso não autorizado é proibido.
