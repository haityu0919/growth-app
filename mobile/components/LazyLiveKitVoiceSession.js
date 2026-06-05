import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { THEME } from '../constants/theme';

export function LazyLiveKitVoiceSession(props) {
  const [VoiceSession, setVoiceSession] = useState(null);

  useEffect(() => {
    let cancelled = false;

    import('./LiveKitVoiceSession').then((module) => {
      if (!cancelled) {
        setVoiceSession(() => module.LiveKitVoiceSession);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!VoiceSession) {
    return (
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <ActivityIndicator color={THEME.primary} size="large" />
      </View>
    );
  }

  return <VoiceSession {...props} />;
}
