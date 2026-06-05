import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import { LaunchScreen } from './screens/LaunchScreen';
import { AdScreen } from './screens/AdScreen';
import { AdminCallScreen } from './screens/AdminCallScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CallScreen } from './screens/CallScreen';
import { CallReviewScreen } from './screens/CallReviewScreen';
import { ChatScreen } from './screens/ChatScreen';
import { CommercialTransactionScreen } from './screens/CommercialTransactionScreen';
import { ContactScreen } from './screens/ContactScreen';
import { FriendsScreen } from './screens/FriendsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen';
import { PlannedFeaturesScreen } from './screens/PlannedFeaturesScreen';
import { PremiumScreen } from './screens/PremiumScreen';
import { RadioScreen } from './screens/RadioScreen';
import { ReportScreen } from './screens/ReportScreen';
import { SafetyScreen } from './screens/SafetyScreen';
import { SelectedCallScreen } from './screens/SelectedCallScreen';
import { TermsScreen } from './screens/TermsScreen';
import { UserSelectCallScreen } from './screens/UserSelectCallScreen';
import { CURRENT_USER_ID, TOKEN_SERVER } from './config';

const FRIENDS = [
  {
    id: 'friend-1',
    name: 'ゲストA',
    lastSeen: 'さきほど通話',
    memo: 'ランダム通話後にフレンド追加した相手の想定です。',
    status: 'friend',
  },
  {
    id: 'friend-2',
    name: 'ゲストB',
    lastSeen: '昨日',
    memo: 'ラジオ配信で知り合った相手の想定です。',
    status: 'incoming',
  },
  {
    id: 'friend-3',
    name: 'ゲストC',
    lastSeen: '申請中',
    memo: 'こちらからフレンド申請を送っている相手の想定です。',
    status: 'outgoing',
  },
];

const INITIAL_MESSAGES = {
  'friend-1': [
    {
      id: 'm1',
      from: 'friend',
      text: 'さっきは話してくれてありがとう！',
      time: '20:10',
    },
    {
      id: 'm2',
      from: 'me',
      text: 'こちらこそ。また話しましょう。',
      time: '20:11',
    },
  ],
  'friend-2': [
    {
      id: 'm3',
      from: 'friend',
      text: 'ラジオ配信、楽しかったです。',
      time: '昨日',
    },
  ],
};

const INITIAL_PROFILE = {
  name: 'ゲスト',
  ageGroup: '20代',
  gender: '回答しない',
  bio: '雑談が好きです。気軽に話しかけてください。',
};

const INITIAL_CALL_FILTER = {
  ageGroup: 'すべて',
  gender: 'すべて',
};

const CALL_USERS = [
  {
    id: 'user-1',
    name: 'みなと',
    ageGroup: '20代',
    gender: '男性',
    bio: '夜に少しだけ雑談したいです。音楽と映画の話が好きです。',
    online: true,
    status: '雑談OK',
  },
  {
    id: 'user-2',
    name: 'ゆい',
    ageGroup: '30代',
    gender: '女性',
    bio: '仕事終わりにゆるく話せる人を探しています。',
    online: true,
    status: '短時間ならOK',
  },
  {
    id: 'user-3',
    name: 'けん',
    ageGroup: '10代',
    gender: '回答しない',
    bio: 'ゲームの話ができる人だとうれしいです。',
    online: false,
    status: '離席中',
  },
];

const MIN_LAUNCH_MS = 2200;
const SAFETY_FETCH_TIMEOUT_MS = 3000;

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

