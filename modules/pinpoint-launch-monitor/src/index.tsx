import * as React from 'react';
import { Platform, View, Text, StyleSheet, ViewProps } from 'react-native';
import { requireNativeModule, requireNativeViewManager } from 'expo-modules-core';

export type NativeLaunchState =
  | 'SEARCHING_FOR_BALL'
  | 'BALL_FOUND'
  | 'CALIBRATING'
  | 'READY'
  | 'CAPTURING'
  | 'PROCESSING'
  | 'SHOT_COMPLETE'
  | 'ERROR';

export type NativeStateEvent = {
  state: NativeLaunchState;
  message?: string;
};

export type NativeDetectionEvent = {
  centerX: number;
  centerY: number;
  diameter: number;
  confidence: number;
  stableFrames: number;
};

export type NativeDiagnosticsEvent = {
  cameraFps: number;
  captureWidth: number;
  captureHeight: number;
  exposureSeconds: number;
  iso: number;
  ballDetected: boolean;
  detectionConfidence: number;
  framesTracked: number;
  trackingConfidence: number;
  rollDeg: number;
  pitchDeg: number;
  calibrationState: string;
  lightingState: 'UNKNOWN' | 'LOW' | 'OK' | 'BRIGHT';
  lightingScore: number;
  measurementQuality: number;
  processingTimeMs: number;
  cameraModel: string;
  state: NativeLaunchState;
  message?: string;
};

export type NativeShotEvent = {
  ballSpeedMph: number;
  launchAngleDeg: number;
  launchDirectionDeg: number;
  measurementQuality: number;
  framesTracked: number;
  trackingConfidence: number;
  processingTimeMs: number;
};

type Event<T> = { nativeEvent: T };

export type PinPointCameraViewProps = ViewProps & {
  resetNonce?: number;
  manualLockEnabled?: boolean;
  manualLockX?: number;
  manualLockY?: number;
  onStateChanged?: (event: Event<NativeStateEvent>) => void;
  onDetection?: (event: Event<NativeDetectionEvent>) => void;
  onDiagnostics?: (event: Event<NativeDiagnosticsEvent>) => void;
  onShot?: (event: Event<NativeShotEvent>) => void;
};

let NativeView: React.ComponentType<PinPointCameraViewProps> | null = null;
let NativeModule: { getEngineVersion?: () => string } | null = null;

if (Platform.OS === 'ios') {
  try {
    NativeView = requireNativeViewManager<PinPointCameraViewProps>('PinPointLaunchMonitor');
    NativeModule = requireNativeModule('PinPointLaunchMonitor');
  } catch {
    NativeView = null;
    NativeModule = null;
  }
}

export function isPinPointNativeAvailable(): boolean {
  return NativeView !== null;
}

export function nativeEngineVersion(): string {
  try {
    return NativeModule?.getEngineVersion?.() ?? 'native module unavailable';
  } catch {
    return 'native module unavailable';
  }
}

export function PinPointCameraView(props: PinPointCameraViewProps) {
  if (NativeView) {
    return <NativeView {...props} />;
  }

  return (
    <View style={[styles.fallback, props.style]}>
      <Text style={styles.fallbackTitle}>Native camera engine unavailable</Text>
      <Text style={styles.fallbackText}>
        PinPoint's real launch monitor requires an iOS development build. Expo Go can display the
        UI but cannot load this custom Swift module.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020817',
    padding: 24,
  },
  fallbackTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
  },
  fallbackText: {
    color: '#B6C2D1',
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
});
