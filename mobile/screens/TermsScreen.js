import { THEME } from '../constants/theme';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function TermsScreen({ onAccept, onBack, requireAcceptance = false }) {
  const [hasReadAll, setHasReadAll] = useState(false);
  const [checked, setChecked] = useState(false);

  const canProceed = !requireAcceptance || (hasReadAll && checked);

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const reachedBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 24;

    if (reachedBottom) {
      setHasReadAll(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {requireAcceptance ? (
          <View style={styles.headerSpacer} />
        ) : (
          <Pressable onPress={onBack}>
            <Text style={styles.back}>戻る</Text>
          </Pressable>
        )}
        <Text style={styles.title}>利用規約</Text>
        <View style={styles.headerSpacer} />
      </View>

      {requireAcceptance ? (
        <Text style={styles.lead}>
          だれトークを利用するには、利用規約を最後まで読んで同意してください。
        </Text>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.updated}>最終更新: 2026年5月18日（開発中の仮文面）</Text>

        <Section title="1. 運営者情報">
          だれトークは、松田 昌太が個人開発・運営するサービスです。問い合わせ先は、アプリ内の問い合わせ機能、または haityu09191213@gmail.com です。
        </Section>

        <Section title="2. 目的">
          だれトークは、ランダム通話や音声ラジオ配信を通じて、ユーザー同士が安全に会話を楽しむためのサービスです。
        </Section>

        <Section title="3. 年齢制限">
          18歳未満の方は、保護者の同意を得たうえで本アプリを利用するものとします。保護者の同意なく利用していることが判明した場合、運営者は利用制限またはアカウント停止を行う場合があります。
        </Section>

        <Section title="4. 禁止事項">
          暴言、嫌がらせ、脅迫、差別的発言、性的な発言、わいせつな行為、未成年に不適切な接触、詐欺、勧誘、営業、外部サービスへの誘導、なりすまし、虚偽情報の登録、違法行為を禁止します。ビデオ通話、ビデオ配信、画像送信、URL送信も禁止です。
        </Section>

        <Section title="5. 個人情報の交換禁止">
          本名、住所、電話番号、LINE ID、Instagram / X などの外部SNS、学校名、勤務先など、個人を特定できる情報の交換を禁止します。
        </Section>

        <Section title="6. 通報・ブロック">
          ユーザーは不快・危険だと感じた相手を通報またはブロックできます。通報を受けた場合、運営者が内容を確認し、必要に応じて注意、機能制限、アカウント制限を行います。
        </Section>

        <Section title="7. アカウント停止・利用制限">
          運営者は、禁止事項への違反、通報・ブロック機能の悪用、法令または公序良俗に反する行為、その他安全な運営に支障があると判断した行為があった場合、事前の通知なく、投稿・通話・チャット・配信・アカウントの一部または全部を制限、停止、削除できるものとします。
        </Section>

        <Section title="8. 音声・配信">
          通話とラジオ配信は音声のみです。原則として、通話およびラジオ配信の音声内容は録音しません。ただし、通報対応や安全管理のため、必要な範囲で接続情報や通報内容を確認する場合があります。
        </Section>

        <Section title="9. 課金・プレミアム">
          プレミアムプランは月額800円です。決済は App Store または Google Play を通じて行われます。解約は各ストアのアカウント設定から行ってください。アプリを削除しただけでは解約されません。原則として購入後の返金はできません。返金の可否は App Store / Google Play の規定に従い、運営者が直接返金することはできません。課金開始前に、アプリ内で特定商取引法に基づく表示を確認できるようにします。
        </Section>

        <Section title="10. データ保存期間">
          通報、ブロック、チャット、問い合わせ内容は、安全管理・不正利用対策・問い合わせ対応のため、原則として6か月間保管します。
        </Section>

        <Section title="11. 退会・データ削除">
          退会またはデータ削除を希望する場合は、アプリ内の問い合わせ機能、または haityu09191213@gmail.com へご連絡ください。本人確認後、合理的な範囲で対応します。ただし、通報対応、不正利用対策、法令対応に必要な情報は、削除依頼後も一定期間保管する場合があります。
        </Section>

        <Section title="12. 免責">
          ユーザー間のトラブル、通信障害、サービス停止、利用制限、データ消失、その他本アプリの利用により発生した損害について、運営者は法令上認められる範囲で責任を負わないものとします。
        </Section>

        {requireAcceptance ? (
          <View style={styles.acceptBox}>
            <Text style={styles.readStatus}>
              {hasReadAll
                ? '最後まで確認しました。'
                : '下までスクロールすると同意チェックができます。'}
            </Text>

            <Pressable
              disabled={!hasReadAll}
              style={[styles.checkRow, !hasReadAll && styles.disabledCheckRow]}
              onPress={() => setChecked((current) => !current)}
            >
              <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.checkText}>
                利用規約をすべて読み、内容に同意します。
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {requireAcceptance ? (
        <Pressable
          disabled={!canProceed}
          style={[styles.acceptButton, !canProceed && styles.acceptButtonDisabled]}
          onPress={onAccept}
        >
          <Text style={styles.acceptButtonText}>同意してホームへ</Text>
        </Pressable>
      ) : null}
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
    fontSize: 24,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 32,
  },
  lead: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  content: {
    paddingBottom: 120,
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
  acceptBox: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    padding: 16,
  },
  readStatus: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  checkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  disabledCheckRow: {
    opacity: 0.45,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: THEME.link,
    borderRadius: 6,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  checkboxChecked: {
    backgroundColor: THEME.primary,
  },
  checkmark: {
    color: THEME.primaryText,
    fontSize: 18,
    fontWeight: '700',
  },
  checkText: {
    color: THEME.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  acceptButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    marginBottom: 24,
    marginTop: 12,
    paddingVertical: 16,
  },
  acceptButtonDisabled: {
    backgroundColor: THEME.disabledButton,
    opacity: 0.6,
  },
  acceptButtonText: {
    color: THEME.primaryText,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