const RADIO_ROOMS = [
  {
    id: 'radio-1',
    hostId: 'user-1',
    hostName: 'みなと',
    premiumHost: true,
    title: '夜のゆる雑談',
    description: '音楽と映画の話をゆるく話す音声ラジオです。',
  },
  {
    id: 'radio-2',
    hostId: 'friend-2',
    hostName: 'ゲストB',
    premiumHost: false,
    title: '今日のちょっとした話',
    description: 'フレンドが配信している想定の音声ラジオです。',
  },
];

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [screen, setScreen] = useState('termsGate');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedCallUser, setSelectedCallUser] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [blockedIds, setBlockedIds] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isPremium, setIsPremium] = useState(false);
  const [callFilter, setCallFilter] = useState(INITIAL_CALL_FILTER);
  const [pendingAd, setPendingAd] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const prepareApp = async () => {
      // 白いネイティブスプラッシュをすぐ隠し、LaunchScreen を表示する
      await SplashScreen.hideAsync().catch(() => {});

      const startedAt = Date.now();

      try {
        const [blocksRes, reportsRes] = await Promise.all([
          fetchWithTimeout(
            `${TOKEN_SERVER}/api/blocks?userId=${CURRENT_USER_ID}`,
            SAFETY_FETCH_TIMEOUT_MS,
          ),
          fetchWithTimeout(
            `${TOKEN_SERVER}/api/reports?userId=${CURRENT_USER_ID}`,
            SAFETY_FETCH_TIMEOUT_MS,
          ),
        ]);
        const blocksData = await blocksRes.json();
        const reportsData = await reportsRes.json();

        if (cancelled) {
          return;
        }

        setBlockedIds(blocksData.map((block) => block.targetId));
        setReports(
          reportsData.map((report) => ({
            id: report.id,
            friendId: report.targetId,
            friendName: report.targetName,
            reason: report.reason,
            time: new Date(report.createdAt).toLocaleString('ja-JP'),
          })),
        );
      } catch {
        // サーバー未起動・タイムアウト時も起動を続ける
      }

      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LAUNCH_MS) {
        await new Promise((resolve) => {
          setTimeout(resolve, MIN_LAUNCH_MS - elapsed);
        });
      }

      if (!cancelled) {
        setAppReady(true);
      }
    };

    prepareApp();

    return () => {
      cancelled = true;
    };
  }, []);

  const openChat = (friend) => {
    setSelectedFriend(friend);
    setScreen('chat');
  };

  const openReport = (friend) => {
    setSelectedFriend(friend);
    setScreen('report');
  };

  const toggleBlock = async (friend) => {
    const isBlocked = blockedIds.includes(friend.id);
    setBlockedIds((current) => {
      if (current.includes(friend.id)) {
        return current.filter((id) => id !== friend.id);
      }
      return [...current, friend.id];
    });

    try {
      if (isBlocked) {
        await fetch(`${TOKEN_SERVER}/api/blocks/${friend.id}?userId=${CURRENT_USER_ID}`, {
          method: 'DELETE',
        });
      } else {
        await fetch(`${TOKEN_SERVER}/api/blocks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: CURRENT_USER_ID,
            targetId: friend.id,
            targetName: friend.name,
          }),
        });
      }
    } catch {
      Alert.alert('保存できませんでした', 'ブロック状態をサーバーに保存できませんでした。');
    }
  };

  const submitReport = async (friend, reason) => {
    const report = {
      id: `report-${Date.now()}`,
      friendId: friend.id,
      friendName: friend.name,
      reason,
      time: new Date().toLocaleString('ja-JP'),
    };
    setReports((current) => [
      report,
      ...current,
    ]);

    try {
      await fetch(`${TOKEN_SERVER}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: CURRENT_USER_ID,
          targetId: friend.id,
          targetName: friend.name,
          reason,
        }),
      });
      Alert.alert('通報を受け付けました', 'サーバーの reports.json に保存しました。');
    } catch {
      Alert.alert('端末内に記録しました', 'サーバー保存に失敗しました。token-server の起動を確認してください。');
    }

    setScreen('friends');
  };

  const sendMessage = (friendId, text) => {
    setMessages((current) => ({
      ...current,
      [friendId]: [
        ...(current[friendId] || []),
        {
          id: `message-${Date.now()}`,
          from: 'me',
          text,
          time: new Date().toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
    }));
  };

  const saveProfile = (nextProfile) => {
    setProfile(nextProfile);
    Alert.alert('保存しました', 'プロフィールが相手に見える内容として更新されました。');
    setScreen('home');
  };

  const requestSelectedCall = (user) => {
    setSelectedCallUser(user);
    setScreen('selectedCall');
  };

  const finishCall = (target, durationSeconds = 0) => {
    setReviewTarget(target);
    if (!isPremium && durationSeconds >= 60) {
      setPendingAd({
        reason: '1分以上通話したため、通話終了後広告を表示しています。',
        nextScreen: 'callReview',
      });
      setScreen('ad');
      return;
    }
    setScreen('callReview');
  };

  const finishRadioListen = (durationSeconds) => {
    if (!isPremium && durationSeconds >= 30) {
      setPendingAd({
        reason: 'ラジオを30秒以上聴いたため、視聴終了後広告を表示しています。',
        nextScreen: 'home',
      });
      setScreen('ad');
      return;
    }
    setScreen('home');
  };

  const closeAd = () => {
    const nextScreen = pendingAd?.nextScreen || 'home';
    setPendingAd(null);
    setScreen(nextScreen);
  };

  const togglePremiumForTest = () => {
    setIsPremium((current) => !current);
  };

  const blockFromReview = (target) => {
    toggleBlock(target);
    Alert.alert('ブロックしました', `${target.name} さんをブロックしました。`);
    setScreen('home');
  };

  const submitInquiry = async ({ category, message }) => {
    try {
      await fetch(`${TOKEN_SERVER}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: CURRENT_USER_ID,
          userName: profile.name,
          category,
          message,
        }),
      });
      Alert.alert('送信しました', '問い合わせをサーバーに保存しました。');
      setScreen('home');
    } catch {
      Alert.alert('送信できませんでした', 'token-server が起動しているか確認してください。');
    }
  };

  const submitAdminCallRequest = async (reason) => {
    try {
      await fetch(`${TOKEN_SERVER}/api/admin-call-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: CURRENT_USER_ID,
          userName: profile.name,
          reason,
        }),
      });
      Alert.alert('通知しました', '管理者通話リクエストをサーバーに保存しました。');
      setScreen('home');
    } catch {
      Alert.alert('通知できませんでした', 'token-server が起動しているか確認してください。');
    }
  };

  const renderScreen = () => {
    if (screen === 'termsGate') {
      return (
        <TermsScreen
          requireAcceptance
          onAccept={() => setScreen('home')}
        />
      );
    }

    if (screen === 'ad') {
      return (
        <AdScreen
          onClose={closeAd}
          reason={pendingAd?.reason || '広告を表示しています。'}
        />
      );
    }

    if (screen === 'plannedFeatures') {
      return (
        <PlannedFeaturesScreen
          onBack={() => setScreen('home')}
          onPremium={() => setScreen('premium')}
        />
      );
    }

    if (screen === 'premium') {
      return (
        <PremiumScreen
          isPremium={isPremium}
          onBack={() => setScreen('plannedFeatures')}
          onCommercialTransaction={() => setScreen('commercialTransaction')}
          onTogglePremium={togglePremiumForTest}
        />
      );
    }

    if (screen === 'commercialTransaction') {
      return <CommercialTransactionScreen onBack={() => setScreen('premium')} />;
    }

    if (screen === 'call') {
      return (
        <CallScreen
          callFilter={callFilter}
          isPremium={isPremium}
          onBack={() => setScreen('home')}
          onFilterChange={setCallFilter}
          onFinish={finishCall}
          onPremium={() => setScreen('premium')}
          profile={profile}
        />
      );
    }

    if (screen === 'contact') {
      return (
        <ContactScreen
          onBack={() => setScreen('home')}
          onSubmit={submitInquiry}
          profile={profile}
        />
      );
    }

    if (screen === 'adminCall') {
      return (
        <AdminCallScreen
          onBack={() => setScreen('home')}
          onSubmit={submitAdminCallRequest}
          profile={profile}
        />
      );
    }

    if (screen === 'callReview' && reviewTarget) {
      return (
        <CallReviewScreen
          target={reviewTarget}
          onBlock={blockFromReview}
          onNoProblem={() => setScreen('home')}
          onReport={(target) => {
            setSelectedFriend(target);
            setScreen('report');
          }}
        />
      );
    }

    if (screen === 'selectCall') {
      return (
        <UserSelectCallScreen
          blockedIds={blockedIds}
          callFilter={callFilter}
          isPremium={isPremium}
          onBack={() => setScreen('home')}
          onFilterChange={setCallFilter}
          onPremium={() => setScreen('premium')}
          onRequestCall={requestSelectedCall}
          users={CALL_USERS}
        />
      );
    }

    if (screen === 'radio') {
      return (
        <RadioScreen
          blockedIds={blockedIds}
          isPremium={isPremium}
          onBack={() => setScreen('home')}
          onFinishListen={finishRadioListen}
          rooms={RADIO_ROOMS}
        />
      );
    }

    if (screen === 'selectedCall' && selectedCallUser) {
      return (
        <SelectedCallScreen
          onFinish={finishCall}
          user={selectedCallUser}
        />
      );
    }

    if (screen === 'profile') {
      return (
        <ProfileScreen
          onBack={() => setScreen('home')}
          onSave={saveProfile}
          profile={profile}
        />
      );
    }

    if (screen === 'friends') {
      return (
        <FriendsScreen
          blockedIds={blockedIds}
          friends={FRIENDS}
          onBack={() => setScreen('home')}
          onBlock={toggleBlock}
          onChat={openChat}
          onReport={openReport}
        />
      );
    }

    if (screen === 'chat' && selectedFriend) {
      return (
        <ChatScreen
          friend={selectedFriend}
          isBlocked={blockedIds.includes(selectedFriend.id)}
          messages={messages[selectedFriend.id] || []}
          onBack={() => setScreen('friends')}
          onBlock={toggleBlock}
          onReport={openReport}
          onSend={sendMessage}
        />
      );
    }

    if (screen === 'report' && selectedFriend) {
      return (
        <ReportScreen
          friend={selectedFriend}
          onBack={() => setScreen('friends')}
          onSubmit={submitReport}
        />
      );
    }

    if (screen === 'safety') {
      return (
        <SafetyScreen
          blockedFriends={FRIENDS.filter((friend) => blockedIds.includes(friend.id))}
          reports={reports}
          onBack={() => setScreen('home')}
          onUnblock={toggleBlock}
        />
      );
    }

    if (screen === 'terms') {
      return <TermsScreen onBack={() => setScreen('home')} />;
    }

    if (screen === 'privacy') {
      return <PrivacyPolicyScreen onBack={() => setScreen('home')} />;
    }

    return (
      <HomeScreen
        blockedCount={blockedIds.length}
        onContact={() => setScreen('contact')}
        onPlannedFeatures={() => setScreen('plannedFeatures')}
        onProfile={() => setScreen('profile')}
        onPrivacy={() => setScreen('privacy')}
        onSafety={() => setScreen('safety')}
        onStartCall={() => setScreen('call')}
        onTerms={() => setScreen('terms')}
        profile={profile}
      />
    );
  };

  if (!appReady) {
    return (
      <>
        <LaunchScreen />
        <StatusBar style="dark" />
      </>
    );
  }

  return (
    <>
      {renderScreen()}
      <StatusBar style="dark" />
    </>
  );
}
