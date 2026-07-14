# 11 — Bibliotecas

Extraído de `package.json`. Nenhuma dependência foi adicionada ou removida nesta funcionalidade — o Perfil Educacional foi implementado inteiramente com o que já estava instalado.

| Biblioteca | Versão | Finalidade | Onde é usada | Alternativas | Pode ser removida hoje? |
|---|---|---|---|---|---|
| `expo` | ~57.0.2 | Runtime e toolchain do app | Todo o projeto | — (base do projeto) | Não |
| `react` / `react-dom` | 19.2.3 | Biblioteca de UI | Todo o projeto | — | Não |
| `react-native` | 0.86.0 | Runtime mobile | Todo o projeto | — | Não |
| `react-native-web` | ^0.21.2 | Permite rodar as mesmas telas no navegador (`expo start --web`) | Build web | — | Sim, se o suporte web for descontinuado |
| `@react-navigation/native` | ^7.3.7 | Núcleo de navegação | `src/navigation/` | React Router (não nativo) | Não |
| `@react-navigation/native-stack` | ^7.17.9 | Navegador em pilha | `RootNavigator` | — | Não |
| `@react-navigation/bottom-tabs` | ^7.18.7 | Navegador em abas | `BottomTabNavigator` | — | Não |
| `react-native-screens` | 4.25.2 | Otimização nativa de telas (requerido pelo React Navigation) | implícito | — | Não |
| `react-native-safe-area-context` | ~5.7.0 | Insets de área segura (notch, home indicator) | Quase todas as telas | — | Não |
| `react-native-gesture-handler` | ~2.32.0 | Gestos nativos (requerido pelo React Navigation) | implícito | — | Não |
| `react-native-reanimated` | 4.5.0 | Animações de alta performance | plugin do Babel; suporte a gestos do stack | — | Não (dependência transitiva do stack de navegação) |
| `react-native-svg` | 15.15.4 | Desenho vetorial | `FocoScreen` (anel do timer), `GradeChart` | `react-native-skia` | Não, sem substituir esses dois componentes |
| `@react-native-async-storage/async-storage` | 2.2.0 | Persistência local chave-valor | `EstudixContext` (é o "banco de dados" do app) | `expo-sqlite`, `react-native-mmkv` | Não, é o mecanismo de persistência central |
| `expo-file-system` | ~57.0.0 | Ler/escrever arquivos no dispositivo | Export/import de backup | — | Sim, se o backup manual for descontinuado |
| `expo-sharing` | ~57.0.2 | Compartilhar arquivos (share sheet nativa) | Export de backup | — | Sim, junto com `expo-file-system` |
| `expo-document-picker` | ~57.0.0 | Selecionar arquivo do dispositivo | Import de backup | — | Sim, junto com o par acima |
| `expo-notifications` | ~57.0.3 | Notificações locais | `src/lib/notifications.js` | — | Sim, mas removeria lembretes de Pomodoro/calendário |
| `expo-haptics` | ^57.0.0 | Vibração tátil em interações | `EstudixContext` (quase toda ação do usuário) | — | Sim, é só refinamento de UX |
| `expo-font` | ~57.0.0 | Carregamento de fontes customizadas | `App.js` | — | Não, sem trocar a fonte do app inteiro |
| `@expo-google-fonts/inter` | ^0.4.2 | Fonte sans-serif do app | `theme/index.js` | qualquer outra fonte do Google Fonts | Sim, trocando a identidade visual |
| `@expo-google-fonts/playfair-display` | ^0.4.2 | Fonte serifada de título | `theme/index.js` | idem acima | Sim, trocando a identidade visual |
| `@expo/vector-icons` | ^15.0.2 | Ícones (Ionicons) | Praticamente todos os componentes/telas | `react-native-vector-icons` (base equivalente) | Não, uso extensivo |
| `expo-status-bar` | ~57.0.0 | Controle da status bar | `App.js` | — | Não, trivial e necessário |
| `@react-native-community/datetimepicker` | 9.1.0 | Seletor de data nativo | `CalendarioScreen` | um date picker próprio em JS | Sim, mas perderia a UX nativa de calendário |

## Devdependencies

| Biblioteca | Finalidade |
|---|---|
| `babel-preset-expo` | Preset de build do Expo (usado em `babel.config.js`) |
| `@expo/ngrok` | Túnel para testar em dispositivo físico fora da mesma rede |

## Observação sobre esta funcionalidade

O componente `ChipSelector` e as novas telas/campos do Perfil Educacional usam apenas primitivas já presentes no projeto (`View`, `Text`, `TouchableOpacity`, `ScrollView` do React Native, mais os tokens de `src/theme`) — nenhuma biblioteca de formulário, seletor ou UI-kit externo foi adicionada.
