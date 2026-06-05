import { THEME } from '../constants/theme';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const QUICK_MESSAGES = [
  'ありがとう',
  'また話しましょう',
  '今は少しだけなら話せます',
  '今日はここまでにします',
  '不快だったので通話を終了します',
];

export function ChatScreen({
  friend,
  isBlocked,
  messages,
  onBack,
  onBlock,
  onReport,
  onSend,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <View>
          <Text style={styles.title}>{friend.name}</Text>
          <Text style={styles.subtitle}>フレンド同士だけのチャット</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.safetyRow}>
        <Pressable disabled style={[styles.safetyButton, styles.plannedCallButton]}>
          <Text style={styles.safetyText}>通話準備中</Text>
        </Pressable>
        <Pressable style={styles.safetyButton} onPress={() => onReport(friend)}>
          <Text style={styles.safetyText}>通報</Text>
        </Pressable>
        <Pressable style={[styles.safetyButton, styles.blockButton]} onPress={() => onBlock(friend)}>
          <Text style={styles.safetyText}>{isBlocked ? 'ブロック解除' : 'ブロック'}</Text>
        </Pressable>
      </View>

      <Text style={styles.ruleText}>
        初回リリースでは安全のため、短い定型メッセージだけ送信できます。困ったらいつでも通報・ブロックできます。
      </Text>

      <ScrollView contentContainerStyle={styles.messages}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.bubble,
              message.from === 'me' ? styles.myBubble : styles.friendBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.from === 'me' && styles.myMessageText,
              ]}
            >
              {message.text}
            </Text>
            <Text style={styles.time}>{message.time}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickMessageBox}>
        <Text style={styles.quickTitle}>
          {isBlocked ? 'ブロック中は送信できません' : '送れる定型メッセージ'}
        </Text>
        <View style={styles.quickGrid}>
          {QUICK_MESSAGES.map((message) => (
            <Pressable
              key={message}
              disabled={isBlocked}
              style={[styles.quickButton, isBlocked && styles.quickButtonDisabled]}
              onPress={() => onSend(friend.id, message)}
            >
              <Text style={styles.quickText}>{message}</Text>
            </Pressable>
          ))}
        </View>
      </View>
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
    marginBottom: 16,
  },
  back: {
    color: THEME.link,
    fontSize: 15,
  },
  title: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: THEME.textMuted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  safetyRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  safetyButton: {
    alignItems: 'center',
    backgroundColor: THEME.surfaceMuted,
    borderColor: THEME.plannedBorder,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 11,
  },
  blockButton: {
    backgroundColor: '#4a2c3a',
  },
  plannedCallButton: {
    opacity: 0.65,
  },
  safetyText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: '700',
  },
  ruleText: {
    color: THEME.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  messages: {
    gap: 12,
    paddingBottom: 20,
  },
  bubble: {
    borderRadius: 16,
    maxWidth: '82%',
    padding: 14,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: THEME.primary,
  },
  friendBubble: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.surfaceMuted,
  },
  messageText: {
    color: THEME.text,
    fontSize: 15,
    lineHeight: 21,
  },
  myMessageText: {
    color: THEME.primaryText,
  },
  time: {
    color: THEME.textMuted,
    fontSize: 10,
    marginTop: 6,
    textAlign: 'right',
  },
  quickMessageBox: {
    paddingBottom: 28,
    paddingTop: 10,
  },
  quickTitle: {
    color: THEME.textMuted,
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  quickButton: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  quickButtonDisabled: {
    opacity: 0.45,
  },
  quickText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
