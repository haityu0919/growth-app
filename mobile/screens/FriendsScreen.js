import { THEME } from '../constants/theme';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function FriendsScreen({
  blockedIds,
  friends,
  onBack,
  onBlock,
  onChat,
  onReport,
}) {
  const statusCounts = friends.reduce(
    (counts, friend) => ({
      ...counts,
      [friend.status || 'friend']: (counts[friend.status || 'friend'] || 0) + 1,
    }),
    {},
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>フレンド</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.lead}>
        この機能は現在準備中です。今後のアップデートで追加予定です。フレンド、申請中、申請されている相手を確認できます。
      </Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>フレンド: {statusCounts.friend || 0}人</Text>
        <Text style={styles.summaryText}>申請中: {statusCounts.outgoing || 0}人</Text>
        <Text style={styles.summaryText}>申請されている: {statusCounts.incoming || 0}人</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {friends.map((friend) => {
          const blocked = blockedIds.includes(friend.id);

          return (
            <View key={friend.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.name}>{friend.name}</Text>
                  <Text style={styles.meta}>{friend.lastSeen}</Text>
                </View>
                <View style={styles.badgeColumn}>
                  <Text style={[
                    styles.statusBadge,
                    friend.status === 'incoming' && styles.incomingBadge,
                    friend.status === 'outgoing' && styles.outgoingBadge,
                  ]}>
                    {getStatusLabel(friend.status)}
                  </Text>
                  {blocked ? <Text style={styles.blocked}>ブロック中</Text> : null}
                </View>
              </View>

              <Text style={styles.memo}>{friend.memo}</Text>

              <View style={styles.actions}>
                {friend.status === 'incoming' ? (
                  <>
                    <Pressable disabled style={[styles.actionButton, styles.plannedButton]}>
                      <Text style={styles.actionText}>承認準備中</Text>
                    </Pressable>
                    <Pressable disabled style={[styles.actionButton, styles.plannedButton]}>
                      <Text style={styles.actionText}>拒否準備中</Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    disabled={blocked || friend.status !== 'friend'}
                    style={[
                      styles.actionButton,
                      (blocked || friend.status !== 'friend') && styles.disabledButton,
                    ]}
                    onPress={() => onChat(friend)}
                  >
                    <Text style={styles.actionText}>
                      {friend.status === 'outgoing' ? '承認待ち' : 'チャット'}
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  disabled
                  style={[styles.actionButton, styles.plannedButton]}
                >
                  <Text style={styles.actionText}>通話準備中</Text>
                </Pressable>
                <Pressable style={styles.actionButton} onPress={() => onReport(friend)}>
                  <Text style={styles.actionText}>通報</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.dangerButton]}
                  onPress={() => onBlock(friend)}
                >
                  <Text style={styles.actionText}>{blocked ? '解除' : 'ブロック'}</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function getStatusLabel(status) {
  if (status === 'incoming') {
    return '申請されています';
  }
  if (status === 'outgoing') {
    return '申請中';
  }
  return 'フレンド';
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
    marginBottom: 16,
  },
  summaryBox: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    marginBottom: 16,
    padding: 14,
  },
  summaryText: {
    color: THEME.body,
    fontSize: 13,
  },
  list: {
    gap: 14,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  blocked: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'right',
  },
  badgeColumn: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    backgroundColor: '#2f5d46',
    borderRadius: 999,
    color: THEME.text,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  incomingBadge: {
    backgroundColor: THEME.primary,
  },
  outgoingBadge: {
    backgroundColor: '#6b5b2f',
  },
  memo: {
    color: THEME.body,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: THEME.surfaceMuted,
    borderRadius: 10,
    flex: 1,
    paddingVertical: 10,
  },
  dangerButton: {
    backgroundColor: '#4a2c3a',
  },
  plannedButton: {
    opacity: 0.65,
  },
  disabledButton: {
    opacity: 0.45,
  },
  actionText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
