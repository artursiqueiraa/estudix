// ============================================================
//  ESTUDIX — EstudixContext (Fase 4: Backup, Calendário & CRUD)
// ============================================================

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import { scheduleEventReminder, cancelNotification } from '../lib/notifications';

const STORE_KEY = '@Estudix:state';

// ─── Utilitários ──────────────────────────────────────────

export function todayStr(plusDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + plusDays);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function uid() {
  return Date.now() + Math.floor(Math.random() * 10000);
}

export function pad(n) {
  return String(n).padStart(2, '0');
}

export function calcularMedia(notas, materiaId) {
  const mNotas = notas.filter(n => n.materiaId === materiaId);
  if (!mNotas.length) return '0.0';
  return (mNotas.reduce((a, n) => a + n.value, 0) / mNotas.length).toFixed(1);
}

export function mediaBadge(avg) {
  if (avg >= 8) return { label: 'Excelente! 🎉', bg: '#DCE8D4', color: '#4F6B45' };
  if (avg >= 6) return { label: 'Indo bem 👍',   bg: '#EAD9B8', color: '#8A6A2F' };
  return          { label: 'Precisa de atenção ⚠️', bg: '#F3DACB', color: '#A24E27' };
}

export function formatRelativeDate(ts) {
  const diff    = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1)  return 'Agora mesmo';
  if (minutes < 60) return `${minutes} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  if (days === 1)   return 'Ontem';
  return `${days} dias atrás`;
}

export function formatDate(isoStr) {
  if (!isoStr) return '';
  const [y, m, d] = isoStr.split('-');
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${d} de ${months[parseInt(m) - 1]} de ${y}`;
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ─── Conquistas ────────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_session', label: 'Primeira Sessão', icon: 'flag-outline',   test: (t) => t.completedSessions >= 1  },
  { id: 'ten_sessions',  label: '10 Sessões',       icon: 'ribbon-outline', test: (t) => t.completedSessions >= 10 },
  { id: 'streak_3',      label: '3 Dias Seguidos',  icon: 'flame-outline',  test: (t) => t.longestStreak >= 3      },
  { id: 'streak_7',      label: 'Semana Completa',  icon: 'trophy-outline', test: (t) => t.longestStreak >= 7      },
  { id: 'marathon',      label: 'Foco de 50min+',   icon: 'medal-outline',  test: (t) => t.longestSession >= 50    },
];

export function getUnlockedAchievements(timer) {
  return ACHIEVEMENTS.filter(a => a.test(timer));
}

export const MATERIA_COLORS = [
  '#1E3A5F','#C97B4A','#5B7F4F','#7A5CAE',
  '#A23B3B','#2A7A8A','#8A6A2F','#4A7A5F',
];
export const MATERIA_ICONS = [
  'book-outline','flask-outline','calculator-outline','earth-outline',
  'language-outline','musical-notes-outline','color-palette-outline',
  'code-slash-outline','leaf-outline','fitness-outline',
];

// ─── Perfil Educacional ───────────────────────────────────────
export const EDUCATION_LEVELS = [
  { id: 'fundamental1', label: 'Fundamental I' },
  { id: 'fundamental2', label: 'Fundamental II' },
  { id: 'medio',        label: 'Ensino Médio' },
  { id: 'tecnico',      label: 'Técnico' },
  { id: 'faculdade',    label: 'Faculdade' },
  { id: 'pos',          label: 'Pós-graduação' },
  { id: 'concurso',     label: 'Concurso' },
  { id: 'enem',         label: 'ENEM' },
  { id: 'vestibular',   label: 'Vestibular' },
  { id: 'outro',        label: 'Outro' },
];

export const GOALS = [
  { id: 'enem',       label: 'Passar no ENEM' },
  { id: 'vestibular', label: 'Vestibular' },
  { id: 'concurso',   label: 'Concurso público' },
  { id: 'faculdade',  label: 'Ir bem na faculdade' },
  { id: 'reforco',    label: 'Reforço escolar' },
  { id: 'outro',      label: 'Outro objetivo' },
];

export const DIFFICULTIES = [
  { id: 'concentracao', label: 'Manter o foco' },
  { id: 'tempo',         label: 'Falta de tempo' },
  { id: 'ansiedade',     label: 'Ansiedade' },
  { id: 'base-fraca',    label: 'Base fraca' },
  { id: 'organizacao',   label: 'Organização' },
  { id: 'memorizacao',   label: 'Memorização' },
];

