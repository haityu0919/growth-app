import { THEME } from '../constants/theme';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function SelectedCallScreen({ onFinish, user }) {
  const startedAtRef = useRef(Date.now());

  const finish = () => {
    const durationSeconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
    onFinish(user, durationSeconds);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>選択式通話</Text>
      <Text style={styles.title}>{user.name} さんと接続準備中</Text>
      <Text style={styles.meta}>{user.ageGroup}・{user.gender}</Text>
      <Text style={styles.bio}>{user.bio}</Text>

      <View style={styles.statusBox}>
        <Text style={styles.statusTitle}>相手が許可しました</Text>
        <Text style={styles.statusText}>
          現在は接続フローの確認画面です。音声通話は LiveKit の開発版アプリで有効化します。
        </Text>
      </View>

      <Pressable style={styles.endButton} onPress={finish}>
        <Text style={styles.endButtonText}>終了する</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    color: THEME.link,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  meta: {
    color: THEME.link,
    fontSize: 14,
    marginTop: 10,
  },
  bio: {
    color: THEME.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 18,
    textAlign: 'center',
  },
  statusBox: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 32,
    padding: 18,
    width: '100%',
  },
  statusTitle: {
    color: THEME.success,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  statusText: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
  endButton: {
    backgroundColor: THEME.surfaceMuted,
    borderColor: THEME.plannedBorder,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 32,
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  endButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
