# 15 — Changelog

Este arquivo é atualizado a cada funcionalidade implementada, na ordem em que foram entregues.

---

## [2026-07-14] Feature 1 — Perfil Educacional

**Objetivo:** capturar nível de escolaridade, objetivo, dificuldades, método de estudo e meta semanal do usuário, sem quebrar o fluxo de onboarding existente nem introduzir uma nova camada de estado.

### Adicionado
- Componente reutilizável `ChipSelector` (`src/components/ChipSelector.js`) — seleção única ou múltipla em formato de pílula.
- Constantes `EDUCATION_LEVELS`, `GOALS`, `DIFFICULTIES`, `STUDY_METHODS` em `EstudixContext.js`.
- Campos `educationLevel`, `goal`, `difficulties`, `studyMethod`, `weeklyGoalMinutes` em `state.settings`.
- Ações de contexto: `setEducationLevel`, `setGoal`, `setStudyMethod`, `toggleDifficulty`.
- Terceiro passo no `OnboardingScreen` (nível + objetivo), entre o passo de nome e o de primeira matéria.
- Seção "Perfil de Estudo" em `ConfiguracoesScreen`, com modal contendo os quatro `ChipSelector` e um stepper de meta semanal.

### Alterado
- `completeOnboarding(name)` → `completeOnboarding(name, educationLevel, goal)` — compatível com chamadas antigas (parâmetros novos são opcionais).
- `changeSetting(type, delta)` ganhou o tipo `'weekly'` para a meta semanal.
- `loadStore()` ganhou compatibilidade retroativa para os cinco campos novos de `settings` (backups antigos continuam carregando sem erro).

### Removido
- Nada.

### Bibliotecas
- Nenhuma adicionada, nenhuma removida.

### Arquivos tocados
| Arquivo | Tipo de mudança |
|---|---|
| `src/components/ChipSelector.js` | criado |
| `src/context/EstudixContext.js` | alterado |
| `src/screens/OnboardingScreen.js` | alterado |
| `src/screens/ConfiguracoesScreen.js` | alterado |

### Validação realizada
- `@babel/core` + `babel-preset-expo`: os 4 arquivos tocados transformam sem erro de sintaxe.
- `expo start --web` + requisição do bundle Metro: **813 módulos, bundle gerado com sucesso, sem erros de compilação** (`Web Bundled 5184ms index.js (813 modules)`).
- Não há suíte de testes automatizados configurada no projeto (sem Jest/Testing Library) — a validação funcional completa (clicar nos três passos do onboarding, abrir o modal de Perfil de Estudo, confirmar persistência após fechar/reabrir o app) **não foi executada em dispositivo/emulador real** nesta sessão e é recomendada antes de considerar a funcionalidade definitivamente encerrada.

### Débito técnico já existente, não introduzido por esta mudança (documentado, não corrigido)
- `ConfiguracoesScreen.js` importa `spacing` de `theme` mas nunca o utiliza — pré-existente ao início desta funcionalidade.
- Lógica de virada de semana em `loadStore()` (`currDate.getDay() < lastDate.getDay()`) é imprecisa perto de virada de mês — já identificada nos relatórios de arquitetura anteriores, fora do escopo desta funcionalidade.

---

*Próximas entradas seguem abaixo conforme novas funcionalidades do roadmap forem implementadas (Catálogo Inteligente, Cadastro Inteligente, Recomendações, Plano de Estudos, Pomodoro expandido, Dashboard Inteligente, preparação para IA).*