export const STUDY_METHODS = [
  { id: 'leitura',    label: 'Leitura' },
  { id: 'exercicios', label: 'Exercícios' },
  { id: 'resumo',     label: 'Resumos' },
  { id: 'video',      label: 'Vídeo-aulas' },
  { id: 'misto',      label: 'Um pouco de tudo' },
];

// ─── Estado Inicial Default ─────────────────────────────────
function buildInitialState() {
  return {
    settings: {
      userName:      'Estudante',
      focusMin:      25,
      shortBreakMin: 5,
      longBreakMin:  15,
      onboarded:     false,
      // Perfil Educacional
      educationLevel:    null,
      goal:              null,
      difficulties:      [],
      studyMethod:       null,
      weeklyGoalMinutes: 300,
    },
    materias: [],
    notas: [],
    flashcards: [],
    checklistCategories: [],
    anotacoes: [],
    focusSessions: [], // { id, materiaId, minutes, date }
    calendar: {
      viewYear:        new Date().getFullYear(),
      viewMonth:       new Date().getMonth(),
      events:          [],
      calSelectedDate: todayStr(),
    },
    timer: {
      sessionType:      'focus', // 'focus' | 'short_break' | 'long_break'
      remainingSeconds: 25 * 60,
      totalSeconds:     25 * 60,
      isRunning:        false,
      sessionCount:     0,
      cyclePosition:    0,
      materiaId:        null, // matéria sendo estudada nesta sessão
      // Estatísticas Avançadas
      lastStudyDate:    todayStr(),
      totalMinutesToday: 0,
      totalMinutesWeek:  0,
      completedSessions: 0,
      longestSession:    0,
      currentStreak:     0,
      longestStreak:     0,
      lastSessionDate:   null, // último dia em que uma sessão de foco foi concluída
    },
    selectedMateriaId: null,
    notesFilter:       'all',
  };
}

const EstudixContext = createContext(null);

