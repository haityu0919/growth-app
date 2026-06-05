/** Expo 設定（環境変数 EXPO_PUBLIC_* を extra に渡す） */
export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    tokenServer:
      process.env.EXPO_PUBLIC_TOKEN_SERVER || 'http://192.168.0.245:3001',
  },
});
