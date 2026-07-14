# 14 — Rotas

| Rota | Navegador | Componente | Params | Acessível a partir de |
|---|---|---|---|---|
| `BottomTabs` | RootNavigator (stack) | `BottomTabNavigator` | `{ screen: 'Home'\|'Materias'\|'Foco'\|'Anotacoes' }` (opcional) | tela inicial após onboarding |
| `BottomTabs/Home` | bottom-tabs | `HomeScreen` | — | tab bar |
| `BottomTabs/Materias` | bottom-tabs | `MateriasScreen` | — | tab bar, Home (métrica "matérias"), MenuScreen |
| `BottomTabs/Foco` | bottom-tabs | `FocoScreen` | — | tab bar, Home (métrica "min de foco", card de ação principal), MenuScreen |
| `BottomTabs/Anotacoes` | bottom-tabs | `AnotacoesScreen` | — | tab bar, Home (métrica "anotações"), AppHeader (ícone de notificações) |
| `Calendario` | RootNavigator (stack) | `CalendarioScreen` | — | Home ("Ver mês"), MenuScreen |
| `Configuracoes` | RootNavigator (stack) | `ConfiguracoesScreen` | — | MenuScreen |
| `MateriaInterna` | RootNavigator (stack) | `MateriaInternaScreen` | nenhum — lê `state.selectedMateriaId` | MateriasScreen (toque num card), HomeScreen (toque numa linha de "Médias por matéria") |
| `Menu` | RootNavigator (stack), `transparentModal` | `MenuScreen` | — | `AppHeader` (ícone hambúrguer) em qualquer tela sem `showBack` |

## Observação sobre `MateriaInterna`

Diferente do padrão comum de React Navigation (passar o id via `route.params`), esta rota não recebe parâmetros — a matéria selecionada é lida do estado global (`state.selectedMateriaId`), setado antes da navegação via `setSelectedMateria(id)`. Isso é consistente com o resto do app (que já centraliza tudo no contexto), mas significa que **a tela não pode ser aberta diretamente por um deep link** sem antes popular esse campo do estado. Nenhuma mudança feita a isso nesta funcionalidade — documentado apenas como comportamento existente.

## Rotas sem tela própria (ainda)

Nenhuma rota nova foi criada por esta funcionalidade — o Perfil Educacional inteiro (onboarding + edição) acontece dentro de telas e modais já existentes (`OnboardingScreen`, `ConfiguracoesScreen`), sem novas entradas no `RootNavigator`.
