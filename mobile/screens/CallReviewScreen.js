import { THEME } from '../constants/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function CallReviewScreen({ onBlock, onNoProblem, onReport, target }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>通話はどうでしたか？</Text>
      <Text style={styles.subtitle}>
        {target.name} さんとの通話後確認です。問題があればすぐに通報・ブロックできます。
      </Text>

      <Pressable style={styles.primaryButton} onPress={onNoProblem}>
        <Text style={styles.primaryText}>問題なし</Text>
      </Pressable>

      <Pressable disabled style={styles.plannedButton}>
        <Text style={styles.plannedText}>フレンドになる（準備中）</Text>
        <Text style={styles.plannedNote}>この機能は現在準備中です。今後のアップデートで追加予定です。</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => onReport(target)}>
        <Text style={styles.secondaryText}>通報する</Text>
      </Pressable>

      <Pressable style={[styles.secondaryButton, styles.dangerButton]} onPress={() => onBlock(target)}>
        <Text style={styles.dangerButtonText}>ブロックする</Text>
      </Pressable>

      <Text style={styles.note}>
        通報内容は本番では運営確認に送信され、必要に応じて利用制限を行います。
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: THEME.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: THEME.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 32,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: THEME.primary,
    borderRadius: 14,
    paddingVertical: 16,
  },
  primaryText: {
    color: THEME.primaryText,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: THEME.surfaceMuted,
    borderColor: THEME.plannedBorder,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    paddingVertical: 16,
  },
  plannedButton: {
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    opacity: 0.65,
    paddingVertical: 16,
  },
  plannedText: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '700',
  },
  plannedNote: {
    color: THEME.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  dangerButton: {
    backgroundColor: THEME.dangerSurface,
    borderColor: THEME.danger,
  },
  dangerButtonText: {
    color: THEME.danger,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    color: THEME.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 24,
    textAlign: 'center',
  },
});
