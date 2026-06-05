import { THEME } from '../constants/theme';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const BENEFITS = [
  '広告非表示',
  '年齢・性別フィルター',
  '優先マッチング',
  'お気に入り枠の追加',
  'ラジオ配信の優先表示',
  '通話履歴を直近30件まで保存',
];

const VALUE_MESSAGES = [
  {
    title: '広告なしで会話に集中',
    body: '通話後広告を非表示にします。短い時間でも気持ちよく使えます。',
  },
  {
    title: '話したい相手を探しやすい',
    body: '年齢・性別フィルターで、ランダム通話でも条件に合う相手だけを探せます。',
  },
  {
    title: 'つながりやすさを上げる',
    body: '優先マッチングにより、通常ユーザーよりも通話相手を見つけやすくする想定です。',
  },
  {
    title: 'よく使う人ほど便利',
    body: 'お気に入り枠の追加や通話履歴30件保存で、また話したい相手を見つけやすくします。',
  },
];

export function PremiumScreen({ isPremium, onBack, onCommercialTransaction, onTogglePremium }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>プレミアム</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.planCard}>
          <Text style={styles.planLabel}>準備中</Text>
          <Text style={styles.price}>800円</Text>
          <Text style={styles.planText}>
            この機能は現在準備中です。今後のアップデートで追加予定です。機能解放後に課金・フィルター・通話履歴を開始します。
          </Text>
          <Text style={styles.status}>
            現在の状態: {isPremium ? 'プレミアム（開発確認中）' : '準備中'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>特典</Text>
        {BENEFITS.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>月額800円の価値</Text>
        {VALUE_MESSAGES.map((item) => (
          <View key={item.title} style={styles.valueBox}>
            <Text style={styles.valueTitle}>{item.title}</Text>
            <Text style={styles.valueBody}>{item.body}</Text>
          </View>
        ))}

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>初回リリースでの扱い</Text>
          <Text style={styles.noticeText}>
            この機能は現在準備中です。今後のアップデートで追加予定です。
            機能解放後に App Store / Google Play のアプリ内課金に差し替えます。
          </Text>
        </View>

        <Pressable style={styles.legalLink} onPress={onCommercialTransaction}>
          <Text style={styles.legalText}>特定商取引法に基づく表示を見る</Text>
        </Pressable>
      </ScrollView>

      <Pressable disabled style={[styles.actionButton, styles.actionButtonDisabled]} onPress={onTogglePremium}>
        <Text style={styles.actionText}>
          準備中
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.bg,
    flex: 1,
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
    paddingBottom: 110,
  },
  planCard: {
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderColor: THEME.primary,
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
  },
  planLabel: {
    color: THEME.link,
    fontSize: 13,
    fontWeight: '700',
  },
  price: {
    color: THEME.text,
    fontSize: 40,
    fontWeight: '800',
    marginTop: 8,
  },
  planText: {
    color: THEME.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  status: {
    color: THEME.notice,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
  },
  sectionTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 24,
  },
  benefitRow: {
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 14,
  },
  check: {
    color: THEME.success,
    fontSize: 18,
    fontWeight: '700',
  },
  benefitText: {
    color: THEME.text,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  valueBox: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
  },
  valueTitle: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  valueBody: {
    color: THEME.body,
    fontSize: 13,
    lineHeight: 20,
  },
  noticeBox: {
    backgroundColor: THEME.warningSurface,
    borderColor: THEME.warningBorder,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
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
  legalLink: {
    marginTop: 18,
    paddingVertical: 12,
  },
  legalText: {
    color: THEME.link,
    fontSize: 13,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  actionButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    marginBottom: 24,
    paddingVertical: 16,
  },
  actionButtonDisabled: {
    backgroundColor: THEME.disabledButton,
    opacity: 0.75,
  },
  actionText: {
    color: THEME.primaryText,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
