import { THEME } from '../constants/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import { TOKEN_SERVER } from '../config';
import { LazyLiveKitVoiceSession } from '../components/LazyLiveKitVoiceSession';

const KUMORIN = require('../assets/kumorin-waiting.png');

const POLL_MS = 2000;
const AGE_FILTERS = ['すべて', '10代', '20代', '30代', '40代', '50代以上'];
const GENDER_FILTERS = ['すべて', '男性', '女性', 'その他', '回答しない'];

export function CallScreen({
  callFilter,
  isPremium,
  onBack,
  onFilterChange,
  onFinish,
  onPremium,
  profile,
}) {
  const { width: windowWidth } = useWindowDimensions();
  const kumorinWidth = Math.min(windowWidth * 0.85, 360);
  const kumorinHeight = kumorinWidth * (2 / 3);
  const [consented, setConsented] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [callCredentials, setCallCredentials] = useState(null);
  const sessionIdRef = useRef(null);
  const pollRef = useRef(null);
  const startedAtRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const leave = useCallback(async () => {
    stopPolling();
    const sessionId = sessionIdRef.current;
    if (sessionId) {
      try {
        await fetch(`${TOKEN_SERVER}/api/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
      } catch {
        /* ignore */
      }
    }
    sessionIdRef.current = null;
    setCallCredentials(null);
    const durationSeconds = startedAtRef.current
      ? Math.floor((Date.now() - startedAtRef.current) / 1000)
      : 0;
    startedAtRef.current = null;
    setPhase('idle');
    setMessage('');
    onFinish({
      id: 'random-call-partner',
      name: '通話相手',
      lastSeen: 'ランダム通話',
      memo: 'ランダム通話で接続した相手です。',
    }, durationSeconds);
  }, [onFinish, stopPolling]);

  const handleMatched = useCallback((data) => {
    if (!data?.token || !data?.livekitUrl) {
      setPhase('error');
      setError('マッチング情報を取得できませんでした。サーバーを再起動してください。');
      return;
    }

    setCallCredentials({
      token: data.token,
      livekitUrl: data.livekitUrl,
    });
    setPhase('inCall');
    setMessage(
      Constants.appOwnership === 'expo'
        ? '相手が見つかりました！マッチング成功です。'
        : '相手が見つかりました！音声を接続しています…',
    );
    setError('');
  }, []);

  const pollStatus = useCallback((sessionId) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${TOKEN_SERVER}/api/status/${sessionId}`);
        const data = await res.json();
        if (data.status === 'matched') {
          stopPolling();
          handleMatched(data);
        }
      } catch {
        setError('サーバーとの接続が切れました');
        stopPolling();
        setPhase('error');
      }
    }, POLL_MS);
  }, [handleMatched, stopPolling]);

  const startCall = useCallback(async () => {
    setError('');
    setPhase('searching');
    setMessage('相手を探しています…');

    try {
      const res = await fetch(`${TOKEN_SERVER}/api/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filter: isPremium ? callFilter : null,
          profile,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'livekit_not_configured') {
          setPhase('error');
          setError(
            'LiveKit が未設定です。\nPCで token-server の .env を設定してください。',
          );
          return;
        }
        throw new Error(data.message || '接続に失敗しました');
      }

      sessionIdRef.current = data.sessionId;

      if (data.status === 'matched') {
        handleMatched(data);
        return;
      }

      if (data.status === 'waiting') {
        setPhase('waiting');
        setMessage('条件に合う相手を待っています…\n（別のスマホでもう1回「だれトークする」）');
        pollStatus(data.sessionId);
      }
    } catch (e) {
      setPhase('error');
      setError(
        `サーバーに接続できません。\nconfig.js の IP と token-server の起動を確認してください。\n\n${e.message}`,
      );
    }
  }, [callFilter, handleMatched, isPremium, pollStatus, profile]);

  useEffect(() => {
    if (!consented) {
      return undefined;
    }

    startedAtRef.current = Date.now();
    startCall();
    return () => {
      stopPolling();
      const sessionId = sessionIdRef.current;
      if (sessionId) {
        fetch(`${TOKEN_SERVER}/api/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        }).catch(() => {});
      }
    };
  }, [consented, startCall, stopPolling]);

  if (!consented) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>通話前の確認</Text>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>安全に利用するための注意</Text>
          <Text style={styles.noticeText}>
            本名・住所・電話番号・LINE ID・Instagram / X などの外部SNS・学校名・勤務先は話さないでください。
          </Text>
          <Text style={styles.noticeText}>
            不快な相手や危険を感じた相手は、通話後に通報・ブロックできます。
          </Text>
        </View>

        {profile.ageGroup === '10代' ? (
          <View style={styles.teenNoticeBox}>
            <Text style={styles.teenNoticeTitle}>10代の方への大切な注意</Text>
            <Text style={styles.teenNoticeText}>
              本名、学校名、SNS、住所、顔出し、会う約束は禁止です。
            </Text>
            <Text style={styles.teenNoticeText}>
              困ったときや不安を感じたときは、すぐに通話を終了し、通報・ブロックしてください。
            </Text>
          </View>
        ) : null}

        <View style={styles.filterBox}>
          <Text style={styles.filterTitle}>ランダム通話フィルター</Text>
          {isPremium ? (
            <>
              <Text style={styles.filterText}>
                {callFilter.ageGroup}・{callFilter.gender} の条件に合う相手だけを探します。
              </Text>

              <Text style={styles.filterLabel}>年齢</Text>
              <View style={styles.filterGrid}>
                {AGE_FILTERS.map((ageGroup) => (
                  <Pressable
                    key={ageGroup}
                    style={[
                      styles.filterButton,
                      callFilter.ageGroup === ageGroup && styles.filterButtonSelected,
                    ]}
                    onPress={() => onFilterChange({ ...callFilter, ageGroup })}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        callFilter.ageGroup === ageGroup && styles.filterButtonTextSelected,
                      ]}
                    >
                      {ageGroup}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.filterLabel}>性別</Text>
              <View style={styles.filterGrid}>
                {GENDER_FILTERS.map((gender) => (
                  <Pressable
                    key={gender}
                    style={[
                      styles.filterButton,
                      callFilter.gender === gender && styles.filterButtonSelected,
                    ]}
                    onPress={() => onFilterChange({ ...callFilter, gender })}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        callFilter.gender === gender && styles.filterButtonTextSelected,
                      ]}
                    >
                      {gender}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.filterText}>
                年齢・性別フィルターは月額800円のプレミアム特典です。
              </Text>
              <Pressable style={styles.premiumButton} onPress={onPremium}>
                <Text style={styles.premiumButtonText}>プレミアムを見る</Text>
              </Pressable>
            </>
          )}
        </View>

        <Pressable style={styles.startButton} onPress={() => setConsented(true)}>
          <Text style={styles.startButtonText}>同意して通話開始</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={onBack}>
          <Text style={styles.cancelButtonText}>戻る</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>だれトーク</Text>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeTitle}>通話前の注意</Text>
        <Text style={styles.noticeText}>
          本名・住所・電話番号・LINE ID・Instagram / X などの外部SNS・学校名・勤務先は話さないでください。
        </Text>
      </View>

      {(phase === 'searching' || phase === 'waiting') && (
        <View style={styles.kumorinBox}>
          <Image
            source={KUMORIN}
            style={[styles.kumorinImage, { width: kumorinWidth, height: kumorinHeight }]}
            resizeMode="contain"
            accessibilityLabel="くもりん"
          />
          <ActivityIndicator size="large" color={THEME.primary} style={styles.spinner} />
        </View>
      )}

      <Text style={styles.message}>{message}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {phase === 'inCall' && callCredentials ? (
        Constants.appOwnership === 'expo' ? (
          <View style={styles.expoGoBox}>
            <Text style={styles.expoGoTitle}>マッチング成功</Text>
            <Text style={styles.expoGoText}>
              相手が見つかりました。{'\n'}
              音声通話は開発版アプリが必要です。
            </Text>
            <Text style={styles.expoGoNote}>
              Expo Go では画面とマッチングまで確認できます。{'\n'}
              音声テストは「開発版ビルド.bat」をご利用ください。
            </Text>
          </View>
        ) : (
          <LazyLiveKitVoiceSession
            livekitUrl={callCredentials.livekitUrl}
            token={callCredentials.token}
            onConnected={() => {
              setMessage('通話中です。終了するには下のボタンを押してください。');
            }}
            onError={(voiceError) => {
              setError(`音声接続エラー: ${voiceError}`);
            }}
          />
        )
      ) : null}

      <Pressable style={styles.endButton} onPress={leave}>
        <Text style={styles.endButtonText}>終了する</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: 20,
  },
  noticeBox: {
    backgroundColor: THEME.card,
    borderColor: THEME.warningBorder,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 28,
    padding: 16,
    width: '100%',
  },
  noticeTitle: {
    color: THEME.notice,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  noticeText: {
    color: THEME.body,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  teenNoticeBox: {
    backgroundColor: THEME.warningSurface,
    borderColor: THEME.warningBorder,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
    padding: 16,
    width: '100%',
  },
  teenNoticeTitle: {
    color: THEME.notice,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  teenNoticeText: {
    color: THEME.text,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  filterBox: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
    padding: 16,
    width: '100%',
  },
  filterTitle: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  filterText: {
    color: THEME.body,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  filterLabel: {
    color: THEME.link,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 14,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  filterButton: {
    backgroundColor: THEME.filterLocked,
    borderColor: THEME.border,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: THEME.primary,
    borderColor: THEME.link,
  },
  filterButtonText: {
    color: THEME.body,
    fontSize: 12,
    fontWeight: '600',
  },
  filterButtonTextSelected: {
    color: THEME.primaryText,
  },
  premiumButton: {
    alignSelf: 'center',
    backgroundColor: THEME.premiumCardBg,
    borderRadius: 10,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  premiumButtonText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: '700',
  },
  spinner: {
    marginTop: 8,
  },
  kumorinBox: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  kumorinImage: {
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: THEME.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
    color: THEME.danger,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  hint: {
    fontSize: 13,
    color: THEME.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  plannedFriendButton: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    opacity: 0.65,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  plannedFriendText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  plannedFriendNote: {
    color: THEME.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  endButton: {
    marginTop: 32,
    backgroundColor: THEME.surfaceMuted,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.plannedBorder,
  },
  startButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    marginTop: 8,
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  startButtonText: {
    color: THEME.primaryText,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 18,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: THEME.link,
    fontSize: 15,
  },
  endButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  expoGoBox: {
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 20,
    width: '100%',
  },
  expoGoTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  expoGoText: {
    color: THEME.body,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  expoGoNote: {
    color: THEME.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    textAlign: 'center',
  },
});
