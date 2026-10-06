import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { nativeEngineVersion } from 'pinpoint-launch-monitor';
import { colors } from '../theme/colors';

export function SettingsScreen({
  onOpenSetup,
  onUnlockDiagnostics,
}: {
  onOpenSetup: () => void;
  onUnlockDiagnostics: () => void;
}) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Settings</Text>

      <Pressable style={styles.card} onPress={onOpenSetup}>
        <Text style={styles.cardTitle}>Phone positioning guide</Text>
        <Text style={styles.cardText}>Review the MVP camera placement and lighting instructions.</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Measurement integrity</Text>
        <Text style={styles.cardText}>
          Ball speed, launch angle, and launch direction are produced by the experimental native
          measurement engine. Carry is calculated by the MVP flight model and currently assumes
          club-dependent spin because spin is not measured in the MVP.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Units</Text>
        <Text style={styles.cardText}>MVP display: mph, yards, degrees.</Text>
      </View>

      <Pressable style={styles.version} onLongPress={onUnlockDiagnostics} delayLongPress={900}>
        <Text style={styles.versionText}>PinPoint MVP 0.1</Text>
        <Text style={styles.versionSub}>Engine: {nativeEngineVersion()}</Text>
        <Text style={styles.versionHint}>Developer: long-press here for diagnostics</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.navy, padding: 18, gap: 12 },
  title: { color: colors.white, fontSize: 32, fontWeight: '900', marginBottom: 4 },
  card: {
    padding: 17,
    borderRadius: 17,
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { color: colors.white, fontSize: 16, fontWeight: '900' },
  cardText: { color: colors.coolGray, lineHeight: 20, marginTop: 5 },
  version: { marginTop: 'auto', alignItems: 'center', paddingBottom: 110, paddingTop: 20 },
  versionText: { color: colors.coolGray, fontWeight: '800' },
  versionSub: { color: colors.slate, fontSize: 11, marginTop: 3 },
  versionHint: { color: colors.slate, fontSize: 9, marginTop: 5 },
});
