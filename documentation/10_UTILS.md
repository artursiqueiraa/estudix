# 10 — Utilitários

Todas as funções utilitárias do app vivem no topo de `src/context/EstudixContext.js` (não há `src/utils/` separado). São funções puras, exportadas individualmente, e reaproveitadas tanto pelo contexto quanto diretamente pelas telas.

| Função | Parâmetros | Retorno | Objetivo | Complexidade |
|---|---|---|---|---|
| `todayStr(plusDays = 0)` | dias a somar (pode ser negativo) | string `YYYY-MM-DD` | data de hoje ± N dias, no fuso local | O(1) |
| `uid()` | — | number | id "único o suficiente" (timestamp + aleatório) — não é um UUID real, mas colisão é praticamente impossível no uso do app | O(1) |
| `pad(n)` | number | string | zero à esquerda para 2 dígitos (`5` → `"05"`) | O(1) |
| `calcularMedia(notas, materiaId)` | array de notas, id da matéria | string com 1 casa decimal | média das notas de uma matéria | O(n) no total de notas |
| `mediaBadge(avg)` | número | `{ label, bg, color }` | badge visual por faixa de média (≥8 excelente, ≥6 indo bem, abaixo precisa de atenção) | O(1) |
| `formatRelativeDate(ts)` | timestamp (ms) | string ("Agora mesmo", "3h atrás"...) | data relativa amigável, usado em Anotações | O(1) |
| `formatDate(isoStr)` | string `YYYY-MM-DD` | string "13 de julho de 2026" | data absoluta em pt-BR | O(1) |
| `getGreeting()` | — | "Bom dia"/"Boa tarde"/"Boa noite" | saudação por horário do dispositivo | O(1) |
| `getUnlockedAchievements(timer)` | objeto `timer` do estado | array de conquistas desbloqueadas | filtra `ACHIEVEMENTS` pelos critérios de cada uma | O(k), k = nº de conquistas (5, fixo) |

## Constantes exportadas (não são funções, mas vivem no mesmo arquivo)

| Constante | Conteúdo | Usada em |
|---|---|---|
| `ACHIEVEMENTS` | 5 conquistas fixas com função `test` | HomeScreen |
| `MATERIA_COLORS` / `MATERIA_ICONS` | paletas cíclicas para novas matérias | `saveMateria` |
| `EDUCATION_LEVELS` *(novo)* | 10 níveis de escolaridade | OnboardingScreen, ConfiguracoesScreen |
| `GOALS` *(novo)* | 6 objetivos de estudo | OnboardingScreen, ConfiguracoesScreen |
| `DIFFICULTIES` *(novo)* | 6 dificuldades autorreportadas | ConfiguracoesScreen |
| `STUDY_METHODS` *(novo)* | 5 métodos de estudo preferidos | ConfiguracoesScreen |

**Possíveis melhorias identificadas (não aplicadas, fora do escopo desta funcionalidade):**
- `uid()` não prefixa o id por tipo de entidade (só `saveMateria` usa `mat-${uid()}`) — inconsistência pré-existente, documentada também em [03_DATABASE.md](./03_DATABASE.md).
- As quatro novas constantes de Perfil Educacional hoje vivem junto das demais no `EstudixContext.js`. Se o catálogo de disciplinas (`src/data/`) for implementado no futuro, faz sentido mover essas constantes de catálogo estático para lá também, por consistência — não movido agora para não misturar essa funcionalidade com uma reorganização de arquivos sem necessidade imediata.
