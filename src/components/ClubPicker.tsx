import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CLUBS } from '../models/clubs';
import type { Club } from '../models/types';
import { colors } from '../theme/colors';

export function ClubPicker({
  value,
  onChange,
}: {
  value: Club;
  onChange: (club: Club) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable style={styles.button} onPress={() => setOpen(true)}>
        <Text style={styles.buttonLabel}>CLUB</Text>
        <Text style={styles.buttonValue}>{value} ▾</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.title}>Select club</Text>
            <ScrollView>
              {CLUBS.map((club) => (
                <Pressable
                  key={club}
                  style={[styles.row, club === value && styles.rowSelected]}
                  onPress={() => {
                    onChange(club);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.rowText}>{club}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.close} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonLabel: { color: colors.coolGray, fontSize: 11, fontWeight: '800' },
  buttonValue: { color: colors.white, fontSize: 16, fontWeight: '800' },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '75%',
    backgroundColor: colors.navy,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: { color: colors.white, fontSize: 22, fontWeight: '800', marginBottom: 12 },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowSelected: { backgroundColor: colors.card },
  rowText: { color: colors.white, fontSize: 17, fontWeight: '600' },
  close: { marginTop: 14, padding: 14, borderRadius: 12, backgroundColor: colors.blue },
  closeText: { color: colors.white, textAlign: 'center', fontWeight: '800' },
});
