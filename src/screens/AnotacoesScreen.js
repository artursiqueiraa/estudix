// ============================================================
//  ESTUDIX — AnotacoesScreen (Paridade 100% Web)
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import FAB from '../components/FAB';
import { useEstudix, formatRelativeDate } from '../context/EstudixContext';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../theme';

export default function AnotacoesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state, saveAnotacao, deleteAnotacao, setNotesFilter } = useEstudix();
  const { notesFilter } = state;

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [materiaId, setMateriaId] = useState('');

  const openModal = (nota = null) => {
    if (nota) {
      setEditingId(nota.id);
      setTitle(nota.title);
      setContent(nota.content);
      setMateriaId(nota.materiaId || '');
    } else {
      setEditingId(null);
      setTitle('');
      setContent('');
      setMateriaId('');
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    saveAnotacao(title, content, materiaId || state.materias[0]?.id, editingId);
    setModalVisible(false);
  };

  const getMateriaColor = (id) => {
    const m = state.materias.find(m => m.id === id);
    return m ? m.color : colors.primary;
  };

  const getMateriaName = (id) => {
    const m = state.materias.find(m => m.id === id);
    return m ? m.name : 'Geral';
  };

  const filteredNotes = notesFilter === 'all' 
    ? state.anotacoes 
    : state.anotacoes.filter(n => n.materiaId === notesFilter);

  const sortedNotes = [...filteredNotes].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={false} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greetingName}>Anotações 📝</Text>
        <Text style={styles.screenSubtitle}>Registre resumos, dúvidas e pensamentos de estudo.</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.notesFilterRow}>
          <TouchableOpacity 
            style={[styles.filterPill, notesFilter === 'all' && styles.filterPillActive]}
            onPress={() => setNotesFilter('all')}
          >
            <Text style={[styles.filterPillText, notesFilter === 'all' && styles.filterPillTextActive]}>Todas</Text>
          </TouchableOpacity>
          {state.materias.map(mat => (
            <TouchableOpacity 
              key={mat.id}
              style={[styles.filterPill, notesFilter === mat.id && styles.filterPillActive]}
              onPress={() => setNotesFilter(mat.id)}
            >
              <Text style={[styles.filterPillText, notesFilter === mat.id && styles.filterPillTextActive]}>{mat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {sortedNotes.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma anotação {notesFilter !== 'all' ? 'nesta matéria' : 'ainda'}. Use o "+" para criar!</Text>
        ) : (
          sortedNotes.map(nota => {
            const color = getMateriaColor(nota.materiaId);
            return (
              <TouchableOpacity 
                key={nota.id} 
                style={[styles.noteCard, { borderLeftColor: color }]} 
                onPress={() => openModal(nota)}
                activeOpacity={0.8}
              >
                <View style={styles.noteCardHeader}>
                  <Text style={[styles.noteCardTitle, { color }]}>{nota.title}</Text>
                  <TouchableOpacity onPress={() => deleteAnotacao(nota.id)} style={styles.noteDeleteBtn}>
                    <Ionicons name="trash-outline" size={16} color={colors.accent} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteCardContent} numberOfLines={3}>{nota.content}</Text>
                
                <View style={styles.noteCardFooter}>
                  <View style={[styles.badge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.badgeText, { color }]}>{getMateriaName(nota.materiaId)}</Text>
                  </View>
                  <Text style={styles.cardDate}>
                    {formatRelativeDate(nota.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 130 }} />
      </ScrollView>

      <FAB currentScreen="Anotacoes" onPress={() => openModal()} />

      {/* MODAL NOVA/EDITAR ANOTAÇÃO */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Editar Anotação' : 'Nova Anotação'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título..."
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={colors.subtext}
            />
            <TextInput
              style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder="Escreva sua anotação..."
              multiline
              value={content}
              onChangeText={setContent}
              placeholderTextColor={colors.subtext}
            />

            <Text style={styles.label}>Matéria:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
              <TouchableOpacity 
                style={[styles.chip, !materiaId && styles.chipActive]}
                onPress={() => setMateriaId('')}
              >
                <Text style={[styles.chipText, !materiaId && styles.chipTextActive]}>Geral</Text>
              </TouchableOpacity>
              {state.materias.map(mat => (
                <TouchableOpacity 
                  key={mat.id} 
                  style={[styles.chip, materiaId === mat.id && styles.chipActive]}
                  onPress={() => setMateriaId(mat.id)}
                >
                  <Text style={[styles.chipText, materiaId === mat.id && styles.chipTextActive]}>{mat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSave}>
                <Text style={styles.modalBtnSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 8, paddingHorizontal: 20 },
  greetingName: { fontFamily: fontFamily.serif, fontSize: 30, color: colors.text, marginBottom: 6 },
  screenSubtitle: { fontFamily: fontFamily.sans, fontSize: 13, color: colors.subtext, lineHeight: 20, marginBottom: 20 },
  
  notesFilterRow: { flexDirection: 'row', gap: 8, marginBottom: 16, paddingBottom: 4 },
  filterPill: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.bgCard,
    borderWidth: 1.5, borderColor: colors.border,
  },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterPillText: { fontFamily: fontFamily.sansSemi, fontSize: 12, color: colors.subtext },
  filterPillTextActive: { color: colors.offWhite },
  
  noteCard: {
    backgroundColor: colors.bgCard, borderRadius: radii.md, padding: 16, marginBottom: 12,
    borderLeftWidth: 3, ...shadows.sm,
  },
  noteCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  noteCardTitle: { fontFamily: fontFamily.sansBold, fontSize: 15, flex: 1, paddingRight: 8 },
  noteDeleteBtn: { padding: 4, borderRadius: 6 },
  noteCardContent: { fontFamily: fontFamily.sans, fontSize: 13, color: colors.text, lineHeight: 22, marginBottom: 10 },
  noteCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontFamily: fontFamily.sansMedium, fontSize: 11, color: colors.subtext },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  badgeText: { fontFamily: fontFamily.sansSemi, fontSize: 11 },
  
  emptyText: { fontFamily: fontFamily.sans, fontSize: 14, color: colors.subtext, textAlign: 'center', marginVertical: 32 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.bgCard, width: '85%', borderRadius: radii.lg, padding: 20, ...shadows.md },
  modalTitle: { fontFamily: fontFamily.serif, fontSize: 22, color: colors.text, marginBottom: 16 },
  input: {
    backgroundColor: colors.warmLight, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.sm, paddingHorizontal: 16, paddingVertical: 12,
    fontFamily: fontFamily.sansMedium, fontSize: 13, color: colors.text,
    marginBottom: 16,
  },
  
  label: { fontFamily: fontFamily.sansBold, fontSize: 11, color: colors.subtext, marginBottom: 8, textTransform: 'uppercase' },
  scrollSelector: { flexDirection: 'row', marginBottom: 16 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radii.pill,
    backgroundColor: colors.warmLight, borderWidth: 1, borderColor: colors.border, marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fontFamily.sansMedium, fontSize: 12, color: colors.subtext, textTransform: 'capitalize' },
  chipTextActive: { color: colors.offWhite },
  
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  modalBtnCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnCancelText: { fontFamily: fontFamily.sansMedium, fontSize: 14, color: colors.subtext },
  modalBtnSave: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnSaveText: { fontFamily: fontFamily.sansMedium, fontSize: 14, color: colors.offWhite },
});
