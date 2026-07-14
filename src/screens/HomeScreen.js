// ============================================================
//  ESTUDIX — HomeScreen
//  Tela Home COMPLETA — replica fielmente o screen-home do
//  protótipo original (renderHome + renderCalendarStrip +
//  renderPerformance do app.js)
// ============================================================

import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import AppHeader from '../components/AppHeader';
import { useEstudix, getGreeting, formatDate, todayStr, pad, ACHIEVEMENTS, getUnlockedAchievements } from '../context/EstudixContext';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../theme';

const { width: SCREEN_W } = Dimensions.get('window');

// ── Nomes de dias e meses em pt-BR ──────────────────────────
const DAY_NAMES   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                     'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();
  const { state, calcularMedia, setSelectedMateria } = useEstudix();
  const { settings, anotacoes, materias, timer, calendar } = state;

  // ── Animação flutuante da hero illustration ───────────────
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -4, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue:  0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // ── Forçar re-render ao focar (métricas atualizadas) ──────
  const [, forceUpdate] = React.useState(0);
  useFocusEffect(useCallback(() => { forceUpdate(n => n + 1); }, []));

  const saudacao = getGreeting();
  const { userName } = settings;

  // ── Helpers da tira de calendário ────────────────────────
  const today = new Date();
  const stripDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 2); // -2 a +4 (hoje = índice 2)
    return d;
  });

  const hasEvent = (dateStr) =>
    calendar.events.some(e => e.date === dateStr);

  const unlockedAchievementIds = new Set(getUnlockedAchievements(timer).map(a => a.id));

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      {/* Header sem botão voltar (Home é a raiz) */}
      <AppHeader navigation={navigation} showBack={false} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ════ SAUDAÇÃO ════ */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingSmall}>{saudacao},</Text>
            <Text style={styles.greetingName}>{userName} 👋</Text>
          </View>

          {/* Hero illustration animada */}
          <Animated.View style={[styles.heroBox, { transform: [{ translateY: floatAnim }] }]}>
            <View style={styles.heroSun}>
              <Ionicons name="sunny" size={22} color="#E8B36A" />
            </View>
            <Ionicons
              name="leaf-outline"
              size={18}
              color={colors.successLight}
              style={styles.heroLeaf}
            />
            <Ionicons
              name="book-outline"
              size={16}
              color={colors.primary}
              style={styles.heroBook}
            />
          </Animated.View>
        </View>

        {/* ════ FOCO — AÇÃO PRINCIPAL ════ */}
        <TouchableOpacity
          style={styles.focusHero}
          onPress={() => navigation.navigate('BottomTabs', { screen: 'Foco' })}
          activeOpacity={0.88}
          accessibilityLabel="Iniciar sessão de foco"
          accessibilityRole="button"
        >
          <View style={styles.focusHeroIcon}>
            <Ionicons name="play" size={20} color={colors.offWhite} />
          </View>
          <View style={styles.focusHeroTextBlock}>
            <Text style={styles.focusHeroTitle}>Pronto para focar?</Text>
            <Text style={styles.focusHeroSubtitle}>
              {timer.totalMinutesToday > 0
                ? `Você já estudou ${timer.totalMinutesToday} min hoje — continue.`
                : 'Inicie uma sessão Pomodoro agora.'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.offWhite} />
        </TouchableOpacity>

        {/* ════ MÉTRICAS ════ */}
        <View style={styles.metricsRow}>
          <MetricCard
            iconName="document-text-outline"
            iconBg={colors.success}
            value={anotacoes.length}
            label="ANOTAÇÕES"
            onPress={() => navigation.navigate('BottomTabs', { screen: 'Anotacoes' })}
          />
          <MetricCard
            iconName="book-outline"
            iconBg={colors.primary}
            value={materias.length}
            label="MATÉRIAS"
            onPress={() => navigation.navigate('BottomTabs', { screen: 'Materias' })}
          />
          <MetricCard
            iconName="hourglass-outline"
            iconBg={colors.accent}
            value={timer.totalMinutesToday || 0}
            label="MIN DE FOCO HOJE"
            onPress={() => navigation.navigate('BottomTabs', { screen: 'Foco' })}
          />
        </View>

        {/* ════ CALENDÁRIO — TIRA ════ */}
        <SectionHeader
          iconName="calendar-outline"
          title="CALENDÁRIO"
          rightLabel="Ver mês"
          onRightPress={() => navigation.navigate('Calendario')}
        />

        <View style={styles.calendarCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarStrip}
          >
            {stripDays.map((d, idx) => {
              const isToday   = idx === 2;
              const dateStr   = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
              const hasEvt    = hasEvent(dateStr);
              return (
                <View key={dateStr} style={styles.calDayWrapper}>
                  <View style={[styles.calDay, isToday && styles.calDayActive]}>
                    <Text style={[styles.calDaySub,  isToday && styles.calDaySubActive]}>
                      {DAY_NAMES[d.getDay()]}
                    </Text>
                    <Text style={[styles.calDayNum, isToday && styles.calDayNumActive]}>
                      {d.getDate()}
                    </Text>
                  </View>
                  {(isToday || hasEvt) && <View style={styles.calDot} />}
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* ════ ESTATÍSTICAS AVANÇADAS ════ */}
        <SectionHeader
          iconName="bar-chart-outline"
          title="ESTATÍSTICAS DE FOCO"
          style={{ marginTop: spacing.lg }}
        />

        <View style={styles.performanceCard}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <View style={{ flex: 1, minWidth: '22%', backgroundColor: colors.warmLight, padding: 12, borderRadius: radii.md }}>
              <Text style={{ fontFamily: fontFamily.sansSemi, fontSize: 12, color: colors.subtext }}>Semana (min)</Text>
              <Text style={{ fontFamily: fontFamily.sansBold, fontSize: 20, color: colors.primary }}>{timer.totalMinutesWeek || 0}</Text>
            </View>
            <View style={{ flex: 1, minWidth: '22%', backgroundColor: colors.warmLight, padding: 12, borderRadius: radii.md }}>
              <Text style={{ fontFamily: fontFamily.sansSemi, fontSize: 12, color: colors.subtext }}>Sessões</Text>
              <Text style={{ fontFamily: fontFamily.sansBold, fontSize: 20, color: colors.accent }}>{timer.completedSessions || 0}</Text>
            </View>
            <View style={{ flex: 1, minWidth: '22%', backgroundColor: colors.warmLight, padding: 12, borderRadius: radii.md }}>
              <Text style={{ fontFamily: fontFamily.sansSemi, fontSize: 12, color: colors.subtext }}>Maior Foco</Text>
              <Text style={{ fontFamily: fontFamily.sansBold, fontSize: 20, color: colors.accent }}>{timer.longestSession || 0}m</Text>
            </View>
            <View style={{ flex: 1, minWidth: '22%', backgroundColor: colors.warmLight, padding: 12, borderRadius: radii.md }}>
              <Text style={{ fontFamily: fontFamily.sansSemi, fontSize: 12, color: colors.subtext }}>Sequência</Text>
              <Text style={{ fontFamily: fontFamily.sansBold, fontSize: 20, color: colors.primary }}>🔥 {timer.currentStreak || 0}</Text>
            </View>
          </View>
          <Text style={{ fontFamily: fontFamily.sans, fontSize: 12, color: colors.subtext, textAlign: 'center', marginTop: 16 }}>
            Último estudo registrado em: {formatDate(timer.lastStudyDate)}
          </Text>
        </View>

        {/* ════ CONQUISTAS ════ */}
        <SectionHeader
          iconName="trophy-outline"
          title="CONQUISTAS"
          style={{ marginTop: spacing.lg }}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsRow}>
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedAchievementIds.has(ach.id);
            return (
              <View key={ach.id} style={[styles.achievementBadge, !unlocked && styles.achievementBadgeLocked]}>
                <Ionicons
                  name={unlocked ? ach.icon.replace('-outline', '') : ach.icon}
                  size={20}
                  color={unlocked ? colors.accent : colors.subtext}
                />
                <Text style={[styles.achievementLabel, !unlocked && styles.achievementLabelLocked]}>{ach.label}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* ════ RESUMO DE DESEMPENHO ════ */}
        <SectionHeader
          iconName="stats-chart-outline"
          title="MÉDIAS POR MATÉRIA"
          style={{ marginTop: spacing.lg }}
        />

        <View style={styles.performanceCard}>
          {materias.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma matéria cadastrada ainda.</Text>
          ) : (
            materias.map((mat, i) => {
              const media  = calcularMedia(mat.id);
              const pct    = Math.min(parseFloat(media) * 10, 100);
              const barClr = parseFloat(media) >= 6 ? colors.successLight : colors.accent;
              return (
                <TouchableOpacity
                  key={mat.id}
                  style={[styles.progressRow, i < materias.length - 1 && { marginBottom: spacing.lg }]}
                  onPress={() => {
                    setSelectedMateria(mat.id);
                    navigation.navigate('MateriaInterna');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressName}>{mat.name}</Text>
                    <Text style={styles.progressGrade}>Média: {media} / 10</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${pct}%`, backgroundColor: barClr }]} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Espaço para tab bar */}
        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

// ── Sub-componentes ──────────────────────────────────────────

function MetricCard({ iconName, iconBg, value, label, onPress }) {
  return (
    <TouchableOpacity style={styles.metricCard} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.metricIconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={18} color="#fff" />
      </View>
      <Text style={styles.metricNumber}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function SectionHeader({ iconName, title, rightLabel, onRightPress, style }) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <View style={styles.sectionHeaderLeft}>
        <Ionicons name={iconName} size={14} color={colors.text} style={{ marginRight: 6 }} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {rightLabel && (
        <TouchableOpacity onPress={onRightPress}>
          <Text style={styles.sectionRightBtn}>{rightLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Estilos ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },

  // Saudação
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  greetingSmall: {
    fontFamily: fontFamily.serifRegular,
    fontSize: fontSize.h2,
    color: colors.text,
  },
  greetingName: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.h1,
    color: colors.text,
    lineHeight: 36,
  },

  // Hero illustration
  heroBox: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: colors.warmLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroSun: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLeaf: {
    position: 'absolute',
    bottom: 10,
    left: 14,
  },
  heroBook: {
    position: 'absolute',
    bottom: 10,
    right: 14,
  },

  // Métricas
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.xl,
  },
  metricCard: {
    backgroundColor: colors.bgCard,
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: radii.md,
    alignItems: 'center',
    gap: 4,
    ...shadows.sm,
  },
  metricIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricNumber: {
    fontFamily: fontFamily.sansBold,
    fontSize: 20,
    color: colors.text,
    lineHeight: 22,
  },
  metricLabel: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.xs,
    color: colors.subtext,
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // Foco — ação principal da Home
  focusHero: {
    width: '100%',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: radii.lg,
    marginBottom: spacing.xl,
    ...shadows.primaryBtn,
  },
  focusHeroIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusHeroTextBlock: { flex: 1 },
  focusHeroTitle: {
    fontFamily: fontFamily.serif,
    fontSize: 18,
    color: colors.offWhite,
    marginBottom: 3,
  },
  focusHeroSubtitle: {
    fontFamily: fontFamily.sans,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 17,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.sm,
    color: colors.text,
    letterSpacing: 1,
  },
  sectionRightBtn: {
    fontFamily: fontFamily.sansSemi,
    fontSize: 12,
    color: colors.primary,
  },

  // Calendário strip
  calendarCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 6,
    ...shadows.sm,
  },
  calendarStrip: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 2,
  },
  calDayWrapper: {
    alignItems: 'center',
    flex: 1,
    minWidth: 38,
  },
  calDay: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    width: '100%',
  },
  calDayActive: {
    backgroundColor: colors.warmMid,
  },
  calDaySub: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.xs,
    color: colors.subtext,
    marginBottom: 4,
  },
  calDaySubActive: {
    color: '#8A6A2F',
    fontFamily: fontFamily.sansBold,
  },
  calDayNum: {
    fontFamily: fontFamily.sansBold,
    fontSize: 13,
    color: colors.text,
  },
  calDayNumActive: {
    color: '#8A6A2F',
  },
  calDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 5,
  },

  // Conquistas
  achievementsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.lg,
  },
  achievementBadge: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    width: 92,
    ...shadows.sm,
  },
  achievementBadgeLocked: {
    opacity: 0.45,
  },
  achievementLabel: {
    fontFamily: fontFamily.sansSemi,
    fontSize: 10.5,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 13,
  },
  achievementLabelLocked: {
    color: colors.subtext,
  },

  // Performance
  performanceCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    padding: 18,
    marginBottom: 10,
    ...shadows.sm,
  },
  progressRow: {
    // marginBottom set inline
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  progressName: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.md,
    color: colors.text,
  },
  progressGrade: {
    fontFamily: fontFamily.sansSemi,
    fontSize: 12,
    color: colors.subtext,
  },
  progressBarBg: {
    height: 7,
    backgroundColor: colors.warmLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  emptyText: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    color: colors.subtext,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
