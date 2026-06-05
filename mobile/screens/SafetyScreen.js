import { THEME } from '../constants/theme';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function SafetyScreen({
  blockedFriends,
  reports,
  onBack,
  onUnblock,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>安全管理</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ブロック中</Text>
          {blockedFriends.length === 0 ? (
            <Text style={styles.empty}>ブロック中の相手はいません。</Text>
          ) : (
            blockedFriends.map((friend) => (
              <View key={friend.id} style={styles.row}>
                <View>
                  <Text style={styles.name}>{friend.name}</Text>
                  <Text style={styles.meta}>チャット・通話の対象外</Text>
                </View>
                <Pressable style={styles.smallButton} onPress={() => onUnblock(friend)}>
                  <Text style={styles.smallButtonText}>解除</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通報履歴（サーバー保存）</Text>
          {reports.length === 0 ? (
            <Text style={styles.empty}>通報履歴はありません。</Text>
          ) : (
            reports.map((report) => (
              <View key={report.id} style={styles.reportCard}>
                <Text style={styles.name}>{report.friendName}</Text>
                <Text style={styles.meta}>理由: {report.reason}</Text>
                <Text style={styles.meta}>{report.time}</Text>
              </View>
            ))
          )}
        </View>

        <Text style={styles.note}>
          通報とブロックは token-server/data の JSON ファイルに保存されます。メモ帳で開くと内容を確認できます。
        </Text>
      </ScrollView>
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
    gap: 18,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: THEME.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  empty: {
    color: THEME.textMuted,
    fontSize: 14,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  name: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  smallButton: {
    backgroundColor: THEME.surfaceMuted,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  smallButtonText: {
    color: THEME.text,
    fontWeight: '700',
  },
  reportCard: {
    borderTopColor: THEME.border,
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  note: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
});
