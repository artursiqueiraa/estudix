# 01 — Arquitetura

## Visão geral

O Estudix é um aplicativo **100% client-side** construído com **Expo SDK 57 / React Native 0.86 / React 19**. Não existe backend, não existe API remota, não existe banco de dados relacional e não existe autenticação real — apenas um nome de exibição local. Todo o estado do usuário é mantido em memória via **Context API** e persistido como um único documento JSON no `AsyncStorage` do dispositivo.

```mermaid
flowchart TB
    subgraph Dispositivo
        UI[Telas — src/screens] --> CTX[EstudixContext]
        COMP[Componentes — src/components] --> UI
        CTX --> AS[(AsyncStorage\n@Estudix:state)]
        CTX --> NOTIF[lib/notifications.js\nexpo-notifications]
        CTX --> FS[expo-file-system\nBackup JSON]
        NAV[React Navigation\nStack + Bottom Tabs] --> UI
    end
```

## Por que essa arquitetura

O app nasceu como protótipo web ("StudyFlow") portado para Expo, priorizando velocidade de entrega e simplicidade sobre separação em camadas. Isso é uma escolha deliberada e válida para o estágio atual do projeto — não é um defeito a ser corrigido às pressas.

## Princípios seguidos neste projeto

1. **Reutilizar antes de criar.** Antes de qualquer componente, hook, função ou constante nova, verificar se já existe algo equivalente (ex.: `ChipSelector` foi criado uma única vez e reaproveitado no Onboarding e em Configurações, em vez de duplicar JSX de chips nas duas telas).
2. **Simplicidade sobre abstração prematura.** Sem camada de serviços, sem gerenciador de estado externo (Redux/Zustand) e sem TypeScript — o Context API puro ainda é suficiente para o tamanho atual do app.
3. **Persistência única e simples.** Um só documento JSON, uma só chave de armazenamento, compatibilidade retroativa feita com checagens explícitas (`=== undefined`) em vez de um sistema de migração formal.
4. **Mudanças incrementais.** Funcionalidades novas estendem estruturas existentes (ex.: `state.settings` ganhou os campos do Perfil Educacional em vez de nascer um novo slice de estado) sempre que isso não sacrificar clareza.

## Camadas do app

| Camada | Onde vive | Responsabilidade |
|---|---|---|
| Apresentação | `src/screens/`, `src/components/` | Renderização e interação do usuário |
| Navegação | `src/navigation/` | Roteamento entre telas (stack + tabs) |
| Estado + regra de negócio | `src/context/EstudixContext.js` | Único ponto de verdade do app: estado, mutações, persistência, notificações, backup |
| Design system | `src/theme/` | Cores, tipografia, espaçamento, sombra |
| Infraestrutura local | `src/lib/notifications.js` | Notificações locais (sem servidor push) |

Não existe hoje uma camada de **serviços** (`src/services/`) separada da camada de estado — ver [04_SERVICES.md](./04_SERVICES.md) para o detalhamento dessa lacuna e o que os relatórios de arquitetura anteriores recomendam para quando o catálogo de disciplinas e o plano de estudos automático forem implementados.

## Estado atual da implementação

| Funcionalidade | Status |
|---|---|
| App base (matérias, notas, checklist, flashcards SM-2, anotações, calendário, Pomodoro, conquistas) | ✅ Implementado |
| Perfil Educacional (nível, objetivo, dificuldades, método, meta semanal) | ✅ Implementado — ver [15_CHANGELOG.md](./15_CHANGELOG.md) |
| Catálogo de disciplinas, cadastro inteligente, recomendações, plano de estudos automático, dashboard inteligente, IA | ⏳ Analisado e planejado, não implementado (ver relatórios de arquitetura e produto anteriores) |

## Documentos relacionados

- [02_FOLDER_STRUCTURE.md](./02_FOLDER_STRUCTURE.md) — o que existe em cada pasta
- [03_DATABASE.md](./03_DATABASE.md) — modelo de persistência
- [07_CONTEXT.md](./07_CONTEXT.md) — detalhamento do `EstudixContext`
- [13_DATA_FLOW.md](./13_DATA_FLOW.md) — fluxo de dados ponta a ponta
