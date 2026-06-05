import { ActivityIndicator, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { THEME } from '../constants/theme';

const LOGO = require('../assets/launch-logo.png');

export function LaunchScreen() {
  const { width } = useWindowDimensions();
  const logoSize = Math.min(width * 0.52, 240);

  return (
    <View style={styles.container}>
      <Image
        source={LOGO}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
        accessibilityLabel="だれトークのロゴ"
      />
      <Text style={styles.title}>だれトーク</Text>
      <Text style={styles.tagline}>声でつながる、きもち近づく</Text>
      <ActivityIndicator color={THEME.link} size="small" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: THEME.bg,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    color: THEME.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    color: THEME.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  loader: {
    marginTop: 36,
  },
});
