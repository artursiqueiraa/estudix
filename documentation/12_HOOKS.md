# 12 — Hooks

## Hooks customizados existentes

O projeto tem **um único hook customizado**:

### `useEstudix()`

**Arquivo:** `src/context/EstudixContext.js`

```js
export function useEstudix() {
  const ctx = useContext(EstudixContext);
  if (!ctx) throw new Error('useEstudix deve ser usado dentro de EstudixProvider');
  return ctx;
}
```

- **Objetivo:** dar acesso ao estado global e a todas as ações do app a partir de qualquer tela ou componente.
- **Parâmetros:** nenhum.
- **Retorno:** o objeto `value` inteiro do `EstudixContext.Provider` — `state` + todas as funções de mutação/leitura documentadas em [07_CONTEXT.md](./07_CONTEXT.md).
- **Guarda de segurança:** lança erro explícito se chamado fora de um `EstudixProvider`, em vez de retornar `undefined` silenciosamente — evita bugs confusos de "propriedade de undefined".
- **Quem chama:** todas as telas (`src/screens/*.js`), sem exceção.
- **Complexidade:** O(1), é só um `useContext`.
- **Possível melhoria:** hoje devolve o contexto inteiro (mais de 40 propriedades) para qualquer consumidor, mesmo que a tela só precise de 2 ou 3 — combinado com o fato de o contexto ser único (ver [09_STATE.md](./09_STATE.md)), isso significa que não há como uma tela "assinar" só a fatia de estado que le importa. Dividir em hooks mais específicos (`useTimer()`, `useMaterias()`...) é uma das recomendações dos relatórios de arquitetura anteriores, ainda não implementada.

## Hooks de bibliotecas externas usados no projeto

Não são hooks customizados do Estudix, mas aparecem com frequência e vale registrar onde:

| Hook | Biblioteca | Uso típico |
|---|---|---|
| `useSafeAreaInsets()` | react-native-safe-area-context | padding seguro em quase toda tela |
| `useNavigation()` | @react-navigation/native | navegação imperativa dentro de uma tela |
| `useFocusEffect()` | @react-navigation/native | recalcular dados ao focar a tela (ex.: `HomeScreen` força atualização de métricas) |
| `useFonts()` | @expo-google-fonts/* | carregamento das fontes em `App.js` |

## Hooks planejados, ainda não implementados

Os relatórios de arquitetura anteriores propõem uma futura pasta `src/hooks/` com hooks finos combinando serviços puros (ver [04_SERVICES.md](./04_SERVICES.md)) com o estado do contexto — por exemplo `useRecommendations()`, `useInsights()`, `useStudyPlan()`. Nenhum desses existe hoje; nada no projeto os importa.
