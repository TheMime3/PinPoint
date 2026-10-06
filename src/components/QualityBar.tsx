import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function QualityBar({ quality }: { quality: number }) {
  const clamped = Math.max(0, Math.min(1, quality));
  const color = clamped >= 0.8 ? colors.green : clamped >= 0.6 ? colors.amber : colors.red;
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>MEASUREMENT QUALITY</Text>
        <Text style={styles.value}>{Math.round(clamped * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: colors.coolGray, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  value: { color: colors.white, fontSize: 12, fontWeight: '800' },
  track: { height: 8, borderRadius: 999, overflow: 'hidden', backgroundColor: colors.cardAlt },
  fill: { height: '100%', borderRadius: 999 },
});
