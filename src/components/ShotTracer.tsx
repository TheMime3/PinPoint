import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import type { TrajectoryPoint } from '../models/types';
import { colors } from '../theme/colors';

export function ShotTracer({
  points,
  height = 170,
}: {
  points: TrajectoryPoint[];
  height?: number;
}) {
  const path = useMemo(() => {
    if (points.length < 2) return '';
    const maxZ = Math.max(...points.map((p) => Math.max(0.01, p.z)));
    const maxY = Math.max(...points.map((p) => Math.max(0.01, p.y)));
    const w = 320;
    const h = 140;
    return points
      .map((p, i) => {
        const x = 18 + (p.z / maxZ) * (w - 36);
        const y = h - 14 - (p.y / maxY) * (h - 35);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  }, [points]);

  return (
    <View style={[styles.container, { height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 320 150">
        <Line x1="12" y1="136" x2="308" y2="136" stroke={colors.border} strokeWidth="2" />
        {path ? <Path d={path} stroke={colors.greenBright} strokeWidth="5" fill="none" /> : null}
        <Circle cx="18" cy="136" r="6" fill={colors.white} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.cardAlt,
    borderRadius: 18,
    overflow: 'hidden',
  },
});
