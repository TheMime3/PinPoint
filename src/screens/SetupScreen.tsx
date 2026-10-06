import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export function SetupScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>PINPOINT MVP</Text>
      <Text style={styles.title}>Phone setup</Text>
      <Text style={styles.subtitle}>
        This MVP uses a single rear camera and the known diameter of a golf ball to estimate the
        initial 3D launch vector. Consistent phone placement matters.
      </Text>

      <View style={styles.card}>
        <Step number="1" title="Use a stable stand">
          Place the iPhone on a tripod or solid mount. Do not hand-hold it.
        </Step>
        <Step number="2" title="Start behind the ball">
          Begin about 6–8 ft behind the ball, roughly aligned with the intended target line.
        </Step>
        <Step number="3" title="Raise the camera">
          Start with the rear camera roughly 24–36 in above the hitting surface and point it toward
          the ball.
        </Step>
        <Step number="4" title="Portrait orientation">
          Keep the phone upright. Use the roll and pitch indicators on the launch screen to make the
          setup repeatable.
        </Step>
        <Step number="5" title="Use good light">
          The MVP detector expects the golf ball to be visibly brighter than its nearby background.
          Avoid severe backlighting and motion blur.
        </Step>
      </View>

      <View style={styles.warning}>
        <Text style={styles.warningTitle}>Experimental measurement engine</Text>
        <Text style={styles.warningText}>
          The camera/tracking code is implemented, but its accuracy and reliability cannot be
          confirmed until this exact build is tested on a physical iPhone and benchmarked against a
          trusted launch monitor.
        </Text>
      </View>

      <Pressable style={styles.primary} onPress={onContinue}>
        <Text style={styles.primaryText}>OPEN LAUNCH MONITOR</Text>
      </Pressable>
    </ScrollView>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.step}>
      <View style={styles.number}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
      <View style={styles.stepBody}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepText}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.navy,
    padding: 24,
    paddingTop: 72,
    gap: 18,
  },
  eyebrow: {
    color: colors.greenBright,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  title: { color: colors.white, fontSize: 38, fontWeight: '900' },
  subtitle: { color: colors.coolGray, fontSize: 16, lineHeight: 24 },
  card: {
    backgroundColor: colors.cardAlt,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 18,
  },
  step: { flexDirection: 'row', gap: 12 },
  number: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { color: colors.white, fontWeight: '900' },
  stepBody: { flex: 1 },
  stepTitle: { color: colors.white, fontSize: 16, fontWeight: '800' },
  stepText: { color: colors.coolGray, marginTop: 4, lineHeight: 20 },
  warning: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  warningTitle: { color: colors.amber, fontWeight: '900', fontSize: 14 },
  warningText: { color: colors.coolGray, marginTop: 6, lineHeight: 20 },
  primary: {
    backgroundColor: colors.green,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryText: { color: colors.black, fontWeight: '900', letterSpacing: 0.7 },
});
