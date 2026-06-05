import { registerGlobals } from '@livekit/react-native';
import { AudioSession } from '@livekit/react-native';
import Constants from 'expo-constants';
import { ConnectionState, Room, RoomEvent } from 'livekit-client';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { THEME } from '../constants/theme';

export function isLiveKitSupported() {
  return Constants.appOwnership !== 'expo';
}

export function LiveKitVoiceSession({
  livekitUrl,
  onConnected,
  onError,
  onStatusChange,
  token,
}) {
  const [status, setStatus] = useState('connecting');
  const [remoteCount, setRemoteCount] = useState(0);

  useEffect(() => {
    if (!isLiveKitSupported()) {
      setStatus('unsupported');
      onStatusChange?.('unsupported');
      return undefined;
    }

    let room;
    let cancelled = false;

    const updateRemoteCount = (activeRoom) => {
      setRemoteCount(activeRoom.remoteParticipants.size);
    };

    const connect = async () => {
      try {
        registerGlobals();
        await AudioSession.startAudioSession();
        room = new Room();

        room.on(RoomEvent.ConnectionStateChanged, (state) => {
          if (cancelled) {
            return;
          }
          if (state === ConnectionState.Connected) {
            setStatus('connected');
            onStatusChange?.('connected');
            onConnected?.();
          }
        });

        room.on(RoomEvent.ParticipantConnected, () => {
          if (!cancelled) {
            updateRemoteCount(room);
          }
        });

        room.on(RoomEvent.ParticipantDisconnected, () => {
          if (!cancelled) {
            updateRemoteCount(room);
          }
        });

        room.on(RoomEvent.Disconnected, () => {
          if (!cancelled) {
            setStatus('disconnected');
            onStatusChange?.('disconnected');
          }
        });

        await room.connect(livekitUrl, token);
        await room.localParticipant.setMicrophoneEnabled(true);
        updateRemoteCount(room);

        if (!cancelled && room.state === ConnectionState.Connected) {
          setStatus('connected');
          onStatusChange?.('connected');
          onConnected?.();
        }
      } catch (error) {
        if (!cancelled) {
          const message = error?.message || '音声接続に失敗しました';
          setStatus('error');
          onStatusChange?.('error');
          onError?.(message);
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      if (room) {
        room.disconnect();
      }
      AudioSession.stopAudioSession().catch(() => {});
    };
  }, [livekitUrl, onConnected, onError, onStatusChange, token]);

  if (status === 'unsupported') {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>マッチング成功</Text>
        <Text style={styles.text}>
          音声通話は開発版アプリが必要です。{'\n'}
          Expo Go ではマッチングまで確認できます。
        </Text>
        <Text style={styles.note}>
          `開発版ビルド.bat` の手順でビルド後、2台でテストしてください。
        </Text>
      </View>
    );
  }

  if (status === 'connecting') {
    return (
      <View style={styles.box}>
        <ActivityIndicator color={THEME.primary} size="large" />
        <Text style={styles.text}>音声を接続しています…</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.box}>
        <Text style={styles.title}>音声接続エラー</Text>
        <Text style={styles.text}>
          マッチングは成功しましたが、音声ルームへの接続に失敗しました。
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>通話中</Text>
      <Text style={styles.text}>
        {remoteCount > 0
          ? '相手と音声でつながっています。'
          : '相手の接続を待っています…'}
      </Text>
      <Text style={styles.note}>マイクはオンです。終了するには下のボタンを押してください。</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 20,
    width: '100%',
  },
  title: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    color: THEME.body,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  note: {
    color: THEME.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    textAlign: 'center',
  },
});
