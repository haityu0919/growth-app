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

const AGE_GROUPS = ['10代', '20代', '30代', '40代', '50代', '60代以上'];
const GENDERS = ['男性', '女性', 'その他', '回答しない'];

export function ProfileScreen({ onBack, onSave, profile }) {
  const [name, setName] = useState(profile.name);
  const [ageGroup, setAgeGroup] = useState(profile.ageGroup);
  const [gender, setGender] = useState(profile.gender);
  const [bio, setBio] = useState(profile.bio);

  const canSave = name.trim().length > 0 && bio.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>プロフィール</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lead}>
          相手に見えるプロフィールです。個人情報は書かず、話しやすい内容にしましょう。
        </Text>

        <Text style={styles.label}>名前</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="例: たろう"
          placeholderTextColor={THEME.inputPlaceholder}
        />

        <Text style={styles.label}>年齢</Text>
        <View style={styles.ageGrid}>
          {AGE_GROUPS.map((group) => (
            <Pressable
              key={group}
              style={[styles.ageButton, ageGroup === group && styles.ageSelected]}
              onPress={() => setAgeGroup(group)}
            >
              <Text style={[styles.ageText, ageGroup === group && styles.ageTextSelected]}>
                {group}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>性別</Text>
        <View style={styles.optionGrid}>
          {GENDERS.map((option) => (
            <Pressable
              key={option}
              style={[styles.optionButton, gender === option && styles.optionSelected]}
              onPress={() => setGender(option)}
            >
              <Text style={[styles.optionText, gender === option && styles.optionTextSelected]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>プロフィール</Text>
        <TextInput
          multiline
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="例: 雑談が好きです。音楽と映画の話ができます。"
          placeholderTextColor={THEME.inputPlaceholder}
          textAlignVertical="top"
        />

        <View style={styles.preview}>
          <Text style={styles.previewTitle}>相手からの見え方</Text>
          <Text style={styles.previewName}>{name || '名前未設定'}</Text>
          <Text style={styles.previewMeta}>{ageGroup}・{gender}</Text>
          <Text style={styles.previewBio}>{bio || 'プロフィール未入力'}</Text>
        </View>
      </ScrollView>

      <Pressable
        disabled={!canSave}
        style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        onPress={() => onSave({ name: name.trim(), ageGroup, gender, bio: bio.trim() })}
      >
        <Text style={styles.saveText}>保存する</Text>
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
    marginBottom: 18,
  },
  label: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    color: THEME.text,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bioInput: {
    minHeight: 112,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ageButton: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ageSelected: {
    backgroundColor: THEME.premiumCardBg,
    borderColor: THEME.primary,
  },
  ageText: {
    color: THEME.body,
    fontWeight: '600',
  },
  ageTextSelected: {
    color: THEME.text,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  optionSelected: {
    backgroundColor: THEME.premiumCardBg,
    borderColor: THEME.primary,
  },
  optionText: {
    color: THEME.body,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: THEME.text,
  },
  preview: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 24,
    padding: 16,
  },
  previewTitle: {
    color: THEME.textMuted,
    fontSize: 12,
    marginBottom: 10,
  },
  previewName: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: '700',
  },
  previewMeta: {
    color: THEME.link,
    fontSize: 13,
    marginTop: 4,
  },
  previewBio: {
    color: THEME.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    marginBottom: 24,
    paddingVertical: 16,
  },
  saveButtonDisabled: {
    backgroundColor: THEME.disabledButton,
    opacity: 0.6,
  },
  saveText: {
    color: THEME.primaryText,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
