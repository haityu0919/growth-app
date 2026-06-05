import { THEME } from '../constants/theme';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export function AdminCallScreen({ onBack, onSubmit, profile }) {
  const [reason, setReason] = useState('');
  const canSubmit = reason.trim().length >= 5;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>管理者と通話</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lead}>
          管理者へ通話リクエストを送ります。送信後、管理アプリ側で通知として確認できるように保存されます。
        </Text>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>現在の仕組み</Text>
          <Text style={styles.noticeText}>
            いまは管理アプリ本体がまだ無いため、サーバーの admin-call-requests.json に通知データを保存します。
          </Text>
        </View>

        <View style={styles.profileBox}>
          <Text style={styles.profileLabel}>申請者</Text>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileMeta}>{profile.ageGroup}・{profile.gender}</Text>
        </View>

        <Text style={styles.label}>通話したい理由</Text>
        <TextInput
          multiline
          style={styles.input}
          value={reason}
          onChangeText={setReason}
          placeholder="例: アカウントの安全確認について相談したい"
          placeholderTextColor={THEME.inputPlaceholder}
          textAlignVertical="top"
        />
      </ScrollView>

      <Pressable
        disabled={!canSubmit}
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={() => onSubmit(reason.trim())}
      >
        <Text style={styles.submitText}>管理者に通話リクエスト</Text>
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
    fontSize: 22,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    paddingBottom: 120,
  },
  lead: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  noticeBox: {
    backgroundColor: THEME.warningSurface,
    borderColor: THEME.warningBorder,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
  },
  noticeTitle: {
    color: THEME.notice,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  noticeText: {
    color: THEME.body,
    fontSize: 12,
    lineHeight: 18,
  },
  profileBox: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
  },
  profileLabel: {
    color: THEME.textMuted,
    fontSize: 12,
  },
  profileName: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  profileMeta: {
    color: THEME.link,
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    color: THEME.text,
    fontSize: 15,
    minHeight: 140,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  submitButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    marginBottom: 24,
    paddingVertical: 16,
  },
  submitButtonDisabled: {
    backgroundColor: THEME.disabledButton,
    opacity: 0.6,
  },
  submitText: {
    color: THEME.primaryText,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
