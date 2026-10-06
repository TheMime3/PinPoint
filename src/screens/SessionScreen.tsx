import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Shot } from '../models/types';
import { colors } from '../theme/colors';

export function SessionScreen({
  shots,
  onClear,
}: {
  shots: Shot[];
  onClear: () => void;
}) {
  const averages = shots.length
    ? {
        speed: shots.reduce((s, x) => s + x.ballSpeedMph, 0) / shots.length,
        launch: shots.reduce((s, x) => s + x.launchAngleDeg, 0) / shots.length,
        carry: shots.reduce((s, x) => s + x.carryYards, 0) / shots.length,
        quality: shots.reduce((s, x) => s + x.measurementQuality, 0) / shots.length,
      }
    : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Session</Text>
          <Text style={styles.subtitle}>{shots.length} shot{shots.length === 1 ? '' : 's'}</Text>
        </View>
        {shots.length > 0 ? (
          <Pressable style={styles.clear} onPress={onClear}>
            <Text style={styles.clearText}>CLEAR</Text>
          </Pressable>
        ) : null}
      </View>

      {averages ? (
        <View style={styles.summary}>
          <Summary label="AVG SPEED" value={`${averages.speed.toFixed(1)} mph`} />
          <Summary label="AVG LAUNCH" value={`${averages.launch.toFixed(1)}°`} />
          <Summary label="AVG CARRY" value={`${Math.round(averages.carry)} yd`} />
          <Summary label="AVG QUALITY" value={`${Math.round(averages.quality * 100)}%`} />
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No shots yet</Text>
          <Text style={styles.emptyText}>
            Hit shots from the Launch tab. PinPoint stores the active MVP session locally on this
            device.
          </Text>
        </View>
      )}

      {shots
        .slice()
        .reverse()
        .map((shot) => (
          <View key={shot.id} style={styles.shot}>
            <View style={styles.shotHeader}>
              <Text style={styles.shotTitle}>
                #{shot.shotNumber} · {shot.club}
              </Text>
              <Text style={styles.time}>
                {new Date(shot.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.row}>
              <Cell label="BALL SPEED" value={`${shot.ballSpeedMph.toFixed(1)} mph`} />
              <Cell label="LAUNCH" value={`${shot.launchAngleDeg.toFixed(1)}°`} />
              <Cell
                label="DIRECTION"
                value={`${Math.abs(shot.launchDirectionDeg).toFixed(1)}° ${
                  shot.launchDirectionDeg >= 0 ? 'R' : 'L'
                }`}
              />
              <Cell label="CARRY" value={`${Math.round(shot.carryYards)} yd`} />
            </View>
            <Text style={styles.quality}>
              Measurement quality {Math.round(shot.measurementQuality * 100)}% ·{' '}
              {shot.framesTracked} tracked frames
            </Text>
          </View>
        ))}
    </ScrollView>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.navy },
  content: { padding: 18, paddingBottom: 110, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.white, fontSize: 32, fontWeight: '900' },
  subtitle: { color: colors.coolGray, marginTop: 3 },
  clear: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: colors.card },
  clearText: { color: colors.red, fontWeight: '900', fontSize: 11 },
  summary: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  summaryCard: {
    width: '48.5%',
    padding: 14,
    borderRadius: 15,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.coolGray, fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  summaryValue: { color: colors.white, fontSize: 21, fontWeight: '900', marginTop: 5 },
  empty: {
    padding: 24,
    borderRadius: 18,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: { color: colors.white, fontSize: 20, fontWeight: '900' },
  emptyText: { color: colors.coolGray, lineHeight: 21, marginTop: 6 },
  shot: {
    backgroundColor: colors.cardAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
  },
  shotHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  shotTitle: { color: colors.white, fontSize: 16, fontWeight: '900' },
  time: { color: colors.coolGray, fontSize: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '48.5%' },
  cellValue: { color: colors.white, fontSize: 16, fontWeight: '800', marginTop: 3 },
  quality: { color: colors.greenBright, fontSize: 11, fontWeight: '700' },
});
