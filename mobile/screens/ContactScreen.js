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

const CATEGORIES = ['不具合', '通報相談', '使い方', '要望', 'その他'];

export function ContactScreen({ onBack, onSubmit, profile }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const canSubmit = message.trim().length >= 5;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>問い合わせ</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lead}>
          管理者に問い合わせを送ります。送信内容はサーバーに保存され、管理者が確認できます。
        </Text>

        <View style={styles.profileBox}>
          <Text style={styles.profileLabel}>送信者</Text>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileMeta}>{profile.ageGroup}・{profile.gender}</Text>
        </View>

        <Text style={styles.label}>カテゴリ</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((item) => (
            <Pressable
              key={item}
              style={[styles.categoryButton, category === item && styles.categorySelected]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.categoryText, category === item && styles.categoryTextSelected]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>内容</Text>
        <TextInput
          multiline
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="困っていること、確認してほしいことを書いてください。"
          placeholderTextColor={THEME.inputPlaceholder}
          textAlignVertical="top"
        />
      </ScrollView>

      <Pressable
        disabled={!canSubmit}
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        onPress={() => onSubmit({ category, message: message.trim() })}
      >
        <Text style={styles.submitText}>問い合わせを送信</Text>
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
  content: {
    paddingBottom: 120,
  },
  lead: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
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
    marginTop: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categorySelected: {
    backgroundColor: THEME.premiumCardBg,
    borderColor: THEME.primary,
  },
  categoryText: {
    color: THEME.body,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: THEME.text,
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
