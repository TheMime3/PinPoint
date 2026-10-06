import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useKeepAwake } from 'expo-keep-awake';
import {
  isPinPointNativeAvailable,
  PinPointCameraView,
  type NativeDiagnosticsEvent,
  type NativeShotEvent,
} from 'pinpoint-launch-monitor';
import { ClubPicker } from '../components/ClubPicker';
import { MetricCard } from '../components/MetricCard';
import { QualityBar } from '../components/QualityBar';
import { ShotTracer } from '../components/ShotTracer';
import { StatePill } from '../components/StatePill';
import type {
  BallDetection,
  Club,
  Diagnostics,
  LaunchState,
  NativeShotMeasurement,
  Shot,
} from '../models/types';
import { createShot } from '../services/shotFactory';
import { colors } from '../theme/colors';

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

export function LaunchScreen({
  nextShotNumber,
  onShot,
  onDiagnostics,
}: {
  nextShotNumber: number;
  onShot: (shot: Shot) => void;
  onDiagnostics: (diagnostics: Diagnostics) => void;
}) {
  useKeepAwake();

  const [club, setClub] = useState<Club>('7 Iron');
  const [state, setState] = useState<LaunchState>('SEARCHING_FOR_BALL');
  const [message, setMessage] = useState('Place a golf ball inside the target zone.');
  const [detection, setDetection] = useState<BallDetection | null>(null);
  const [diagnostics, setDiagnostics] = useState<Diagnostics>(EMPTY_DIAGNOSTICS);
  const [latestShot, setLatestShot] = useState<Shot | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualX, setManualX] = useState(0.5);
  const [manualY, setManualY] = useState(0.7);
  const [resetNonce, setResetNonce] = useState(0);
  const [overlaySize, setOverlaySize] = useState({ width: 1, height: 1 });
  const shotNumberRef = useRef(nextShotNumber);

  useEffect(() => {
    shotNumberRef.current = nextShotNumber;
  }, [nextShotNumber]);

  useEffect(() => {
    onDiagnostics(diagnostics);
  }, [diagnostics, onDiagnostics]);

  useEffect(() => {
    if (!latestShot) return;
    const timer = setTimeout(() => {
      setLatestShot(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [latestShot]);

  const nativeAvailable = isPinPointNativeAvailable();

  const lightingColor =
    diagnostics.lightingState === 'OK'
      ? colors.greenBright
      : diagnostics.lightingState === 'UNKNOWN'
        ? colors.coolGray
        : colors.amber;

  const handleShot = (event: { nativeEvent: NativeShotEvent }) => {
    const measurement: NativeShotMeasurement = event.nativeEvent;
    const shot = createShot(measurement, club, shotNumberRef.current);
    setLatestShot(shot);
    onShot(shot);
  };

  const createDemoShot = () => {
    const shot = createShot(
      {
        ballSpeedMph: 118.4,
        launchAngleDeg: 17.6,
        launchDirectionDeg: 1.4,
        measurementQuality: 0.92,
        framesTracked: 9,
        trackingConfidence: 0.91,
        processingTimeMs: 18,
      },
      club,
      shotNumberRef.current
    );
    setLatestShot(shot);
    onShot(shot);
  };

  const onOverlayLayout = (event: LayoutChangeEvent) => {
    setOverlaySize({
      width: Math.max(1, event.nativeEvent.layout.width),
      height: Math.max(1, event.nativeEvent.layout.height),
    });
  };

  const overlay = useMemo(() => {
    const visibleDetection = detection && detection.confidence > 0 ? detection : null;
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={styles.targetWrap}>
          <View style={styles.targetCircle} />
          <Text style={styles.targetLabel}>PLACE BALL HERE</Text>
        </View>

        {visibleDetection ? (
          <View
            style={[
              styles.ballBox,
              {
                left: `${Math.max(0, (visibleDetection.centerX - visibleDetection.diameter / 2) * 100)}%`,
                top: `${Math.max(0, (visibleDetection.centerY - visibleDetection.diameter / 2) * 100)}%`,
                width: `${Math.max(3.5, visibleDetection.diameter * 100)}%`,
                borderColor:
                  visibleDetection.confidence >= 0.75 ? colors.greenBright : colors.amber,
              },
            ]}
          >
            <Text style={styles.ballConfidence}>
              {Math.round(visibleDetection.confidence * 100)}%
            </Text>
          </View>
        ) : null}

        <View style={styles.alignment}>
          <Text
            style={[
              styles.alignText,
              { color: Math.abs(diagnostics.rollDeg) <= 3 ? colors.greenBright : colors.amber },
            ]}
          >
            ROLL {diagnostics.rollDeg.toFixed(1)}°
          </Text>
          <Text
            style={[
              styles.alignText,
              {
                color:
                  Math.abs(diagnostics.pitchDeg) >= 5 && Math.abs(diagnostics.pitchDeg) <= 35
                    ? colors.greenBright
                    : colors.amber,
              },
            ]}
          >
            PITCH {diagnostics.pitchDeg.toFixed(1)}°
          </Text>
          <Text style={[styles.alignText, { color: lightingColor }]}>
            LIGHT {diagnostics.lightingState}
          </Text>
        </View>
      </View>
    );
  }, [detection, diagnostics, lightingColor]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>PinPoint</Text>
          <Text style={styles.subtitle}>Golf Launch Monitor · MVP</Text>
        </View>
        <StatePill state={state} />
      </View>

      <View style={styles.cameraShell}>
        <PinPointCameraView
          style={StyleSheet.absoluteFill}
          resetNonce={resetNonce}
          manualLockEnabled={manualMode}
          manualLockX={manualX}
          manualLockY={manualY}
          onStateChanged={(event) => {
            setState(event.nativeEvent.state);
            setMessage(event.nativeEvent.message ?? '');
          }}
          onDetection={(event) => {
            const d = event.nativeEvent;
            setDetection(d.confidence > 0 ? d : null);
          }}
          onDiagnostics={(event: { nativeEvent: NativeDiagnosticsEvent }) => {
            const next = event.nativeEvent as Diagnostics;
            setDiagnostics(next);
          }}
          onShot={handleShot}
        />

        <Pressable
          style={StyleSheet.absoluteFill}
          onLayout={onOverlayLayout}
          pointerEvents={manualMode ? 'auto' : 'none'}
          onPress={(event) => {
            if (!manualMode) return;
            setManualX(event.nativeEvent.locationX / overlaySize.width);
            setManualY(event.nativeEvent.locationY / overlaySize.height);
            setResetNonce((v) => v + 1);
          }}
        />

        {overlay}

        <View style={styles.stateMessage}>
          <Text style={styles.stateMessageText}>{message}</Text>
        </View>

        {latestShot ? (
          <View style={styles.resultOverlay}>
            <Text style={styles.resultClub}>{latestShot.club.toUpperCase()}</Text>
            <ShotTracer points={latestShot.trajectory} height={150} />
            <Text style={styles.carry}>{Math.round(latestShot.carryYards)} YDS</Text>
            <View style={styles.metricGrid}>
              <MetricCard label="BALL SPEED" value={`${latestShot.ballSpeedMph.toFixed(1)} mph`} />
              <MetricCard label="LAUNCH" value={`${latestShot.launchAngleDeg.toFixed(1)}°`} />
              <MetricCard
                label="DIRECTION"
                value={`${Math.abs(latestShot.launchDirectionDeg).toFixed(1)}° ${
                  latestShot.launchDirectionDeg >= 0 ? 'R' : 'L'
                }`}
              />
              <MetricCard
                label="CARRY"
                value={`${Math.round(latestShot.carryYards)} yd`}
                kind="CALCULATED"
              />
            </View>
            <QualityBar quality={latestShot.measurementQuality} />
            <Text style={styles.autoReset}>Automatically re-arming for the next ball…</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.controls}>
        <ClubPicker value={club} onChange={setClub} />

        <View style={styles.controlRow}>
          <Pressable
            style={[styles.secondaryButton, manualMode && styles.secondaryButtonActive]}
            onPress={() => {
              setManualMode((v) => !v);
              setResetNonce((v) => v + 1);
            }}
          >
            <Text style={styles.secondaryText}>
              {manualMode ? 'AUTO CALIBRATION' : 'MANUAL BALL LOCK'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => setResetNonce((v) => v + 1)}
          >
            <Text style={styles.secondaryText}>RESET</Text>
          </Pressable>
        </View>

        {manualMode ? (
          <Text style={styles.manualHint}>Tap directly on the golf ball in the camera view.</Text>
        ) : null}

        {!nativeAvailable ? (
          <View style={styles.demoCard}>
            <Text style={styles.demoTitle}>Expo Go / non-native preview</Text>
            <Text style={styles.demoText}>
              The custom Swift camera module is not loaded. Use an EAS iOS development build for
              real camera tracking. You can still test the UI with a demo shot.
            </Text>
            <Pressable style={styles.demoButton} onPress={createDemoShot}>
              <Text style={styles.demoButtonText}>GENERATE DEMO SHOT</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.navy },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { color: colors.white, fontSize: 27, fontWeight: '900' },
  subtitle: { color: colors.coolGray, fontSize: 11, marginTop: 2 },
  cameraShell: {
    width: '100%',
    aspectRatio: 9 / 16,
    maxHeight: '72%',
    backgroundColor: colors.black,
    overflow: 'hidden',
    position: 'relative',
  },
  targetWrap: {
    position: 'absolute',
    left: '35%',
    top: '56%',
    width: '30%',
    alignItems: 'center',
  },
  targetCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.78)',
  },
  targetLabel: {
    color: colors.white,
    marginTop: 8,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    backgroundColor: colors.overlay,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  ballBox: {
    position: 'absolute',
    minWidth: 26,
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 999,
  },
  ballConfidence: {
    position: 'absolute',
    top: -22,
    alignSelf: 'center',
    color: colors.white,
    backgroundColor: colors.overlay,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 10,
    fontWeight: '900',
  },
  alignment: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    maxWidth: '90%',
  },
  alignText: {
    backgroundColor: colors.overlay,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
    fontSize: 10,
    fontWeight: '900',
  },
  stateMessage: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: colors.overlay,
    padding: 10,
    borderRadius: 10,
  },
  stateMessageText: { color: colors.white, textAlign: 'center', fontWeight: '700' },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 27, 51, 0.96)',
    padding: 18,
    justifyContent: 'center',
    gap: 10,
  },
  resultClub: {
    color: colors.greenBright,
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  carry: { color: colors.white, textAlign: 'center', fontSize: 42, fontWeight: '900' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  autoReset: { color: colors.coolGray, textAlign: 'center', fontSize: 11 },
  controls: { padding: 12, gap: 9 },
  controlRow: { flexDirection: 'row', gap: 8 },
  secondaryButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardAlt,
    paddingHorizontal: 8,
  },
  secondaryButtonActive: { borderColor: colors.green, backgroundColor: 'rgba(34,197,94,0.1)' },
  secondaryText: { color: colors.white, fontSize: 10, fontWeight: '900', textAlign: 'center' },
  manualHint: { color: colors.amber, fontSize: 11, textAlign: 'center' },
  demoCard: {
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: colors.amber,
    borderRadius: 14,
    padding: 12,
  },
  demoTitle: { color: colors.amber, fontWeight: '900' },
  demoText: { color: colors.coolGray, fontSize: 12, lineHeight: 17, marginTop: 4 },
  demoButton: { backgroundColor: colors.blue, borderRadius: 10, padding: 10, marginTop: 10 },
  demoButtonText: { color: colors.white, fontWeight: '900', textAlign: 'center', fontSize: 11 },
});
