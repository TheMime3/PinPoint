import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DiagnosticsScreen } from './src/screens/DiagnosticsScreen';
import { LaunchScreen } from './src/screens/LaunchScreen';
import { SessionScreen } from './src/screens/SessionScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SetupScreen } from './src/screens/SetupScreen';
import type { Diagnostics, Shot } from './src/models/types';
import { clearSession, loadSession, saveSession } from './src/services/sessionStore';
import { colors } from './src/theme/colors';

type Tab = 'launch' | 'session' | 'settings' | 'diagnostics';

const EMPTY_DIAGNOSTICS: Diagnostics = {
  cameraFps: 0,
  captureWidth: 0,
  captureHeight: 0,
  exposureSeconds: 0,
  iso: 0,
  ballDetected: false,
  detectionConfidence: 0,
  framesTracked: 0,
  trackingConfidence: 0,
  rollDeg: 0,
  pitchDeg: 0,
  calibrationState: 'UNLOCKED',
  lightingState: 'UNKNOWN',
  lightingScore: 0,
  measurementQuality: 0,
  processingTimeMs: 0,
  cameraModel: 'rear-wide',
  state: 'SEARCHING_FOR_BALL',
};

export default function App() {
  const [tab, setTab] = useState<Tab>('launch');
  const [showSetup, setShowSetup] = useState(true);
  const [shots, setShots] = useState<Shot[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostics>(EMPTY_DIAGNOSTICS);
  const [diagnosticsUnlocked, setDiagnosticsUnlocked] = useState(false);

  useEffect(() => {
    loadSession().then(setShots);
  }, []);

  const addShot = useCallback((shot: Shot) => {
    setShots((current) => {
      const next = [...current, shot];
      void saveSession(next);
      return next;
    });
  }, []);

  const handleClear = useCallback(() => {
    setShots([]);
    void clearSession();
  }, []);

  if (showSetup) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <SetupScreen onContinue={() => setShowSetup(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.body}>
        {tab === 'launch' ? (
          <LaunchScreen
            nextShotNumber={shots.length + 1}
            onShot={addShot}
            onDiagnostics={setDiagnostics}
          />
        ) : null}

        {tab === 'session' ? <SessionScreen shots={shots} onClear={handleClear} /> : null}

        {tab === 'settings' ? (
          <SettingsScreen
            onOpenSetup={() => setShowSetup(true)}
            onUnlockDiagnostics={() => {
              setDiagnosticsUnlocked(true);
              setTab('diagnostics');
            }}
          />
        ) : null}

        {tab === 'diagnostics' ? <DiagnosticsScreen diagnostics={diagnostics} /> : null}
      </View>

      <View style={styles.tabs}>
        <TabButton label="LAUNCH" active={tab === 'launch'} onPress={() => setTab('launch')} />
        <TabButton label="SESSION" active={tab === 'session'} onPress={() => setTab('session')} />
        <TabButton label="SETTINGS" active={tab === 'settings'} onPress={() => setTab('settings')} />
        {diagnosticsUnlocked ? (
          <TabButton
            label="DIAG"
            active={tab === 'diagnostics'}
            onPress={() => setTab('diagnostics')}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  body: { flex: 1 },
  tabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 78,
    backgroundColor: 'rgba(8,27,51,0.98)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 18,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    minHeight: 44,
  },
  tabButtonActive: { backgroundColor: colors.card },
  tabText: { color: colors.coolGray, fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
  tabTextActive: { color: colors.greenBright },
});
