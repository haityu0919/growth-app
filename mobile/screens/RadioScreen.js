import { THEME } from '../constants/theme';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function RadioScreen({ blockedIds, isPremium, onBack, onFinishListen, rooms }) {
  const [listening, setListening] = useState(null);
  const visibleRooms = rooms
    .filter((room) => !blockedIds.includes(room.hostId))
    .sort((a, b) => {
      if (!isPremium) {
        return 0;
      }
      return Number(Boolean(b.premiumHost)) - Number(Boolean(a.premiumHost));
    });
  const hiddenCount = rooms.length - visibleRooms.length;

  if (listening) {
    const finish = () => {
      const durationSeconds = Math.floor((Date.now() - listening.startedAt) / 1000);
      onFinishListen(durationSeconds);
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => setListening(null)}>
            <Text style={styles.back}>戻る</Text>
          </Pressable>
          <Text style={styles.title}>ラジオ視聴中</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.listeningCard}>
          <Text style={styles.roomTitle}>{listening.room.title}</Text>
          <Text style={styles.host}>配信者: {listening.room.hostName}</Text>
          <Text style={styles.description}>
            音声ラジオを聴いている想定の画面です。本番では LiveKit の音声配信に接続します。
          </Text>
        </View>

        <Pressable style={styles.endButton} onPress={finish}>
          <Text style={styles.listenText}>聴き終わる</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>戻る</Text>
        </Pressable>
        <Text style={styles.title}>だれラジオ</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.lead}>
        音声配信のみです。ブロック中の相手の配信は表示されません。
      </Text>
      {hiddenCount > 0 ? (
        <Text style={styles.hiddenNotice}>
          ブロック中の相手の配信を {hiddenCount} 件非表示にしています。
        </Text>
      ) : null}

      <ScrollView contentContainerStyle={styles.list}>
        {visibleRooms.length === 0 ? (
          <Text style={styles.empty}>現在、視聴できる配信はありません。</Text>
        ) : (
          visibleRooms.map((room) => (
            <View key={room.id} style={styles.card}>
              <Text style={styles.roomTitle}>{room.title}</Text>
              <Text style={styles.host}>配信者: {room.hostName}</Text>
              {room.premiumHost ? (
                <Text style={styles.premiumBadge}>プレミアム優先表示</Text>
              ) : null}
              <Text style={styles.description}>{room.description}</Text>
              <Pressable
                style={styles.listenButton}
                onPress={() => setListening({ room, startedAt: Date.now() })}
              >
                <Text style={styles.listenText}>聴く（音声のみ）</Text>
              </Pressable>
            </View>
          ))
        )}
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
  lead: {
    color: THEME.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  hiddenNotice: {
    color: THEME.notice,
    fontSize: 12,
    marginBottom: 12,
  },
  list: {
    gap: 14,
    paddingBottom: 40,
  },
  empty: {
    color: THEME.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  roomTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
  },
  host: {
    color: THEME.link,
    fontSize: 12,
    marginTop: 6,
  },
  description: {
    color: THEME.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.premiumCardBg,
    borderRadius: 999,
    color: THEME.text,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  listeningCard: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },
  listenButton: {
    backgroundColor: THEME.primary,
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 13,
  },
  endButton: {
    backgroundColor: THEME.primary,
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 14,
  },
  listenText: {
    color: THEME.primaryText,
    fontWeight: '700',
    textAlign: 'center',
  },
});
