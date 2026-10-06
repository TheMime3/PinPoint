import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Diagnostics } from '../models/types';
import { colors } from '../theme/colors';

export function DiagnosticsScreen({ diagnostics }: { diagnostics: Diagnostics }) {
  const rows: Array<[string, string]> = [
    ['State', diagnostics.state],
    ['Camera FPS', diagnostics.cameraFps.toFixed(1)],
    ['Capture resolution', `${diagnostics.captureWidth} × ${diagnostics.captureHeight}`],
    [
      'Exposure / shutter',
      diagnostics.exposureSeconds > 0
        ? `1/${Math.max(1, Math.round(1 / diagnostics.exposureSeconds))} s`
        : 'Unavailable',
    ],
    ['ISO', diagnostics.iso > 0 ? diagnostics.iso.toFixed(0) : 'Unavailable'],
    ['Ball detected', diagnostics.ballDetected ? 'YES' : 'NO'],
    ['Detection confidence', `${Math.round(diagnostics.detectionConfidence * 100)}%`],
    ['Frames tracked', diagnostics.framesTracked.toString()],
    ['Tracking confidence', `${Math.round(diagnostics.trackingConfidence * 100)}%`],
    ['Phone roll', `${diagnostics.rollDeg.toFixed(1)}°`],
    ['Phone pitch', `${diagnostics.pitchDeg.toFixed(1)}°`],
    ['Calibration', diagnostics.calibrationState],
    ['Lighting', `${diagnostics.lightingState} (${Math.round(diagnostics.lightingScore * 100)}%)`],
    ['Measurement quality', `${Math.round(diagnostics.measurementQuality * 100)}%`],
    ['Processing time', `${diagnostics.processingTimeMs.toFixed(1)} ms`],
    ['Camera', diagnostics.cameraModel],
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Diagnostics</Text>
      <Text style={styles.subtitle}>
        Developer-facing telemetry for physical-device validation. Values update while the native
        Launch view is active.
      </Text>

      <View style={styles.card}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Validation rule</Text>
        <Text style={styles.noteText}>
          Do not make an accuracy claim from these diagnostics alone. Benchmark measured ball
          speed, launch angle, direction, carry, failure rate, and confidence against a trusted
          commercial launch monitor.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.navy },
  content: { padding: 18, paddingBottom: 110 },
  title: { color: colors.white, fontSize: 32, fontWeight: '900' },
  subtitle: { color: colors.coolGray, marginTop: 5, lineHeight: 20 },
  card: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: { color: colors.coolGray, flex: 1 },
  value: { color: colors.white, fontWeight: '800', flex: 1, textAlign: 'right' },
  note: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderColor: 'rgba(245,158,11,0.45)',
    borderWidth: 1,
  },
  noteTitle: { color: colors.amber, fontWeight: '900' },
  noteText: { color: colors.coolGray, marginTop: 5, lineHeight: 20 },
});
