import { THEME } from '../constants/theme';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function PrivacyPolicyScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>プライバシーポリシー</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>最終更新: 2026年5月21日</Text>

        <Section title="1. 運営者情報">
          だれトークは、松田 昌太が個人開発・運営するサービスです。問い合わせ先は、アプリ内の問い合わせ機能、または haityu09191213@gmail.com です。
        </Section>

        <Section title="2. 保存する情報">
          名前、年代、性別、プロフィール文、フレンド関係、チャット本文、通報内容、ブロック情報、問い合わせ内容、通話・配信の接続状態、プレミアム利用状態を保存する場合があります。
        </Section>

        <Section title="3. 保存しない方針">
          本名、住所、電話番号、LINE ID、Instagram / X などの外部SNS、学校名、勤務先、位置情報はアプリ内で交換禁止とし、原則として保存対象にしません。
        </Section>

        <Section title="4. 音声の扱い">
          原則として、通話およびラジオ配信の音声内容は録音しません。ただし、通報対応や安全管理のため、必要な範囲で接続情報や通報内容を確認する場合があります。
        </Section>

        <Section title="5. 利用目的">
          サービス提供、本人確認の補助、通報対応、不正利用の防止、安全なマッチング、問い合わせ対応、課金状態の確認、機能改善のために利用します。
        </Section>

        <Section title="6. 広告・広告ID">
          本アプリでは Google AdMob などの広告配信事業者による広告を表示する場合があります。広告配信のため、広告IDなどの端末情報が広告配信事業者に送信される場合があります。広告配信事業者の規約・プライバシーポリシーも適用されます。
        </Section>

        <Section title="7. 課金情報">
          プレミアムプランの決済は App Store または Google Play を通じて行われます。運営者は、課金状態や有効期限など、サービス提供に必要な範囲の情報を確認する場合があります。
        </Section>

        <Section title="8. 保存期間">
          通報、ブロック、チャット、問い合わせ内容は、安全管理・不正利用対策・問い合わせ対応のため、原則として6か月間保管します。
        </Section>

        <Section title="9. 通報対応">
          通報を受けた場合、運営者が内容を確認し、必要に応じて注意、機能制限、アカウント制限などの対応を行います。
        </Section>

        <Section title="10. 第三者提供">
          法令に基づく場合を除き、ユーザー情報を本人の同意なく第三者に提供しません。ただし、サービス提供に必要な範囲で、Supabase、LiveKit、Expo、Google AdMob、App Store、Google Play などの外部サービスを利用する場合があります。
        </Section>

        <Section title="11. 退会・データ削除">
          退会またはデータ削除を希望する場合は、アプリ内の問い合わせ機能、または haityu09191213@gmail.com へご連絡ください。本人確認後、合理的な範囲で対応します。ただし、通報対応、不正利用対策、法令対応に必要な情報は、削除依頼後も一定期間保管する場合があります。
        </Section>

        <Section title="12. 問い合わせ">
          本アプリに関する問い合わせ、データ削除依頼、プライバシーに関する相談は、アプリ内の問い合わせ機能、または haityu09191213@gmail.com までご連絡ください。
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
    fontSize: 20,
    fontWeight: '700',
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
