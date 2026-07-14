// ============================================================
//  ESTUDIX — MateriaInternaScreen (Paridade 100% Web)
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FAB from '../components/FAB';
import GradeChart from '../components/GradeChart';
import { useEstudix, todayStr } from '../context/EstudixContext';
import { colors, fontFamily, fontSize, radii, spacing, shadows } from '../theme';

export default function MateriaInternaScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    state, calcularMedia,
    saveNota, deleteNota,
    saveCategoryTitle, saveChecklistItem, toggleChecklistItem, deleteChecklistItem,
    saveFlashcard, toggleFlashcard, deleteFlashcard, reviewFlashcard,
    showToast,
  } = useEstudix();

  const materia = state.materias.find((m) => m.id === state.selectedMateriaId);

  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' | 'notas' | 'flashcards'
  
  // Notas
  const [notaModal, setNotaModal] = useState(false);
  const [editingNotaId, setEditingNotaId] = useState(null);
  const [notaLabel, setNotaLabel] = useState('');
  const [notaValue, setNotaValue] = useState('');

  // Checklist
  const [checklistModal, setChecklistModal] = useState(false);
  const [editingChecklistId, setEditingChecklistId] = useState(null);
  const [editingChecklistCatId, setEditingChecklistCatId] = useState(null);
  const [checkText, setCheckText] = useState('');

  // Flashcards
  const [flashcardModal, setFlashcardModal] = useState(false);
  const [editingFcId, setEditingFcId] = useState(null);
  const [fcQuestion, setFcQuestion] = useState('');
  const [fcAnswer, setFcAnswer] = useState('');

  if (!materia) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, paddingHorizontal: 20 }]}>
        <Text style={{ color: colors.subtext }}>Nenhuma matéria selecionada.</Text>
      </View>
    );
  }

  const avg = calcularMedia(materia.id);
  const notas = state.notas.filter((n) => n.materiaId === materia.id);
  const categories = state.checklistCategories.filter((c) => c.materiaId === materia.id);
  const flashcards = state.flashcards.filter((f) => f.materiaId === materia.id);

  const handleFabPress = () => {
    if (activeTab === 'notas') openNotaModal();
    else if (activeTab === 'checklist') openChecklistModal();
    else openFlashcardModal();
  };

  // --- MÉTODOS AVALIAÇÕES ---
  const openNotaModal = (nota = null) => {
    if (nota) {
      setEditingNotaId(nota.id);
      setNotaLabel(nota.label);
      setNotaValue(nota.value.toString());
    } else {
      setEditingNotaId(null);
      setNotaLabel('');
      setNotaValue('');
    }
    setNotaModal(true);
  };

  const handleSaveNota = () => {
    if (!notaLabel.trim() || !notaValue.trim()) return;
    saveNota(notaLabel, notaValue, editingNotaId);
    setNotaModal(false);
  };

  // --- MÉTODOS CHECKLIST ---
  const openChecklistModal = (catId = null, item = null) => {
    if (item) {
      setEditingChecklistId(item.id);
      setEditingChecklistCatId(catId);
      setCheckText(item.text);
    } else {
      setEditingChecklistId(null);
      setEditingChecklistCatId(catId);
      setCheckText('');
    }
    setChecklistModal(true);
  };

  const handleSaveChecklist = () => {
    if (!checkText.trim()) return;
    let catId = editingChecklistCatId || (categories.length > 0 ? categories[0].id : null);
    if (!catId) {
      saveCategoryTitle('Checklist Geral');
      showToast('Categoria padrão criada — toque em salvar novamente para adicionar o item.');
      setChecklistModal(false);
      return;
    }
    saveChecklistItem(checkText, catId, editingChecklistId);
    setChecklistModal(false);
  };

  // --- MÉTODOS FLASHCARDS ---
  const openFlashcardModal = (fc = null) => {
    if (fc) {
      setEditingFcId(fc.id);
      setFcQuestion(fc.question);
      setFcAnswer(fc.answer);
    } else {
      setEditingFcId(null);
      setFcQuestion('');
      setFcAnswer('');
    }
    setFlashcardModal(true);
  };

  const handleSaveFlashcard = () => {
    if (!fcQuestion.trim() || !fcAnswer.trim()) return;
    saveFlashcard(fcQuestion, fcAnswer, editingFcId);
    setFlashcardModal(false);
  };

  const renderChecklist = () => (
    <View style={styles.tabContent}>
      {categories.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum checklist para esta matéria.</Text>
      ) : (
        categories.map((cat) => (
          <View key={cat.id} style={styles.innerSubjectCard}>
            <Text style={styles.sectionTitle}>{cat.title}</Text>
            {cat.items.length === 0 && <Text style={styles.emptyText}>Categoria vazia.</Text>}
            {cat.items.map((item) => (
              <View key={item.id} style={styles.checkItemWrapper}>
                <TouchableOpacity
                  style={styles.checkItem}
                  onPress={() => toggleChecklistItem(cat.id, item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={item.done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={item.done ? colors.success : colors.subtext} />
                  <Text style={[styles.checkText, item.done && styles.checkTextDone]}>{item.text}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openChecklistModal(cat.id, item)} style={styles.editIconBtn}>
                  <Ionicons name="pencil" size={16} color={colors.subtext} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteChecklistItem(cat.id, item.id)} style={styles.editIconBtn}>
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );

  const renderNotas = () => (
    <View style={styles.tabContent}>
      <GradeChart notas={notas} />
      {notas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma avaliação cadastrada.</Text>
      ) : (
        notas.map((n) => (
          <View key={n.id} style={styles.innerSubjectCard}>
            <View style={styles.innerGradeRow}>
              <Text style={styles.innerGradeLabel}>{n.label}</Text>
              <Text style={styles.mediaValueBold}>{n.value.toFixed(1)}</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.mediaBadgeRow}>
              <TouchableOpacity onPress={() => openNotaModal(n)} style={[styles.editIconBtn, { marginRight: 8 }]}>
                <Ionicons name="pencil" size={16} color={colors.subtext} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteNota(n.id)} style={styles.editIconBtn}>
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderFlashcards = () => {
    const today = todayStr();
    const dueCount = flashcards.filter(f => (f.dueDate || today) <= today).length;

    return (
      <View style={styles.tabContent}>
        {dueCount > 0 && (
          <View style={styles.fcDueBanner}>
            <Ionicons name="alarm-outline" size={16} color={colors.primary} />
            <Text style={styles.fcDueBannerText}>
              {dueCount} {dueCount === 1 ? 'card para revisar' : 'cards para revisar'} hoje
            </Text>
          </View>
        )}

        {flashcards.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum flashcard para esta matéria.</Text>
        ) : (
          flashcards.map((f) => {
            const isDue = (f.dueDate || today) <= today;
            return (
              <View key={f.id} style={styles.flashcardContainer}>
                <View style={styles.fcHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.fcStatus}>{f.flipped ? 'RESPOSTA' : 'PERGUNTA'}</Text>
                    {isDue && <View style={styles.fcDueDot} />}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity onPress={() => openFlashcardModal(f)}>
                      <Ionicons name="pencil" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteFlashcard(f.id)}>
                      <Ionicons name="trash-outline" size={18} color={colors.subtext} />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity activeOpacity={0.85} disabled={f.flipped} onPress={() => toggleFlashcard(f.id)}>
                  <View style={styles.fcBody}>
                    <Text style={f.flipped ? styles.fcAnswer : styles.fcQuestion}>
                      {f.flipped ? f.answer : f.question}
                    </Text>
                  </View>
                  {!f.flipped && <Text style={styles.fcHint}>Toque para revelar</Text>}
                </TouchableOpacity>

                {f.flipped && (
                  <View style={styles.fcReviewRow}>
                    <TouchableOpacity style={styles.fcReviewBtnBad} onPress={() => reviewFlashcard(f.id, false)} activeOpacity={0.8}>
                      <Ionicons name="close" size={16} color={colors.danger} />
                      <Text style={styles.fcReviewBtnBadText}>Não lembrei</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.fcReviewBtnGood} onPress={() => reviewFlashcard(f.id, true)} activeOpacity={0.8}>
                      <Ionicons name="checkmark" size={16} color={colors.success} />
                      <Text style={styles.fcReviewBtnGoodText}>Lembrei</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </View>
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Título */}
        <View style={styles.materiaTitleRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={[styles.materiaBadge, { backgroundColor: materia.color + '1A' }]}>
            <Ionicons name={materia.icon} size={18} color={materia.color} />
          </View>
          <Text style={styles.greetingName} numberOfLines={1}>{materia.name}</Text>
        </View>

        {/* Card Média Atual */}
        <View style={styles.innerSubjectCard}>
          <View style={styles.innerGradeRow}>
            <Text style={styles.innerGradeLabel}>Média Atual</Text>
            <Text style={styles.mediaValueBold}>{avg}</Text>
          </View>
        </View>

        {/* Abas */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          <TouchableOpacity style={[styles.tabBtn, activeTab === 'checklist' && styles.tabBtnActive]} onPress={() => setActiveTab('checklist')}>
            <Text style={[styles.tabText, activeTab === 'checklist' && styles.tabTextActive]}>Checklist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, activeTab === 'notas' && styles.tabBtnActive]} onPress={() => setActiveTab('notas')}>
            <Text style={[styles.tabText, activeTab === 'notas' && styles.tabTextActive]}>Notas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, activeTab === 'flashcards' && styles.tabBtnActive]} onPress={() => setActiveTab('flashcards')}>
            <Text style={[styles.tabText, activeTab === 'flashcards' && styles.tabTextActive]}>Flashcards</Text>
          </TouchableOpacity>
        </ScrollView>

        {activeTab === 'checklist' && renderChecklist()}
        {activeTab === 'notas' && renderNotas()}
        {activeTab === 'flashcards' && renderFlashcards()}
        
        <View style={{ height: 130 }} />
      </ScrollView>

      <FAB currentScreen="MateriaInterna" onPress={handleFabPress} />

      {/* MODAL NOTA */}
      <Modal visible={notaModal} transparent animationType="fade" onRequestClose={() => setNotaModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingNotaId ? 'Editar Avaliação' : 'Nova Avaliação'}</Text>
            <TextInput style={styles.input} placeholder="Ex: Prova Bimestral" value={notaLabel} onChangeText={setNotaLabel} placeholderTextColor={colors.subtext} />
            <TextInput style={styles.input} placeholder="Nota (0 a 10)" keyboardType="numeric" value={notaValue} onChangeText={setNotaValue} placeholderTextColor={colors.subtext} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setNotaModal(false)}><Text style={styles.modalBtnCancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveNota}><Text style={styles.modalBtnSaveText}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CHECKLIST ITEM */}
      <Modal visible={checklistModal} transparent animationType="fade" onRequestClose={() => setChecklistModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingChecklistId ? 'Editar Item' : 'Novo Item'}</Text>
            <TextInput style={styles.input} placeholder="Ex: Ler capítulo 4" value={checkText} onChangeText={setCheckText} placeholderTextColor={colors.subtext} autoFocus />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setChecklistModal(false)}><Text style={styles.modalBtnCancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveChecklist}><Text style={styles.modalBtnSaveText}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL FLASHCARD */}
      <Modal visible={flashcardModal} transparent animationType="fade" onRequestClose={() => setFlashcardModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingFcId ? 'Editar Flashcard' : 'Novo Flashcard'}</Text>
            <TextInput style={[styles.input, { minHeight: 60 }]} placeholder="Pergunta..." multiline value={fcQuestion} onChangeText={setFcQuestion} placeholderTextColor={colors.subtext} />
            <TextInput style={[styles.input, { minHeight: 60 }]} placeholder="Resposta..." multiline value={fcAnswer} onChangeText={setFcAnswer} placeholderTextColor={colors.subtext} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setFlashcardModal(false)}><Text style={styles.modalBtnCancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveFlashcard}><Text style={styles.modalBtnSaveText}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  
  materiaTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  iconBtn: { padding: 6, borderRadius: 19 },
  materiaBadge: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  greetingName: { fontFamily: fontFamily.serif, fontSize: 30, fontWeight: '700', color: colors.text, flex: 1 },

  innerSubjectCard: { backgroundColor: colors.bgCard, borderRadius: radii.md, padding: 18, marginBottom: 15, ...shadows.sm },
  innerGradeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  innerGradeLabel: { fontSize: 14, color: '#4A4A4A', flex: 1, paddingRight: 8, fontFamily: fontFamily.sansSemi },
  mediaValueBold: { fontSize: 18, fontWeight: '700', color: colors.primary, fontFamily: fontFamily.sansBold },
  cardDivider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  mediaBadgeRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6 },

  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 16 },
  tabBtn: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: colors.primary },
  tabText: { fontFamily: fontFamily.sansSemi, fontSize: 14, color: colors.subtext },
  tabTextActive: { color: colors.primary },

  tabContent: { flex: 1 },
  sectionTitle: { fontFamily: fontFamily.sansBold, fontSize: 14, color: colors.text, marginBottom: 12 },
  emptyText: { fontFamily: fontFamily.sans, fontSize: 14, color: colors.subtext, fontStyle: 'italic', marginBottom: 12 },
  
  checkItemWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, flex: 1 },
  checkText: { fontFamily: fontFamily.sansMedium, fontSize: 13, color: colors.text, flex: 1 },
  checkTextDone: { color: colors.subtext, textDecorationLine: 'line-through' },
  editIconBtn: { padding: 6, borderRadius: 6 },

  flashcardContainer: { backgroundColor: colors.bgCard, borderRadius: radii.md, padding: 14, marginBottom: 10, ...shadows.sm },
  fcHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  fcStatus: { fontFamily: fontFamily.sansBold, fontSize: 10, textTransform: 'uppercase', color: colors.subtext, letterSpacing: 1 },
  fcBody: { minHeight: 68, justifyContent: 'center' },
  fcQuestion: { fontFamily: fontFamily.sansMedium, fontSize: 14, color: colors.text, textAlign: 'center' },
  fcAnswer: { fontFamily: fontFamily.sansBold, fontSize: 14, color: colors.primary, textAlign: 'center' },
  fcHint: { fontFamily: fontFamily.sans, fontSize: 11, color: colors.subtext, textAlign: 'center', marginTop: 12 },
  fcDueDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },

  fcDueBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.warmLight, borderRadius: radii.sm,
    paddingVertical: 10, paddingHorizontal: 14, marginBottom: 12,
  },
  fcDueBannerText: { fontFamily: fontFamily.sansSemi, fontSize: 12.5, color: colors.primary },

  fcReviewRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  fcReviewBtnBad: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: radii.sm, backgroundColor: colors.danger + '14',
    borderWidth: 1, borderColor: colors.danger + '33',
  },
  fcReviewBtnBadText: { fontFamily: fontFamily.sansSemi, fontSize: 12.5, color: colors.danger },
  fcReviewBtnGood: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: radii.sm, backgroundColor: colors.success + '14',
    borderWidth: 1, borderColor: colors.success + '33',
  },
  fcReviewBtnGoodText: { fontFamily: fontFamily.sansSemi, fontSize: 12.5, color: colors.success },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.bgCard, width: '85%', borderRadius: radii.lg, padding: spacing.xl, ...shadows.md },
  modalTitle: { fontFamily: fontFamily.serif, fontSize: fontSize.h2, color: colors.text, marginBottom: spacing.lg },
  input: { backgroundColor: colors.warmLight, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: 12, fontFamily: fontFamily.sansMedium, fontSize: fontSize.base, color: colors.text, marginBottom: spacing.md },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md, marginTop: spacing.sm },
  modalBtnCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnCancelText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.md, color: colors.subtext },
  modalBtnSave: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnSaveText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.md, color: colors.offWhite },
});
