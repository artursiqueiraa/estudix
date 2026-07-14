// ============================================================
//  ESTUDIX — GradeChart
//  Gráfico de barras simples (SVG) mostrando a evolução das
//  notas de uma matéria na ordem em que foram cadastradas.
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { colors, fontFamily, radii, shadows } from '../theme';

const CHART_W = 300;
const CHART_H = 100;
const BAR_GAP = 8;

export default function GradeChart({ notas }) {
  if (!notas || notas.length < 2) return null;

  const sorted = [...notas].sort((a, b) => a.id - b.id);
  const barW = Math.max(16, Math.min(36, (CHART_W - BAR_GAP * (sorted.length - 1)) / sorted.length));
  const totalW = sorted.length * barW + (sorted.length - 1) * BAR_GAP;
  const passLineY = CHART_H - (6 / 10) * CHART_H;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Evolução das notas</Text>
      <Svg width="100%" height={CHART_H + 22} viewBox={`0 0 ${Math.max(totalW, CHART_W)} ${CHART_H + 22}`}>
        <Line x1={0} y1={passLineY} x2={totalW} y2={passLineY} stroke={colors.border} strokeWidth={1} strokeDasharray="4,4" />
        {sorted.map((n, i) => {
          const barH = Math.max(4, (Math.min(n.value, 10) / 10) * CHART_H);
          const x = i * (barW + BAR_GAP);
          const color = n.value >= 6 ? colors.successLight : colors.accent;
          return (
            <React.Fragment key={n.id}>
              <Rect x={x} y={CHART_H - barH} width={barW} height={barH} rx={4} fill={color} />
              <SvgText x={x + barW / 2} y={CHART_H + 14} fontSize="9" fill={colors.subtext} textAnchor="middle">
                {n.value.toFixed(1)}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
      <Text style={styles.hint}>Linha pontilhada = média 6.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    padding: 16,
    marginBottom: 15,
    ...shadows.sm,
  },
  title: {
    fontFamily: fontFamily.sansBold,
    fontSize: 13,
    color: colors.text,
    marginBottom: 10,
  },
  hint: {
    fontFamily: fontFamily.sans,
    fontSize: 10.5,
    color: colors.subtext,
    textAlign: 'center',
    marginTop: 6,
  },
});
