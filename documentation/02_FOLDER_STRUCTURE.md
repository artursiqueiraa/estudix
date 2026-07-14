# 02 — Estrutura de Pastas

```
estudix/
├─ App.js                    Ponto de entrada React: carrega fontes, inicializa notificações,
│                             decide entre tela de loading / Onboarding / app principal
├─ index.js                  registerRootComponent(App) — bootstrap do Expo
├─ app.json                  Configuração do Expo (nome, ícones, splash, plugins nativos)
├─ babel.config.js           Preset babel-preset-expo + plugin do Reanimated
├─ package.json               Dependências e scripts (start/android/ios/web)
├─ eas.json                  Configuração de build (EAS Build)
├─ assets/                   Ícones, splash screen, imagens estáticas
├─ documentation/            Esta documentação (ver README de cada arquivo abaixo)
└─ src/
   ├─ components/            Componentes reutilizáveis, sem tela própria
   │  ├─ AppHeader.js         Cabeçalho comum (menu/voltar + notificações)
   │  ├─ ChipSelector.js      Seletor de opções em pílulas — seleção única ou múltipla
   │  ├─ ConfirmModal.js      Diálogo de confirmação (substitui Alert.alert nativo)
   │  ├─ FAB.js               Botão flutuante contextual por tela
   │  ├─ GradeChart.js        Gráfico de barras SVG da evolução de notas
   │  └─ Toast.js             Feedback rápido não bloqueante
   │
   ├─ context/
   │  └─ EstudixContext.js    Estado global único + todas as mutações + persistência
   │
   ├─ lib/
   │  └─ notifications.js     Notificações locais (expo-notifications), sem servidor push
   │
   ├─ navigation/
   │  ├─ RootNavigator.js      Stack raiz (Tabs, Calendário, Configurações, Matéria, Menu)
   │  └─ BottomTabNavigator.js Tabs inferiores (Home, Matérias, Foco, Anotações)
   │
   ├─ screens/                Uma tela por rota, sem sub-componentização por domínio
   │  ├─ OnboardingScreen.js   Nome → Perfil Educacional → primeira matéria
   │  ├─ HomeScreen.js         Dashboard: saudação, foco, métricas, calendário, conquistas
   │  ├─ MateriasScreen.js     Grade de matérias cadastradas
   │  ├─ MateriaInternaScreen.js  Checklist / Notas / Flashcards de uma matéria
   │  ├─ FocoScreen.js         Cronômetro Pomodoro
   │  ├─ AnotacoesScreen.js    Anotações livres, filtráveis por matéria
   │  ├─ CalendarioScreen.js   Calendário mensal + eventos
   │  ├─ ConfiguracoesScreen.js Perfil, Pomodoro, Perfil de Estudo, backup, dados
   │  └─ MenuScreen.js         Menu lateral (drawer modal)
   │
   └─ theme/
      └─ index.js             Design tokens: colors, radii, shadows, fontFamily, fontSize, spacing
```

## Pastas que ainda não existem (mencionadas nos relatórios de arquitetura anteriores)

| Pasta planejada | Propósito futuro | Por que ainda não existe |
|---|---|---|
| `src/data/` (ou `src/data/catalog/`) | Catálogo estático de disciplinas (bundle, somente leitura) | Depende da Fase 2 do roadmap técnico (Catálogo Inteligente) |
| `src/services/` | Funções puras: `catalogService`, `recommendationEngine`, `insightsEngine`, `studyPlanGenerator`, `ai/AIProvider` | Nenhuma dessas funcionalidades foi implementada ainda — ver [04_SERVICES.md](./04_SERVICES.md) |
| `src/hooks/` | Hooks finos que combinam serviços + contexto (`useRecommendations`, `useInsights`) | Depende de `services/` existir primeiro |

Essas pastas **não devem ser criadas antecipadamente vazias** — nascem junto com a primeira funcionalidade que precisar delas, para evitar estrutura especulativa sem uso real.
