import { THEME } from '../constants/theme';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function HomeScreen({
  blockedCount,
  onContact,
  onPlannedFeatures,
  onProfile,
  onSafety,
  onPrivacy,
  onStartCall,
  onTerms,
  profile,
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>だれトーク</Text>
      <Text style={styles.subtitle}>誰と話す？ 誰の声を聴く？</Text>

      <Pressable style={styles.profileCard} onPress={onProfile}>
        <View>
          <Text style={styles.profileLabel}>あなたのプロフィール</Text>
          <Text style={styles.profileName}>{profile.name || '未設定'}</Text>
          <Text style={styles.profileMeta}>{profile.ageGroup}・{profile.gender}</Text>
        </View>
        <Text style={styles.profileEdit}>編集</Text>
      </Pressable>

      <Pressable style={styles.buttonPrimary} onPress={onStartCall}>
        <Text style={styles.buttonText}>ランダム通話</Text>
        <Text style={styles.buttonHint}>ボタン1つで誰かとつながる</Text>
      </Pressable>

      <View style={styles.menuGrid}>
        <Pressable style={styles.menuButton} onPress={onSafety}>
          <Text style={styles.menuText}>安全管理</Text>
          <Text style={styles.menuHint}>通報・ブロック</Text>
        </Pressable>

        <Pressable style={styles.menuButton} onPress={onContact}>
          <Text style={styles.menuText}>問い合わせ</Text>
          <Text style={styles.menuHint}>管理者へ送信</Text>
        </Pressable>
      </View>

      <Pressable style={styles.plannedButton} onPress={onPlannedFeatures}>
        <Text style={styles.plannedTitle}>その他の機能（準備中）</Text>
        <Text style={styles.plannedHint}>プレミアム・ラジオ・フレンドなど</Text>
      </Pressable>

      {blockedCount > 0 ? (
        <Text style={styles.notice}>
          ブロック中: {blockedCount}人
        </Text>
      ) : null}

      <Pressable style={styles.termsLink} onPress={onTerms}>
        <Text style={styles.termsText}>利用規約を見る</Text>
      </Pressable>

      <Pressable style={styles.privacyLink} onPress={onPrivacy}>
        <Text style={styles.termsText}>プライバシーポリシーを見る</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.textMuted,
    marginBottom: 24,
    textAlign: 'center',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    maxWidth: 320,
    padding: 16,
    width: '100%',
  },
  profileLabel: {
    color: THEME.textMuted,
    fontSize: 11,
    marginBottom: 5,
  },
  profileName: {
    color: THEME.text,
    fontSize: 17,
    fontWeight: '700',
  },
  profileMeta: {
    color: THEME.link,
    fontSize: 12,
    marginTop: 4,
  },
  profileEdit: {
    color: THEME.link,
    fontSize: 13,
    fontWeight: '700',
  },
  buttonPrimary: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: THEME.primary,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.primaryText,
  },
  buttonHint: {
    fontSize: 12,
    color: THEME.primaryHint,
    marginTop: 4,
  },
  menuGrid: {
    width: '100%',
    maxWidth: 320,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  menuButton: {
    flex: 1,
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 80,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '600',
  },
  menuHint: {
    color: THEME.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  plannedButton: {
    alignItems: 'center',
    backgroundColor: THEME.surfaceMuted,
    borderColor: THEME.plannedBorder,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    maxWidth: 320,
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%',
  },
  plannedTitle: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '600',
  },
  plannedHint: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  notice: {
    color: THEME.notice,
    fontSize: 12,
    marginTop: 16,
  },
  termsLink: {
    marginTop: 24,
  },
  privacyLink: {
    marginTop: 10,
  },
  termsText: {
    color: THEME.link,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
