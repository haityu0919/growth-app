import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { THEME } from '../constants/theme';

export const PLANNED_MESSAGE =
  'この機能は現在準備中です。今後のアップデートで追加予定です。';

const PLANNED_FEATURES = [
  {
    id: 'premium',
    title: 'プレミアム',
    hint: '月額800円・広告非表示・フィルターなど',
    showDetail: true,
  },
  {
    id: 'selectCall',
    title: '相手を選んで通話',
    hint: '利用者一覧から相手を選んで通話',
  },
  {
    id: 'radio',
    title: 'だれラジオ',
    hint: '音声ラジオの聴取・配信',
  },
  {
    id: 'friends',
    title: 'フレンド',
    hint: 'フレンド追加・一覧',
  },
  {
    id: 'chat',
    title: 'チャット',
    hint: 'フレンド同士の定型メッセージ',
  },
  {
    id: 'adminCall',
    title: '管理者と通話',
    hint: '運営者への通話リクエスト',
  },
  {
    id: 'filter',
    title: '年齢・性別フィルター',
    hint: 'プレミアム会員向け',
  },
  {
    id: 'history',
    title: '通話履歴',
    hint: '過去の通話記録',
  },
];

export function PlannedFeaturesScreen({ onBack, onPremium }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← ホームに戻る</Text>
      </Pressable>

      <Text style={styles.title}>その他の機能</Text>
      <Text style={styles.subtitle}>以下は現在準備中です</Text>

      {PLANNED_FEATURES.map((feature) => (
        <Pressable
          key={feature.id}
          disabled={!feature.showDetail}
          style={[styles.card, feature.showDetail && styles.cardTappable]}
          onPress={feature.showDetail ? onPremium : undefined}
        >
          <Text style={styles.cardTitle}>{feature.title}</Text>
          <Text style={styles.cardHint}>{feature.hint}</Text>
          <Text style={styles.cardMessage}>{PLANNED_MESSAGE}</Text>
          {feature.showDetail ? (
            <Text style={styles.detailLink}>プレミアムの詳細を見る →</Text>
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.bg,
    flexGrow: 1,
    padding: 24,
    paddingTop: 56,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: THEME.link,
    fontSize: 15,
  },
  title: {
    color: THEME.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: THEME.textMuted,
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  cardTappable: {
    borderColor: THEME.primary,
  },
  cardTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardHint: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  cardMessage: {
    color: THEME.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  detailLink: {
    color: THEME.link,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
  },
});
