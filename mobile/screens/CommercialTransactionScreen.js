import { THEME } from '../constants/theme';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function CommercialTransactionScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>特定商取引法に基づく表示</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>最終更新: 2026年5月18日（開発中の仮文面）</Text>

        <Section title="販売事業者">
          松田 昌太
        </Section>

        <Section title="問い合わせ先">
          haityu09191213@gmail.com
        </Section>

        <Section title="販売価格">
          プレミアムプラン: 月額800円
        </Section>

        <Section title="商品・サービス内容">
          広告非表示、年齢・性別フィルター、優先マッチング、お気に入り枠の追加、ラジオ配信の優先表示、通話履歴の保存数アップを提供します。
        </Section>

        <Section title="支払い方法">
          App Store または Google Play のアプリ内課金を通じてお支払いいただきます。
        </Section>

        <Section title="サービス提供時期">
          決済完了後、プレミアム機能が利用可能になります。
        </Section>

        <Section title="解約方法">
          解約は App Store または Google Play のアカウント設定から行ってください。アプリを削除しただけでは解約されません。
        </Section>

        <Section title="返金について">
          原則として購入後の返金はできません。返金の可否は App Store または Google Play の規定に従います。
        </Section>

        <Section title="追加料金">
          通信料はユーザー負担です。通話やラジオ配信の利用時は、通信環境によりデータ通信料が発生する場合があります。
        </Section>

        <Section title="表記について">
          住所・電話番号など、法令上必要な情報については、請求があった場合に遅滞なく開示します。
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ children, title }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{children}</Text>
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
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    paddingBottom: 40,
  },
  updated: {
    color: THEME.textMuted,
    fontSize: 12,
    marginBottom: 14,
  },
  section: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  sectionTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionBody: {
    color: THEME.body,
    fontSize: 14,
    lineHeight: 22,
  },
});
