import { THEME } from '../constants/theme';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const AD_SKIP_SECONDS = 5;

export function AdScreen({ reason, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(AD_SKIP_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return undefined;
    }

    const timerId = setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [secondsLeft]);

  const canSkip = secondsLeft <= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>広告</Text>
      <View style={styles.adBox}>
        <Text style={styles.adTitle}>ここに広告が表示されます</Text>
        <Text style={styles.adText}>
          開発中の仮画面です。本番では Google AdMob などの広告に差し替えます。
        </Text>
      </View>
      <Text style={styles.reason}>{reason}</Text>
      <Text style={styles.premiumNote}>
        プレミアム会員は広告非表示になります。
      </Text>
      {!canSkip ? (
        <Text style={styles.skipCountdown}>
          あと {secondsLeft} 秒でスキップできます
        </Text>
      ) : null}
      <Pressable
        disabled={!canSkip}
        style={[styles.closeButton, !canSkip && styles.closeButtonDisabled]}
        onPress={onClose}
      >
        <Text style={styles.closeText}>
          {canSkip ? '広告を閉じる' : '広告を表示中…'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: THEME.bg,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  label: {
    color: THEME.link,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  adBox: {
    alignItems: 'center',
    backgroundColor: '#f2f2f8',
    borderRadius: 18,
    maxWidth: 340,
    minHeight: 220,
    justifyContent: 'center',
    padding: 24,
    width: '100%',
  },
  adTitle: {
    color: THEME.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  adText: {
    color: '#44445a',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 16,
    textAlign: 'center',
  },
  reason: {
    color: THEME.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 22,
    textAlign: 'center',
  },
  premiumNote: {
    color: THEME.notice,
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  skipCountdown: {
    color: THEME.textMuted,
    fontSize: 13,
    marginTop: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    marginTop: 12,
    paddingHorizontal: 48,
    paddingVertical: 16,
  },
  closeButtonDisabled: {
    backgroundColor: THEME.disabledButton,
  },
  closeText: {
    color: THEME.primaryText,
    fontSize: 16,
    fontWeight: '700',
  },
});
