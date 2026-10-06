import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function MetricCard({
  label,
  value,
  kind = 'MEASURED',
}: {
  label: string;
  value: string;
  kind?: 'MEASURED' | 'CALCULATED';
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={[styles.kind, kind === 'CALCULATED' && styles.calculated]}>{kind}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.coolGray, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 },
  value: { color: colors.white, fontSize: 22, fontWeight: '800', marginTop: 5 },
  kind: { color: colors.greenBright, fontSize: 9, fontWeight: '800', marginTop: 6 },
  calculated: { color: colors.blueLight },
});
