import Constants from 'expo-constants';

/**
 * マッチング API の URL。
 * - クラウド: mobile/.env に EXPO_PUBLIC_TOKEN_SERVER=https://xxx.up.railway.app
 * - ローカル: PC の IP（QR 起動画面の 192.168.x.x と同じ）
 */
const LOCAL_DEFAULT = 'http://192.168.0.245:3001';

export const TOKEN_SERVER =
  Constants.expoConfig?.extra?.tokenServer ||
  process.env.EXPO_PUBLIC_TOKEN_SERVER ||
  LOCAL_DEFAULT;
export const CURRENT_USER_ID = 'demo-user';