export function EstudixProvider({ children }) {
  const [state, setState] = useState(buildInitialState);
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);
  const saveTimeoutRef = useRef(null); // Ref para o Debounce

  // ── Toast e Confirmação (substituem Alert.alert nativo) ─────
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2600);
  };

  const [confirmDialog, setConfirmDialog] = useState(null);

  const showConfirm = ({ title, message, confirmLabel, cancelLabel, hideCancel, destructive, onConfirm }) => {
    setConfirmDialog({ title, message, confirmLabel, cancelLabel, hideCancel, destructive, onConfirm });
  };
  const closeConfirm = () => setConfirmDialog(null);

  // ── Carregamento Inicial (AsyncStorage) ────────────────────
  useEffect(() => {
    async function loadStore() {
      try {
        // Inicializando AsyncStorage
        const stored = await AsyncStorage.getItem(STORE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          
          // Tratamento de virada de dia e semana
          const today = todayStr();
          if (parsed.timer && parsed.timer.lastStudyDate !== today) {
            parsed.timer.totalMinutesToday = 0; // zera contador diário
            
            // Lógica simples de zerar semana (idealmente compararia dias da semana, aqui se for > 7 dias zera)
            const lastDate = new Date(parsed.timer.lastStudyDate);
            const currDate = new Date(today);
            const diffDays = Math.floor((currDate - lastDate) / (1000 * 60 * 60 * 24));
            if (diffDays >= 7 || currDate.getDay() < lastDate.getDay()) {
              parsed.timer.totalMinutesWeek = 0;
            }
            
            parsed.timer.lastStudyDate = today;
          }
          
          if (parsed.timer) {
            parsed.timer.isRunning = false;
            // Compatibilidade com backups salvos antes destes campos existirem
            if (parsed.timer.currentStreak === undefined)   parsed.timer.currentStreak = 0;
            if (parsed.timer.longestStreak === undefined)   parsed.timer.longestStreak = 0;
            if (parsed.timer.lastSessionDate === undefined) parsed.timer.lastSessionDate = null;
            if (parsed.timer.materiaId === undefined)       parsed.timer.materiaId = null;
          }
          if (parsed.focusSessions === undefined) parsed.focusSessions = [];

          // Backups salvos antes do onboarding existir não têm essa flag —
          // se já há matérias cadastradas, não faz sentido mostrar onboarding.
          if (parsed.settings && parsed.settings.onboarded === undefined) {
            parsed.settings.onboarded = (parsed.materias?.length || 0) > 0;
          }

          // Compatibilidade com backups salvos antes do Perfil Educacional existir
          if (parsed.settings) {
            if (parsed.settings.educationLevel === undefined)    parsed.settings.educationLevel = null;
            if (parsed.settings.goal === undefined)              parsed.settings.goal = null;
            if (parsed.settings.difficulties === undefined)      parsed.settings.difficulties = [];
            if (parsed.settings.studyMethod === undefined)       parsed.settings.studyMethod = null;
            if (parsed.settings.weeklyGoalMinutes === undefined) parsed.settings.weeklyGoalMinutes = 300;
          }

          setState(prev => ({ ...prev, ...parsed }));
        } else {
          // Se não existir dados, usar o initial state padrão
          console.log('Nenhum dado salvo encontrado. Iniciando estado padrão.');
        }
      } catch (e) {
        // Fallback Seguro
        console.error('Falha crítica ao ler o AsyncStorage. Carregando mock em memória.', e);
        showConfirm({
          title: 'Aviso',
          message: 'Ocorreu um problema ao ler seus dados antigos. O app foi iniciado em modo de segurança.',
          confirmLabel: 'Entendi',
          hideCancel: true,
          onConfirm: () => {},
        });
      } finally {
        setIsStoreLoaded(true);
      }
    }
    loadStore();
  }, []);

  // ── Engine de Persistência com Debounce ─────────────────────
  const saveStore = (newState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce de 1000ms para evitar spam no disco
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const toSave = { ...newState };
        if (toSave.timer) {
          toSave.timer = { ...toSave.timer, isRunning: false }; // Nunca salvar isRunning=true
        }
        await AsyncStorage.setItem(STORE_KEY, JSON.stringify(toSave));
      } catch (e) {
        console.error('Falha ao salvar no AsyncStorage (Debounce):', e);
      }
    }, 1000);
  };

  const dispatchUpdate = (updater) => {
    setState((prevState) => {
      const newState = typeof updater === 'function' ? updater(prevState) : { ...prevState, ...updater };
      saveStore(newState);
      return newState;
    });
  };

  const dispatchVolatileUpdate = (updater) => {
    // Usado APENAS para os ticks do timer (evita milhares de writes no disco via debounce)
    setState((prevState) => {
      return typeof updater === 'function' ? updater(prevState) : { ...prevState, ...updater };
    });
  };

  // ── Helpers de Estado ─────────────────────────────────────
  const updateNested = (key, partial) => {
    dispatchUpdate(prev => ({ ...prev, [key]: { ...prev[key], ...partial } }));
  };

  // ── Backup e Restauração (JSON via FileSystem) ────────────
  const exportData = async () => {
    try {
      const dataToExport = {
        settings: state.settings,
        materias: state.materias,
        notas: state.notas,
        checklistCategories: state.checklistCategories,
        flashcards: state.flashcards,
        anotacoes: state.anotacoes,
        calendar: state.calendar,
        timer: state.timer
      };
      
      const jsonStr = JSON.stringify(dataToExport, null, 2);
      const fileUri = FileSystem.documentDirectory + 'estudix_backup.json';
      
      await FileSystem.writeAsStringAsync(fileUri, jsonStr, { encoding: FileSystem.EncodingType.UTF8 });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { dialogTitle: 'Exportar Backup do Estudix' });
      } else {
        showToast('O compartilhamento não está disponível neste dispositivo.');
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      showToast('Ocorreu um erro ao exportar o backup.');
    }
  };

  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
      });
      
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }
      
      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
      
      const parsed = JSON.parse(fileContent);
      
      if (!parsed.settings || !parsed.materias) {
        showToast('Arquivo inválido: não parece ser um backup do Estudix.');
        return;
      }

      dispatchUpdate(prev => ({ ...prev, ...parsed }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast('Backup restaurado com sucesso!');

    } catch (error) {
      console.error('Erro ao importar:', error);
      showToast('Ocorreu um erro ao importar. Verifique se o arquivo está corrompido.');
    }
  };

  // ── Settings ──────────────────────────────────────────────
  const setUserName = (name) => {
    updateNested('settings', { userName: name });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const completeOnboarding = (name, educationLevel, goal) => {
    dispatchUpdate(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        userName:       name || prev.settings.userName,
        educationLevel: educationLevel || prev.settings.educationLevel,
        goal:           goal || prev.settings.goal,
        onboarded:      true,
      }
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const changeSetting = (type, delta) => {
    dispatchUpdate(prev => {
      const s = { ...prev.settings };
      if (type === 'focus')  s.focusMin          = Math.max(5,   Math.min(60,   s.focusMin + delta));
      if (type === 'short')  s.shortBreakMin      = Math.max(1,   Math.min(30,   s.shortBreakMin + delta));
      if (type === 'long')   s.longBreakMin       = Math.max(5,   Math.min(60,   s.longBreakMin + delta));
      if (type === 'weekly') s.weeklyGoalMinutes  = Math.max(60,  Math.min(1200, s.weeklyGoalMinutes + delta));
      return { ...prev, settings: s };
    });
    Haptics.selectionAsync();
  };

  // ── Perfil Educacional ───────────────────────────────────────
  const setEducationLevel = (id) => {
    updateNested('settings', { educationLevel: id });
    Haptics.selectionAsync();
  };

  const setGoal = (id) => {
    updateNested('settings', { goal: id });
    Haptics.selectionAsync();
  };

  const setStudyMethod = (id) => {
    updateNested('settings', { studyMethod: id });
    Haptics.selectionAsync();
  };

  const toggleDifficulty = (id) => {
    dispatchUpdate(prev => {
      const current = prev.settings.difficulties || [];
      const difficulties = current.includes(id)
        ? current.filter(d => d !== id)
        : [...current, id];
      return { ...prev, settings: { ...prev.settings, difficulties } };
    });
    Haptics.selectionAsync();
  };

  // ── Matérias ─────────────────────────────────────────────
  const saveMateria = (name, editingId = null) => {
    if (!name.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    dispatchUpdate(prev => {
      if (editingId) {
        return {
          ...prev,
          materias: prev.materias.map(m => m.id === editingId ? { ...m, name } : m)
        };
      }
      const color = MATERIA_COLORS[prev.materias.length % MATERIA_COLORS.length];
      const icon  = MATERIA_ICONS[prev.materias.length % MATERIA_ICONS.length];
      return {
        ...prev,
        materias: [...prev.materias, { id: `mat-${uid()}`, name, icon, color }],
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(editingId ? 'Matéria atualizada' : 'Matéria criada');
  };

  const deleteMateria = (id) => {
    dispatchUpdate(prev => ({
      ...prev,
      materias:            prev.materias.filter(m => m.id !== id),
      notas:               prev.notas.filter(n => n.materiaId !== id),
      flashcards:          prev.flashcards.filter(f => f.materiaId !== id),
      checklistCategories: prev.checklistCategories.filter(c => c.materiaId !== id),
      anotacoes:           prev.anotacoes.filter(a => a.materiaId !== id),
      calendar:            { ...prev.calendar, events: prev.calendar.events.filter(e => e.materiaId !== id) },
      selectedMateriaId:   prev.selectedMateriaId === id ? null : prev.selectedMateriaId
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showToast('Matéria excluída');
  };

  // ── Notas/Avaliações ─────────────────────────────────────
  const saveNota = (label, value, editingId = null) => {
    dispatchUpdate(prev => {
      if (editingId) {
        return {
          ...prev,
          notas: prev.notas.map(n =>
            n.id === editingId ? { ...n, label, value: parseFloat(value) || 0 } : n
          ),
        };
      }
      return {
        ...prev,
        notas: [...prev.notas, { id: uid(), materiaId: prev.selectedMateriaId, label, value: parseFloat(value) || 0 }],
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(editingId ? 'Avaliação atualizada' : 'Avaliação registrada');
  };

  const deleteNota = (id) => {
    dispatchUpdate(prev => ({ ...prev, notas: prev.notas.filter(n => n.id !== id) }));
    showToast('Avaliação excluída');
  };

  // ── Flashcards ────────────────────────────────────────────
  const toggleFlashcard = (id) => {
    dispatchUpdate(prev => ({
      ...prev,
      flashcards: prev.flashcards.map(f => f.id === id ? { ...f, flipped: !f.flipped } : f),
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const saveFlashcard = (question, answer, editingId = null) => {
    dispatchUpdate(prev => {
      if (editingId) {
         return {
           ...prev,
           flashcards: prev.flashcards.map(f => f.id === editingId ? { ...f, question, answer } : f)
         };
      }
      return {
        ...prev,
        flashcards: [...prev.flashcards, {
          id: uid(), materiaId: prev.selectedMateriaId, question, answer, flipped: false,
          // Repetição espaçada (SM-2 simplificado) — novo card já nasce "devendo" revisão
          easeFactor: 2.5, interval: 0, repetitions: 0, dueDate: todayStr(),
        }],
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(editingId ? 'Flashcard atualizado' : 'Flashcard criado');
  };

  const deleteFlashcard = (id) => {
    dispatchUpdate(prev => ({ ...prev, flashcards: prev.flashcards.filter(f => f.id !== id) }));
    showToast('Flashcard excluído');
  };

  // Avalia a resposta do usuário e recalcula a próxima data de revisão (SM-2 simplificado)
  const reviewFlashcard = (id, remembered) => {
    dispatchUpdate(prev => ({
      ...prev,
      flashcards: prev.flashcards.map(f => {
        if (f.id !== id) return f;
        const easeFactor  = f.easeFactor  ?? 2.5;
        const repetitions = f.repetitions ?? 0;
        const interval    = f.interval    ?? 0;

        if (!remembered) {
          return {
            ...f, flipped: false,
            repetitions: 0,
            interval: 1,
            easeFactor: Math.max(1.3, easeFactor - 0.2),
            dueDate: todayStr(1),
          };
        }

        const newRepetitions = repetitions + 1;
        let newInterval;
        if (newRepetitions === 1)      newInterval = 1;
        else if (newRepetitions === 2) newInterval = 6;
        else                           newInterval = Math.round(interval * easeFactor);

        return {
          ...f, flipped: false,
          repetitions: newRepetitions,
          interval: newInterval,
          easeFactor: Math.min(2.5, easeFactor + 0.1),
          dueDate: todayStr(newInterval),
        };
      }),
    }));
    Haptics.impactAsync(remembered ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
  };

  // ── Checklists ────────────────────────────────────────────
  const saveCategoryTitle = (title, editingId = null) => {
    dispatchUpdate(prev => {
      if (editingId) {
        return { ...prev, checklistCategories: prev.checklistCategories.map(c => c.id === editingId ? { ...c, title } : c) };
      }
      return { ...prev, checklistCategories: [...prev.checklistCategories, { id: uid(), materiaId: prev.selectedMateriaId, title, items: [] }] };
    });
  };

  const deleteCategory = (catId) => {
    dispatchUpdate(prev => ({ ...prev, checklistCategories: prev.checklistCategories.filter(c => c.id !== catId) }));
  };

  const saveChecklistItem = (text, catId, editingItemId = null) => {
    dispatchUpdate(prev => ({
      ...prev,
      checklistCategories: prev.checklistCategories.map(c => {
        if (c.id !== catId) return c;
        
        if (editingItemId) {
           return { ...c, items: c.items.map(i => i.id === editingItemId ? { ...i, text } : i) };
        }
        return { ...c, items: [...c.items, { id: uid(), text, done: false }] };
      }),
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleChecklistItem = (catId, itemId) => {
    dispatchUpdate(prev => ({
      ...prev,
      checklistCategories: prev.checklistCategories.map(c =>
        c.id === catId
          ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i) }
          : c
      ),
    }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const deleteChecklistItem = (catId, itemId) => {
     dispatchUpdate(prev => ({
       ...prev,
       checklistCategories: prev.checklistCategories.map(c => 
         c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c
       )
     }));
  }

  // ── Anotações ─────────────────────────────────────────────
  const saveAnotacao = (title, content, materiaId, editingId = null) => {
    dispatchUpdate(prev => {
       if (editingId) {
          return {
            ...prev,
            anotacoes: prev.anotacoes.map(a => a.id === editingId ? { ...a, title, content, materiaId, updatedAt: Date.now() } : a)
          }
       }
       return {
          ...prev,
          anotacoes: [{ id: uid(), title, content, materiaId, createdAt: Date.now(), updatedAt: Date.now() }, ...prev.anotacoes],
       };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(editingId ? 'Anotação atualizada' : 'Anotação criada');
  };

  const deleteAnotacao = (id) => {
    dispatchUpdate(prev => ({ ...prev, anotacoes: prev.anotacoes.filter(a => a.id !== id) }));
    showToast('Anotação excluída');
  };

  const setNotesFilter = (filterId) => dispatchUpdate({ notesFilter: filterId });

  // ── Calendário ────────────────────────────────────────────
  const saveEvent = (title, description, date, type, materiaId, editingId = null) => {
    const id = editingId || uid();
    const oldNotificationId = editingId
      ? state.calendar.events.find(e => e.id === editingId)?.notificationId
      : null;

    dispatchUpdate(prev => {
      const now = Date.now();
      if (editingId) {
        return {
          ...prev,
          calendar: {
            ...prev.calendar,
            events: prev.calendar.events.map(e => e.id === editingId ? { ...e, title, description, date, type, materiaId, updatedAt: now } : e)
          }
        };
      }
      return {
        ...prev,
        calendar: {
          ...prev.calendar,
          events: [...prev.calendar.events, { id, title, description, date, type, materiaId, createdAt: now, updatedAt: now }]
        },
      };
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(editingId ? 'Evento atualizado' : 'Evento criado');

    // Reagenda o lembrete local (8h do dia do evento) fora do reducer, pois é assíncrono
    if (oldNotificationId) cancelNotification(oldNotificationId);
    scheduleEventReminder({ id, title, description, date }).then(notificationId => {
      if (!notificationId) return;
      dispatchUpdate(prev => ({
        ...prev,
        calendar: { ...prev.calendar, events: prev.calendar.events.map(e => e.id === id ? { ...e, notificationId } : e) }
      }));
    });
  };

  const deleteEvent = (id) => {
    const ev = state.calendar.events.find(e => e.id === id);
    if (ev?.notificationId) cancelNotification(ev.notificationId);
    dispatchUpdate(prev => ({
      ...prev,
      calendar: { ...prev.calendar, events: prev.calendar.events.filter(e => e.id !== id) },
    }));
    showToast('Evento excluído');
  };

  const setCalendarView = (year, month) => updateNested('calendar', { viewYear: year, viewMonth: month });
  const setCalSelectedDate = (date) => updateNested('calendar', { calSelectedDate: date });
  
  const prevMonth = () => {
    dispatchUpdate(prev => {
      let { viewYear, viewMonth } = prev.calendar;
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      return { ...prev, calendar: { ...prev.calendar, viewYear, viewMonth } };
    });
  };

  const nextMonth = () => {
    dispatchUpdate(prev => {
      let { viewYear, viewMonth } = prev.calendar;
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      return { ...prev, calendar: { ...prev.calendar, viewYear, viewMonth } };
    });
  };

  // ── Timer / Pomodoro ──────────────────────────────────────
  const getSessionDuration = (type, settings) => {
    if (type === 'focus')       return settings.focusMin * 60;
    if (type === 'short_break') return settings.shortBreakMin * 60;
    if (type === 'long_break')  return settings.longBreakMin * 60;
    return 25 * 60;
  };

  const setFocusMateria = (id) => updateNested('timer', { materiaId: id });

  const updateTimer = (partial) => {
    // Se estivermos apenas passando o tick do relógio (remainingSeconds), não salvamos no disco.
    if (Object.keys(partial).length === 1 && 'remainingSeconds' in partial) {
      dispatchVolatileUpdate(prev => ({
        ...prev,
        timer: { ...prev.timer, ...partial }
      }));
    } else {
      updateNested('timer', partial);
    }
  };

  const finishTimerSession = () => {
    const wasFocus = state.timer.sessionType === 'focus';
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast(wasFocus ? 'Sessão de foco concluída! Hora do intervalo. 🎉' : 'Intervalo concluído! Hora de focar. 💪');
    dispatchUpdate(prev => {
      let nextMode = 'focus';
      let newCycle = prev.timer.cyclePosition;
      let { totalMinutesToday, totalMinutesWeek, completedSessions, longestSession, currentStreak, longestStreak, lastSessionDate } = prev.timer;
      let newFocusSessions = prev.focusSessions;

      // Se acabou uma sessão de foco, incrementamos os stats
      if (prev.timer.sessionType === 'focus') {
        const minStudied = Math.round(prev.timer.totalSeconds / 60);
        totalMinutesToday += minStudied;
        totalMinutesWeek += minStudied;
        completedSessions += 1;

        if (minStudied > longestSession) {
          longestSession = minStudied;
        }

        // Sequência de dias estudados: só conta uma vez por dia
        const today = todayStr();
        if (lastSessionDate !== today) {
          currentStreak = (lastSessionDate === todayStr(-1)) ? currentStreak + 1 : 1;
          if (currentStreak > longestStreak) longestStreak = currentStreak;
          lastSessionDate = today;
        }

        newFocusSessions = [
          ...prev.focusSessions,
          { id: uid(), materiaId: prev.timer.materiaId, minutes: minStudied, date: today },
        ];

        newCycle++;
        if (newCycle >= 4) {
          nextMode = 'long_break';
          newCycle = 0;
        } else {
          nextMode = 'short_break';
        }
      }

      const nextDuration = getSessionDuration(nextMode, prev.settings);

      return {
        ...prev,
        focusSessions: newFocusSessions,
        timer: {
          ...prev.timer,
          isRunning: false,
          sessionType: nextMode,
          cyclePosition: newCycle,
          remainingSeconds: nextDuration,
          totalSeconds: nextDuration,
          totalMinutesToday,
          totalMinutesWeek,
          completedSessions,
          longestSession,
          currentStreak,
          longestStreak,
          lastSessionDate,
          sessionCount: prev.timer.sessionCount + 1
        }
      };
    });
  };

  // ── Navegação e Utils ─────────────────────────────────────
  const setSelectedMateria = (id) => dispatchUpdate({ selectedMateriaId: id });

  const clearAllData = async () => {
    await AsyncStorage.removeItem(STORE_KEY);
    dispatchUpdate(prev => ({
      ...prev,
      materias: [], notas: [], flashcards: [], checklistCategories: [], anotacoes: [],
      calendar: { ...prev.calendar, events: [] },
      timer: { ...prev.timer, totalMinutesToday: 0, completedSessions: 0 }
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast('Todos os dados foram apagados');
  };

  const value = {
    state,
    isStoreLoaded,
    exportData,
    importData,
    calcularMedia: (materiaId) => calcularMedia(state.notas, materiaId),
    mediaBadge, formatRelativeDate, formatDate, getGreeting, getSessionDuration: (type) => getSessionDuration(type, state.settings),
    setUserName, changeSetting, completeOnboarding, setEducationLevel, setGoal, setStudyMethod, toggleDifficulty,
    saveMateria, deleteMateria, saveNota, deleteNota,
    toggleFlashcard, saveFlashcard, deleteFlashcard, reviewFlashcard, saveCategoryTitle, deleteCategory,
    saveChecklistItem, toggleChecklistItem, deleteChecklistItem, saveAnotacao, deleteAnotacao,
    setNotesFilter, saveEvent, deleteEvent, setCalendarView, setCalSelectedDate,
    prevMonth, nextMonth, updateTimer, finishTimerSession, setFocusMateria, setSelectedMateria, clearAllData,
    showToast, showConfirm,
  };

  return (
    <EstudixContext.Provider value={value}>
      {children}
      <Toast message={toastMessage} />
      <ConfirmModal
        visible={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmLabel={confirmDialog?.confirmLabel}
        cancelLabel={confirmDialog?.cancelLabel}
        hideCancel={confirmDialog?.hideCancel}
        destructive={confirmDialog?.destructive}
        onCancel={closeConfirm}
        onConfirmPress={() => {
          confirmDialog?.onConfirm?.();
          closeConfirm();
        }}
      />
    </EstudixContext.Provider>
  );
}

export function useEstudix() {
  const ctx = useContext(EstudixContext);
  if (!ctx) throw new Error('useEstudix deve ser usado dentro de EstudixProvider');
  return ctx;
}

export default EstudixContext;
