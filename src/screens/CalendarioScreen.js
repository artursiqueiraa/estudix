// ============================================================
//  ESTUDIX — CalendarioScreen (Paridade 100% Web)
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppHeader from '../components/AppHeader';
import FAB from '../components/FAB';
import { useEstudix, formatDate } from '../context/EstudixContext';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../theme';

const EVENT_TYPES = ['prova', 'trabalho', 'atividade', 'aula', 'evento'];
const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function CalendarioScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state, saveEvent, deleteEvent, prevMonth, nextMonth, setCalSelectedDate } = useEstudix();
  const { viewYear, viewMonth, calSelectedDate } = state.calendar;

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('evento');
  const [materiaId, setMateriaId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');

  const handleDateChange = (event, selected) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setEventDate(`${selected.getFullYear()}-${pad(selected.getMonth() + 1)}-${pad(selected.getDate())}`);
  };

  const openModal = (ev = null) => {
    if (ev) {
      setEditingId(ev.id);
      setEventTitle(ev.title);
      setEventDescription(ev.description || '');
      setEventDate(ev.date);
      setEventType(ev.type || 'evento');
      setMateriaId(ev.materiaId || '');
    } else {
      setEditingId(null);
      setEventTitle('');
      setEventDescription('');
      setEventDate(calSelectedDate); // Pre-fill with selected date
      setEventType('evento');
      setMateriaId('');
    }
    setShowDatePicker(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!eventTitle.trim() || !eventDate.trim()) return;
    saveEvent(eventTitle, eventDescription, eventDate, eventType, materiaId, editingId);
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

  // Logica do Grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    const prevDate = new Date(viewYear, viewMonth, -firstDay + i + 1);
    cells.push({ type: 'empty', day: prevDate.getDate(), id: `empty-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`;
    const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d;
    const hasEvent = state.calendar.events.some(e => e.date === dateStr);
    cells.push({ type: 'day', day: d, dateStr, isToday, hasEvent });
  }

  // Eventos do dia selecionado
  const selectedEvents = state.calendar.events.filter(e => e.date === calSelectedDate);

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={true} />
      
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* HEADER CALENDÁRIO */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="calendar-outline" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>CALENDÁRIO MENSAL</Text>
          </View>
        </View>

        {/* CARD DO CALENDÁRIO */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.calendarMonthTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.iconBtn}>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarGridWeek}>
            {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
              <Text key={d} style={styles.calendarWeekText}>{d}</Text>
            ))}
          </View>

          <View style={styles.calendarGridDays}>
            {cells.map((cell, idx) => {
              if (cell.type === 'empty') {
                return (
                  <View key={cell.id} style={[styles.calDayCell, { opacity: 0.3 }]}>
                    <Text style={styles.calDayNum}>{cell.day}</Text>
                  </View>
                );
              }
              const isSelected = calSelectedDate === cell.dateStr;
              return (
                <TouchableOpacity 
                  key={cell.dateStr}
                  style={[
                    styles.calDayCell,
                    cell.isToday && styles.calDayToday,
                    isSelected && styles.calDaySelected
                  ]}
                  onPress={() => setCalSelectedDate(cell.dateStr)}
                >
                  <Text style={[
                    styles.calDayNum,
                    (cell.isToday || isSelected) && { color: (cell.isToday && !isSelected) ? '#8A6A2F' : colors.text }
                  ]}>
                    {cell.day}
                  </Text>
                  {cell.hasEvent && <View style={styles.calDayEventDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* HEADER EVENTOS */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="list-outline" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>EVENTOS DO DIA</Text>
          </View>
        </View>
        
        {selectedEvents.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum evento neste dia.</Text>
        ) : (
          selectedEvents.map(ev => {
            const color = getMateriaColor(ev.materiaId);
            return (
              <TouchableOpacity key={ev.id} style={[styles.card, { borderLeftColor: color }]} onPress={() => openModal(ev)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>{formatDate(ev.date)}</Text>
                  <TouchableOpacity onPress={() => deleteEvent(ev.id)}>
                    <Ionicons name="trash-outline" size={16} color={colors.accent} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.cardTitle}>{ev.title}</Text>
                {!!ev.description && <Text style={styles.cardDesc}>{ev.description}</Text>}
                
                <View style={styles.cardFooter}>
                  <View style={[styles.badge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.badgeText, { color }]}>{getMateriaName(ev.materiaId)}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: colors.border }]}>
                    <Text style={[styles.badgeText, { color: colors.subtext, textTransform: 'capitalize' }]}>{ev.type || 'evento'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      <FAB currentScreen="Calendario" onPress={() => openModal()} />

      {/* MODAL NOVO/EDITAR EVENTO */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Editar Evento' : 'Novo Evento'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título do Evento..."
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholderTextColor={colors.subtext}
            />
            
            <TextInput
              style={[styles.input, { minHeight: 60 }]}
              placeholder="Descrição (opcional)..."
              value={eventDescription}
              onChangeText={setEventDescription}
              placeholderTextColor={colors.subtext}
              multiline
            />
            
            <TouchableOpacity style={styles.dateField} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
              <Ionicons name="calendar-outline" size={18} color={colors.subtext} />
              <Text style={[styles.dateFieldText, !eventDate && { color: colors.subtext }]}>
                {eventDate ? formatDate(eventDate) : 'Selecionar data'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <View style={Platform.OS === 'ios' ? styles.iosPickerWrap : undefined}>
                <DateTimePicker
                  value={eventDate ? new Date(`${eventDate}T00:00:00`) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={handleDateChange}
                  locale="pt-BR"
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity style={styles.iosPickerDone} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.iosPickerDoneText}>Concluir</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <Text style={styles.label}>Tipo de Evento:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
              {EVENT_TYPES.map(type => (
                <TouchableOpacity 
                  key={type} 
                  style={[styles.chip, eventType === type && styles.chipActive]}
                  onPress={() => setEventType(type)}
                >
                  <Text style={[styles.chipText, eventType === type && styles.chipTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

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
  content: { paddingHorizontal: 20, paddingTop: 8 },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 6, marginBottom: 12 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionIcon: { fontSize: 14, color: colors.text, marginRight: 6 },
  sectionTitle: { fontFamily: fontFamily.sansBold, fontSize: 11, color: colors.text, letterSpacing: 1 },

  calendarCard: { backgroundColor: colors.bgCard, borderRadius: radii.md, padding: 14, marginBottom: 16, ...shadows.sm },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calendarMonthTitle: { fontSize: 15, fontFamily: fontFamily.serif, color: colors.text },
  iconBtn: { padding: 4 },
  calendarGridWeek: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  calendarWeekText: { width: '14.28%', textAlign: 'center', fontFamily: fontFamily.sansBold, fontSize: 11, color: colors.subtext },
  
  calendarGridDays: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' },
  calDayCell: { width: '13%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm },
  calDayToday: { backgroundColor: colors.warmMid },
  calDaySelected: { borderWidth: 2, borderColor: colors.primary },
  calDayNum: { fontFamily: fontFamily.sansSemi, fontSize: 13, color: colors.text },
  calDayEventDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent, position: 'absolute', bottom: 4 },

  card: { backgroundColor: colors.bgCard, padding: 16, borderRadius: radii.md, borderLeftWidth: 3, marginBottom: 12, ...shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardDate: { fontFamily: fontFamily.sansBold, fontSize: 12, color: colors.primary, textTransform: 'uppercase' },
  cardTitle: { fontFamily: fontFamily.sansBold, fontSize: 15, color: colors.text, marginBottom: 4 },
  cardDesc: { fontFamily: fontFamily.sans, fontSize: 13, color: colors.text, marginBottom: 12, lineHeight: 22 },
  cardFooter: { flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  badgeText: { fontFamily: fontFamily.sansSemi, fontSize: 11 },
  emptyText: { fontFamily: fontFamily.sans, fontSize: 14, color: colors.subtext, textAlign: 'center', marginTop: 16 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.bgCard, width: '85%', borderRadius: radii.lg, padding: spacing.xl, ...shadows.md },
  modalTitle: { fontFamily: fontFamily.serif, fontSize: fontSize.h2, color: colors.text, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.warmLight, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: 12,
    fontFamily: fontFamily.sansMedium, fontSize: fontSize.base, color: colors.text,
    marginBottom: spacing.md,
  },
  dateField: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.warmLight, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: 12,
    marginBottom: spacing.md,
  },
  dateFieldText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.base, color: colors.text },
  iosPickerWrap: { backgroundColor: colors.warmLight, borderRadius: radii.sm, marginBottom: spacing.md, overflow: 'hidden' },
  iosPickerDone: { alignItems: 'flex-end', paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  iosPickerDoneText: { fontFamily: fontFamily.sansSemi, fontSize: fontSize.sm, color: colors.primary },
  label: { fontFamily: fontFamily.sansBold, fontSize: fontSize.xs, color: colors.subtext, marginBottom: 8, textTransform: 'uppercase' },
  scrollSelector: { flexDirection: 'row', marginBottom: spacing.md },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radii.pill,
    backgroundColor: colors.warmLight, borderWidth: 1, borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.sm, color: colors.subtext, textTransform: 'capitalize' },
  chipTextActive: { color: colors.offWhite },
  
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md, marginTop: spacing.sm },
  modalBtnCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnCancelText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.md, color: colors.subtext },
  modalBtnSave: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnSaveText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.md, color: colors.offWhite },
});
