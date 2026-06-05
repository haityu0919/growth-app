import { THEME } from '../constants/theme';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const REPORT_REASONS = [
  '暴言・嫌がらせ',
  '性的・不適切な発言',
  '個人情報を聞き出そうとした',
  '詐欺・勧誘',
  'なりすまし',
  'その他',
];

export function ReportScreen({ friend, onBack, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>通報</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.lead}>
        {friend.name} さんを通報します。理由を選んでください。通報後は運営確認の対象になります。
      </Text>

      <ScrollView contentContainerStyle={styles.reasonList}>
        {REPORT_REASONS.map((reason) => {
          const selected = reason === selectedReason;
          return (
            <Pressable
              key={reason}
              style={[styles.reasonButton, selected && styles.reasonSelected]}
              onPress={() => setSelectedReason(reason)}
            >
              <Text style={[styles.reasonText, selected && styles.reasonTextSelected]}>
                {reason}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        style={styles.submitButton}
        onPress={() => onSubmit(friend, selectedReason)}
      >
        <Text style={styles.submitText}>この理由で通報する</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  back: {
    color: THEME.link,
    fontSize: 15,
  },
  title: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 32,
  },
  lead: {
    color: THEME.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  reasonList: {
    gap: 12,
    paddingBottom: 20,
  },
  reasonButton: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  reasonSelected: {
    backgroundColor: THEME.premiumCardBg,
    borderColor: THEME.primary,
  },
  reasonText: {
    color: THEME.body,
    fontSize: 15,
  },
  reasonTextSelected: {
    color: THEME.text,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 14,
    marginBottom: 28,
    paddingVertical: 16,
  },
  submitText: {
    color: THEME.primaryText,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
