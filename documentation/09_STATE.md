# 09 — Gerenciamento de Estado

## Filosofia

Um único estado global (Context API), sem Redux/Zustand/MobX. Isso é intencional: o app tem um usuário só por instalação, sem sincronização remota, e o volume de dados é pequeno — a complexidade de uma biblioteca de estado externa não se paga ainda.

## Estado global vs. estado local

| Tipo | Onde vive | Exemplos |
|---|---|---|
| **Global** (`EstudixContext`) | Precisa ser lido por mais de uma tela, ou precisa persistir entre sessões | `settings`, `materias`, `notas`, `timer` |
| **Local** (`useState` na própria tela) | Só importa enquanto a tela/modal está aberta | `modalVisible`, campos de formulário antes de salvar (`tempName`, `educationLevel` no onboarding antes de confirmar) |

### Exemplo do padrão "local até confirmar" — Onboarding

No `OnboardingScreen`, `educationLevel` e `goal` ficam em `useState` local durante os passos 1–2 e só chegam ao contexto global quando o usuário conclui o fluxo (`completeOnboarding`). Isso segue exatamente o mesmo padrão que já existia para `name` e `materiaName` antes desta funcionalidade — nenhum padrão novo foi introduzido.

### Exemplo do padrão "grava direto no contexto" — Configurações

Já em `ConfiguracoesScreen`, os mesmos campos (`educationLevel`, `goal`, mais `difficulties`/`studyMethod`/`weeklyGoalMinutes`) gravam **imediatamente** no contexto a cada toque (`setEducationLevel`, `toggleDifficulty`, etc.), sem estado local intermediário — porque ali não existe um botão "salvar" explícito, o modal é só uma superfície de edição contínua (mesmo padrão que os steppers de Pomodoro já usavam).

## Re-renderização

Por ser um único `Context.Provider`, **qualquer** `dispatchUpdate` re-renderiza todo componente que chama `useEstudix()` — não há seletores parciais. Na escala atual (poucas telas montadas por vez, listas pequenas) isso não é um problema perceptível. Os relatórios de arquitetura anteriores recomendam dividir o contexto por domínio (settings, matérias, catálogo, plano...) antes de mais funcionalidades pesadas serem adicionadas — ainda não feito.

## Estado "volátil" (não persistido a cada mudança)

`updateTimer` distingue explicitamente atualizações de tick do cronômetro (`remainingSeconds` isolado) das demais, usando `dispatchVolatileUpdate` em vez de `dispatchUpdate` — evita acionar o debounce de gravação em disco a cada segundo do Pomodoro rodando. Esse é o único lugar do app com essa distinção.
