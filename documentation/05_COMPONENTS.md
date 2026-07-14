# 05 — Componentes

Componentes em `src/components/` são reutilizáveis e não têm rota própria. Todos são componentes de apresentação (sem acesso direto ao `AsyncStorage`); a maioria consome dados via props vindas de uma tela que já chamou `useEstudix()`.

---

## AppHeader

**Arquivo:** `src/components/AppHeader.js`
**Responsabilidade:** cabeçalho comum a quase todas as telas — botão de menu (ou "Voltar") à esquerda, ícone de notificações à direita.

| Prop | Tipo | Obrigatória | Descrição |
|---|---|---|---|
| `navigation` | objeto do React Navigation | sim | usado para `navigate`/`goBack` |
| `showBack` | boolean | não (default `false`) | troca o hambúrguer por um botão "Voltar" |
| `onBack` | função | não | sobrescreve a ação padrão de voltar |

**Estado:** nenhum (usa `useSafeAreaInsets` apenas para padding).
**Eventos:** toque no menu → `navigation.navigate('Menu')`; toque em notificações → navega para a aba Anotações; toque em voltar → `navigation.goBack()` ou volta para Home se não houver histórico.
**Usado em:** Home, Matérias, Foco, Anotações, Calendário, Configurações.

---

## ChipSelector *(novo)*

**Arquivo:** `src/components/ChipSelector.js`
**Responsabilidade:** grade de opções em formato de pílula, com seleção única ou múltipla — decide sozinho qual modo usar observando o tipo do valor recebido.

| Prop | Tipo | Descrição |
|---|---|---|
| `options` | `{ id: string, label: string }[]` | lista de opções a renderizar |
| `selected` | `string` \| `string[]` \| `null` | valor(es) atualmente selecionado(s) — string para seleção única, array para múltipla |
| `onToggle` | `(id: string) => void` | chamado a cada toque num chip; a decisão de substituir ou alternar fica a cargo de quem consome |

**Estado:** nenhum — é 100% controlado pelo componente pai.
**Por que existe:** antes deste componente, a UI de "chips selecionáveis" estava duplicada em pelo menos três telas (`AnotacoesScreen`, `CalendarioScreen`, `FocoScreen`) com estilos quase idênticos. Em vez de duplicar de novo para o Perfil Educacional, este componente foi extraído e reaproveitado no `OnboardingScreen` (nível, objetivo) e no `ConfiguracoesScreen` (nível, objetivo, dificuldades, método).
**Usado em:** `OnboardingScreen.js`, `ConfiguracoesScreen.js`.
**Melhoria futura possível:** migrar os chips já existentes em `AnotacoesScreen`/`CalendarioScreen`/`FocoScreen` para usar este componente também, removendo a duplicação remanescente — não feito nesta funcionalidade para manter o escopo da mudança pequeno (ver [15_CHANGELOG.md](./15_CHANGELOG.md)).

---

## ConfirmModal

**Arquivo:** `src/components/ConfirmModal.js`
**Responsabilidade:** substitui o `Alert.alert` nativo por um diálogo com a cara do app. É montado uma única vez, globalmente, dentro do `EstudixProvider`, e controlado via `useEstudix().showConfirm(...)`.

| Prop | Tipo | Descrição |
|---|---|---|
| `visible` | boolean | controla exibição |
| `title`, `message` | string | conteúdo textual |
| `confirmLabel`, `cancelLabel` | string | rótulos dos botões (com defaults) |
| `hideCancel` | boolean | esconde o botão cancelar (para avisos informativos) |
| `destructive` | boolean | pinta o botão de confirmar em vermelho |
| `onCancel`, `onConfirmPress` | função | callbacks |

**Quem consome:** qualquer tela, via `showConfirm` do contexto (ex.: confirmação de "Limpar Todos os Dados" em `ConfiguracoesScreen`).

---

## FAB (Floating Action Button)

**Arquivo:** `src/components/FAB.js`
**Responsabilidade:** botão flutuante de ação primária, com rótulo diferente por tela (mapa fixo `FAB_LABELS`). Não renderiza nada (`return null`) se a tela atual não estiver no mapa.

| Prop | Tipo | Descrição |
|---|---|---|
| `currentScreen` | string | nome da rota atual — decide o rótulo |
| `onPress` | função | ação ao tocar |
| `customLabel` | string | sobrescreve o rótulo do mapa |

**Usado em:** Matérias, Matéria Interna, Calendário, Anotações.

---

## GradeChart

**Arquivo:** `src/components/GradeChart.js`
**Responsabilidade:** gráfico de barras (SVG puro, via `react-native-svg`) da evolução das notas de uma matéria, na ordem em que foram cadastradas. Retorna `null` se houver menos de 2 notas (gráfico de 1 ponto não é útil).

| Prop | Tipo | Descrição |
|---|---|---|
| `notas` | array de notas da matéria | dados a plotar |

**Detalhe de implementação:** desenha uma linha pontilhada na altura de "média 6.0" e colore cada barra de acordo com o valor (verde/laranja). Sem estado, sem dependência do contexto — puramente derivado das props.
**Usado em:** `MateriaInternaScreen.js` (aba Notas).

---

## Toast

**Arquivo:** `src/components/Toast.js`
**Responsabilidade:** feedback textual rápido e não bloqueante (2.6s), substitui alertas nativos para confirmações simples ("Matéria criada", "Backup restaurado com sucesso!"). Montado globalmente dentro do `EstudixProvider`, controlado via `useEstudix().showToast(msg)`.

| Prop | Tipo | Descrição |
|---|---|---|
| `message` | string \| null | texto a exibir; `null` esconde o toast |

**Estado:** nenhum local — o timer de auto-esconder vive no `EstudixContext`, não no componente.
