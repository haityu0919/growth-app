import { THEME } from '../constants/theme';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const AGE_FILTERS = ['すべて', '10代', '20代', '30代', '40代', '50代以上'];
const GENDER_FILTERS = ['すべて', '男性', '女性', 'その他', '回答しない'];

export function UserSelectCallScreen({
  blockedIds,
  callFilter,
  isPremium,
  onBack,
  onFilterChange,
  onPremium,
  onRequestCall,
  users,
}) {
  const [requestedUserId, setRequestedUserId] = useState(null);
  const [consented, setConsented] = useState(false);
  const visibleUsers = users.filter((user) => {
    if (blockedIds.includes(user.id)) {
      return false;
    }
    if (!isPremium) {
      return true;
    }
    if (callFilter.ageGroup !== 'すべて' && user.ageGroup !== callFilter.ageGroup) {
      return false;
    }
    if (callFilter.gender !== 'すべて' && user.gender !== callFilter.gender) {
      return false;
    }
    return true;
  });
  const hiddenCount = users.length - visibleUsers.length;

  const requestedUser = visibleUsers.find((user) => user.id === requestedUserId);

  if (requestedUser) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => setRequestedUserId(null)}>
            <Text style={styles.back}>戻る</Text>
          </Pressable>
          <Text style={styles.title}>通話リクエスト</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.requestCard}>
          <Text style={styles.requestTitle}>{requestedUser.name} さんに申請中</Text>
          <Text style={styles.profileMeta}>{requestedUser.ageGroup}・{requestedUser.gender}</Text>
          <Text style={styles.profileBio}>{requestedUser.bio}</Text>
          <View style={styles.noticeBox}>
            <Text style={styles.noticeTitle}>通話前の注意</Text>
            <Text style={styles.noticeText}>
              本名・住所・電話番号・LINE ID・Instagram / X などの外部SNS・学校名・勤務先は話さないでください。
            </Text>
          </View>
          <Text style={styles.requestText}>
            本番では相手に通知が届き、相手が許可した場合だけ通話がつながります。
          </Text>

          <Pressable
            style={styles.consentRow}
            onPress={() => setConsented((current) => !current)}
          >
            <View style={[styles.checkbox, consented && styles.checkboxChecked]}>
              {consented ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.consentText}>
              注意事項を読み、個人情報を交換しないことに同意します。
            </Text>
          </Pressable>
        </View>

        <Pressable
          disabled={!consented}
          style={[styles.acceptButton, !consented && styles.acceptButtonDisabled]}
          onPress={() => onRequestCall(requestedUser)}
        >
          <Text style={styles.acceptText}>同意してリクエスト送信</Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => {
            setConsented(false);
            setRequestedUserId(null);
          }}
        >
          <Text style={styles.cancelText}>キャンセル</Text>
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
        <Text style={styles.title}>相手を選ぶ</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.lead}>
        通話したい相手を選んでリクエストします。相手が許可した場合だけ接続されます。
      </Text>
      <View style={styles.filterBox}>
        <Text style={styles.filterTitle}>年齢・性別フィルター</Text>
        {isPremium ? (
          <>
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
            <Text style={styles.filterLocked}>
              フィルターは月額800円のプレミアム特典です。無料ユーザーは全体表示のみです。
            </Text>
            <Pressable style={styles.premiumButton} onPress={onPremium}>
              <Text style={styles.premiumButtonText}>プレミアムを見る</Text>
            </Pressable>
          </>
        )}
      </View>
      {hiddenCount > 0 ? (
        <Text style={styles.hiddenNotice}>
          ブロックまたはフィルター条件により {hiddenCount} 人非表示にしています。
        </Text>
      ) : null}

      <View style={styles.noticeBox}>
        <Text style={styles.noticeTitle}>通話前の注意</Text>
        <Text style={styles.noticeText}>
          本名・住所・電話番号・LINE ID・Instagram / X などの外部SNS・学校名・勤務先は交換禁止です。
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {visibleUsers.map((user) => (
          <View key={user.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.profileMeta}>
                  {user.ageGroup}・{user.gender}・{user.status}
                </Text>
              </View>
              <Text style={styles.online}>{user.online ? '通話可能' : '離席中'}</Text>
            </View>

            <Text style={styles.profileBio}>{user.bio}</Text>

            <Pressable
              disabled={!user.online}
              style={[styles.requestButton, !user.online && styles.requestDisabled]}
              onPress={() => setRequestedUserId(user.id)}
            >
              <Text style={styles.requestButtonText}>
                {user.online ? '通話をリクエスト' : '今はリクエスト不可'}
              </Text>
            </Pressable>
          </View>
        ))}
        {visibleUsers.length === 0 ? (
          <Text style={styles.empty}>条件に合う相手がいません。</Text>
        ) : null}
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
    marginBottom: 16,
  },
  hiddenNotice: {
    color: THEME.notice,
    fontSize: 12,
    marginBottom: 10,
  },
  filterBox: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    padding: 14,
  },
  filterTitle: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  filterLabel: {
    color: THEME.link,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  filterLocked: {
    color: THEME.body,
    fontSize: 13,
    lineHeight: 20,
  },
  premiumButton: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.premiumCardBg,
    borderRadius: 10,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  premiumButtonText: {
    color: THEME.text,
    fontSize: 13,
    fontWeight: '700',
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
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
  },
  profileMeta: {
    color: THEME.link,
    fontSize: 12,
    marginTop: 5,
  },
  online: {
    color: THEME.success,
    fontSize: 12,
    fontWeight: '700',
  },
  profileBio: {
    color: THEME.body,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  requestButton: {
    backgroundColor: THEME.primary,
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 13,
  },
  requestDisabled: {
    backgroundColor: THEME.disabledButton,
    opacity: 0.6,
  },
  requestButtonText: {
    color: THEME.primaryText,
    fontWeight: '700',
    textAlign: 'center',
  },
  requestCard: {
    backgroundColor: THEME.card,
    borderColor: THEME.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
  },
  requestTitle: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: '700',
  },
  requestText: {
    color: THEME.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 18,
  },
  noticeBox: {
    backgroundColor: '#2d2a3a',
    borderColor: '#ffb86c',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 14,
    marginBottom: 12,
    padding: 14,
  },
  noticeTitle: {
    color: THEME.notice,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  noticeText: {
    color: '#f2f2f8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  acceptButton: {
    backgroundColor: THEME.primary,
    borderRadius: 14,
    marginTop: 22,
    paddingVertical: 16,
  },
  acceptButtonDisabled: {
    backgroundColor: THEME.disabledButton,
    opacity: 0.6,
  },
  acceptText: {
    color: THEME.primaryText,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  consentRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: THEME.link,
    borderRadius: 6,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  checkboxChecked: {
    backgroundColor: THEME.primary,
  },
  checkmark: {
    color: THEME.primaryText,
    fontSize: 18,
    fontWeight: '700',
  },
  consentText: {
    color: THEME.text,
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  cancelButton: {
    marginTop: 18,
    paddingVertical: 12,
  },
  cancelText: {
    color: THEME.link,
    fontSize: 15,
    textAlign: 'center',
  },
});
