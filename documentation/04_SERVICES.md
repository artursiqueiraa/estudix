# 04 — Serviços

## Estado atual: não existe uma camada de serviços

O projeto **não tem** uma pasta `src/services/`. Toda a lógica que, em uma arquitetura maior, viveria em serviços (cálculo de médias, regras do Pomodoro, repetição espaçada, agendamento de notificações) está hoje distribuída entre:

1. **`src/context/EstudixContext.js`** — concentra a maior parte: cálculo de médias (`calcularMedia`), repetição espaçada SM-2 (`reviewFlashcard`), regras de sessão do Pomodoro (`getSessionDuration`, `finishTimerSession`), formatação de datas (`formatDate`, `formatRelativeDate`, `todayStr`).
2. **`src/lib/notifications.js`** — a única coisa que já se parece com um serviço de verdade: funções puras de agendamento/cancelamento de notificação, sem estado próprio, importadas pelo contexto e pelas telas que precisam.

Isso é adequado ao tamanho atual do app. Não é overengineering evitar uma camada extra quando ela não paga o próprio custo ainda.

## Por que isso vai precisar mudar (e ainda não mudou)

Os relatórios de arquitetura anteriores identificaram que funcionalidades futuras — catálogo de disciplinas, recomendações entre matérias, plano de estudos automático, insights do dashboard, preparação para IA — exigem lógica pura, sem efeito colateral (sem `Haptics`, sem `Toast`, sem `AsyncStorage` dentro da função), para poder ser testada isoladamente e reaproveitada. Esses serviços **ainda não foram implementados**:

| Serviço planejado | Responsabilidade | Status |
|---|---|---|
| `catalogService` | Acesso somente-leitura ao catálogo de disciplinas (busca por slug, matching por nome) | Não implementado |
| `recommendationEngine` | Cruza matérias do usuário com o catálogo para recomendações | Não implementado |
| `insightsEngine` | Deriva os cards do dashboard inteligente | Não implementado |
| `studyPlanGenerator` | Heurística de geração automática de cronograma | Não implementado |
| `pomodoroStatsService` | Agregações sobre `focusSessions` extraídas do contexto | Não implementado |
| `ai/AIProvider` | Ponto de extensão para IA futura | Não implementado |

## `lib/notifications.js` — o serviço que já existe

**Entradas / saídas de cada função:**

| Função | Entrada | Saída | Efeito colateral |
|---|---|---|---|
| `initNotifications()` | — | `Promise<void>` | Cria canal de notificação Android |
| `scheduleFocusEndNotification(seconds, title, body)` | segundos até disparar, título, corpo | `Promise<string\|null>` (id da notificação) | Agenda notificação local; pede permissão se necessário |
| `cancelNotification(id)` | id retornado pelo agendamento | `Promise<void>` | Cancela notificação agendada |
| `scheduleEventReminder(event)` | `{ id, title, description, date }` | `Promise<string\|null>` | Agenda lembrete às 8h do dia do evento, se ainda não passou |

**Quem consome:** `EstudixContext.js` (eventos de calendário) e `FocoScreen.js` (fim de sessão Pomodoro).

Nenhuma dessas funções acessa `AsyncStorage` ou o estado do app — é o único ponto do código hoje que já segue o padrão de "serviço puro" recomendado para o que vem a seguir.
