import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LaunchState } from '../models/types';
import { colors } from '../theme/colors';

const labels: Record<LaunchState, string> = {
  SEARCHING_FOR_BALL: 'SEARCHING FOR BALL',
  BALL_FOUND: 'BALL FOUND',
  CALIBRATING: 'CALIBRATING',
  READY: 'READY',
  CAPTURING: 'CAPTURING',
  PROCESSING: 'PROCESSING',
  SHOT_COMPLETE: 'SHOT COMPLETE',
  ERROR: 'ERROR',
};

export function StatePill({ state }: { state: LaunchState }) {
  const success = state === 'READY' || state === 'SHOT_COMPLETE';
  const warning = state === 'BALL_FOUND' || state === 'CALIBRATING' || state === 'PROCESSING';
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: success ? colors.green : warning ? colors.amber : colors.blue },
      ]}
    >
      <Text style={styles.text}>{labels[state]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  text: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
