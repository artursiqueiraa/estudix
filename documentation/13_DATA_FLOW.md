# 13 — Fluxo de Dados

Padrão geral, presente em toda ação do app:

```
Usuário → Tela → Context (ação) → [Serviço externo opcional] → Persistência (debounce) → Re-render
```

## Fluxo genérico

```mermaid
flowchart LR
    U[Usuário toca/digita] --> S[Tela\nchama função do useEstudix]
    S --> C["Context\ndispatchUpdate(updater)"]
    C --> R["setState — React re-renderiza\ntodo consumidor de useEstudix"]
    C --> D["saveStore()\ndebounce 1000ms"]
    D --> A[(AsyncStorage)]
```

## Fluxo 1 — Completar o Onboarding *(inclui o Perfil Educacional novo)*

```mermaid
sequenceDiagram
    actor U as Usuário
    participant O as OnboardingScreen
    participant Ctx as EstudixContext
    participant AS as AsyncStorage

    U->>O: digita nome, toca "Continuar"
    O->>O: step = 1 (estado local, nada persistido)
    U->>O: toca nível + objetivo (ChipSelector)
    O->>O: educationLevel/goal em estado local
    U->>O: toca "Continuar", digita matéria, toca "Começar a estudar"
    O->>Ctx: saveMateria(materiaName)
    Ctx->>Ctx: dispatchUpdate — adiciona matéria
    O->>Ctx: completeOnboarding(name, educationLevel, goal)
    Ctx->>Ctx: dispatchUpdate — settings.userName/educationLevel/goal/onboarded=true
    Ctx-->>AS: saveStore() agenda gravação (debounce)
    Note over O: App.js detecta settings.onboarded===true<br/>e desmonta o Onboarding, monta o RootNavigator
```

## Fluxo 2 — Editar Perfil de Estudo em Configurações

```mermaid
sequenceDiagram
    actor U as Usuário
    participant Cfg as ConfiguracoesScreen
    participant Ctx as EstudixContext
    participant AS as AsyncStorage

    U->>Cfg: toca "Perfil de Estudo"
    Cfg->>Cfg: profileModalVisible = true (estado local)
    U->>Cfg: toca uma dificuldade (ChipSelector, multi)
    Cfg->>Ctx: toggleDifficulty(id)
    Ctx->>Ctx: dispatchUpdate — adiciona/remove id do array
    Ctx-->>AS: saveStore() agenda gravação (debounce 1000ms)
    Note over Cfg: cada toque em qualquer chip do modal<br/>grava direto — não há botão "Salvar" intermediário
    U->>Cfg: toca "Concluir"
    Cfg->>Cfg: profileModalVisible = false
```

## Fluxo 3 — Sessão de Foco (Pomodoro) concluída

```mermaid
sequenceDiagram
    participant F as FocoScreen
    participant Ctx as EstudixContext
    participant N as lib/notifications.js
    participant AS as AsyncStorage

    F->>F: setInterval decrementa remainingSeconds a cada 1s
    F->>Ctx: updateTimer({ remainingSeconds })
    Ctx->>Ctx: dispatchVolatileUpdate — NÃO persiste (evita debounce a cada segundo)
    Note over F,Ctx: quando remainingSeconds chega a 0
    F->>Ctx: finishTimerSession()
    Ctx->>Ctx: calcula minutos estudados, atualiza streak/estatísticas
    Ctx->>Ctx: dispatchUpdate — ESSA gravação é persistida
    Ctx-->>AS: saveStore() agenda gravação (debounce)
    F->>N: (ao iniciar a próxima sessão) scheduleFocusEndNotification()
```

## Carregamento inicial do app

```mermaid
sequenceDiagram
    participant App as App.js
    participant Ctx as EstudixContext
    participant AS as AsyncStorage

    App->>Ctx: monta EstudixProvider
    Ctx->>AS: getItem('@Estudix:state')
    AS-->>Ctx: JSON salvo (ou nada, na primeira instalação)
    Ctx->>Ctx: aplica compatibilidade retroativa\n(zera contadores do dia/semana se virou o dia,\npreenche campos novos com default se ausentes)
    Ctx->>Ctx: isStoreLoaded = true
    App->>App: decide entre Onboarding ou RootNavigator
```
