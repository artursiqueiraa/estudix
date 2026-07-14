// ============================================================
//  ESTUDIX — MateriasScreen (Paridade 100% Web)
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../components/AppHeader';
import FAB from '../components/FAB';
import { useEstudix } from '../context/EstudixContext';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../theme';

export default function MateriasScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state, saveMateria, setSelectedMateria, calcularMedia } = useEstudix();
  const { materias, notas } = state;

  const [modalVisible, setModalVisible] = useState(false);
  const [newMateriaName, setNewMateriaName] = useState('');

  const openModal = () => {
    setNewMateriaName('');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!newMateriaName.trim()) return;
    saveMateria(newMateriaName.trim());
    setModalVisible(false);
  };

  const handleMateriaClick = (id) => {
    setSelectedMateria(id);
    navigation.navigate('MateriaInterna');
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Minhas Matérias 📚</Text>
        <Text style={styles.subtitle}>Adicione as disciplinas que você está estudando.</Text>

        {materias.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma matéria ainda. Use o "+" para adicionar!</Text>
        ) : (
          <View style={styles.grid}>
            {materias.map((mat) => (
              <TouchableOpacity
                key={mat.id}
                style={styles.card}
                onPress={() => handleMateriaClick(mat.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconBox, { backgroundColor: mat.color + '1A' }]}>
                  <Ionicons name={mat.icon} size={30} color={mat.color} />
                </View>
                <Text style={styles.cardTitle}>{mat.name}</Text>
                <Text style={styles.cardSub}>Média: {calcularMedia(mat.id)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      <FAB currentScreen="Materias" onPress={() => openModal()} />

      {/* ── Modal Nova Matéria ── */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Matéria</Text>
            <Text style={styles.modalSub}>Qual matéria deseja estudar?</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Ex: Biologia"
              value={newMateriaName}
              onChangeText={setNewMateriaName}
              autoFocus
              placeholderTextColor={colors.subtext}
            />

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
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  title: { fontFamily: fontFamily.serif, fontSize: 30, color: colors.text, marginBottom: 6 },
  subtitle: { fontFamily: fontFamily.sans, fontSize: 13, color: colors.subtext, lineHeight: 20, marginBottom: 20 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: {
    backgroundColor: colors.bgCard, width: '47.5%', borderRadius: radii.md,
    paddingVertical: 20, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'flex-start',
    gap: 4, ...shadows.sm, marginBottom: 4,
  },
  iconBox: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardTitle: { fontFamily: fontFamily.sansBold, fontSize: 15, color: colors.text, textAlign: 'center' },
  cardSub: { fontFamily: fontFamily.sans, fontSize: 12, color: colors.subtext, marginTop: 2 },
  
  emptyText: { fontFamily: fontFamily.sans, fontSize: 14, color: colors.subtext, textAlign: 'center', marginVertical: 32 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.bgCard, width: '85%', borderRadius: radii.lg, padding: spacing.xl, ...shadows.md },
  modalTitle: { fontFamily: fontFamily.serif, fontSize: fontSize.h2, color: colors.text },
  modalSub: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.subtext, marginTop: spacing.xs, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.warmLight, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm,
    paddingHorizontal: spacing.md, paddingVertical: 12, fontFamily: fontFamily.sansMedium, fontSize: fontSize.base,
    color: colors.text, marginBottom: spacing.xl,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  modalBtnCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnCancelText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.md, color: colors.subtext },
  modalBtnSave: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnSaveText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.md, color: colors.offWhite },
});
