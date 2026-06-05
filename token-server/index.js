import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { AccessToken } from 'livekit-server-sdk';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const LIVEKIT_URL = process.env.LIVEKIT_URL || '';
const API_KEY = process.env.LIVEKIT_API_KEY || '';
const API_SECRET = process.env.LIVEKIT_API_SECRET || '';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');
const BLOCKS_FILE = path.join(DATA_DIR, 'blocks.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const ADMIN_CALL_REQUESTS_FILE = path.join(DATA_DIR, 'admin-call-requests.json');

/** @type {Array<{ sessionId: string, identity: string, joinedAt: number, profile: { ageGroup: string, gender: string }, filter: { ageGroup: string, gender: string } | null }>} */
let waitingUsers = [];
/** @type {Map<string, { status: string, roomName?: string, token?: string, livekitUrl?: string }>} */
const sessions = new Map();

function isConfigured() {
  return Boolean(LIVEKIT_URL && API_KEY && API_SECRET);
}

function ensureDataFile(filePath) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]\n', 'utf8');
  }
}

function readJsonArray(filePath) {
  ensureDataFile(filePath);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
}

function writeJsonArray(filePath, data) {
  ensureDataFile(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function createToken(identity, roomName) {
  const at = new AccessToken(API_KEY, API_SECRET, {
    identity,
    ttl: '1h',
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });
  return at.toJwt();
}

function normalizeFilter(filter) {
  if (!filter) {
    return null;
  }
  return {
    ageGroup: filter.ageGroup || 'すべて',
    gender: filter.gender || 'すべて',
  };
}

function normalizeProfile(profile) {
  return {
    ageGroup: profile?.ageGroup || '未設定',
    gender: profile?.gender || '回答しない',
  };
}

function matchesFilter(filter, profile) {
  if (!filter) {
    return true;
  }
  if (filter.ageGroup !== 'すべて' && filter.ageGroup !== profile.ageGroup) {
    return false;
  }
  if (filter.gender !== 'すべて' && filter.gender !== profile.gender) {
    return false;
  }
  return true;
}

function canMatch(user, partner) {
  return matchesFilter(user.filter, partner.profile)
    && matchesFilter(partner.filter, user.profile);
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, livekitConfigured: isConfigured() });
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    livekitConfigured: isConfigured(),
  });
});

/** 通報をサーバーの data/reports.json に保存 */
app.post('/api/reports', (req, res) => {
  const report = {
    id: randomUUID(),
    userId: req.body?.userId || 'unknown-user',
    targetId: req.body?.targetId || 'unknown-target',
    targetName: req.body?.targetName || 'unknown',
    reason: req.body?.reason || 'その他',
    createdAt: new Date().toISOString(),
  };
  const reports = readJsonArray(REPORTS_FILE);
  reports.unshift(report);
  writeJsonArray(REPORTS_FILE, reports);
  res.json({ ok: true, report });
});

app.get('/api/reports', (req, res) => {
  const userId = req.query.userId;
  const reports = readJsonArray(REPORTS_FILE);
  res.json(userId ? reports.filter((report) => report.userId === userId) : reports);
});

/** ブロックをサーバーの data/blocks.json に保存 */
app.post('/api/blocks', (req, res) => {
  const block = {
    id: randomUUID(),
    userId: req.body?.userId || 'unknown-user',
    targetId: req.body?.targetId || 'unknown-target',
    targetName: req.body?.targetName || 'unknown',
    createdAt: new Date().toISOString(),
  };
  const blocks = readJsonArray(BLOCKS_FILE);
  const exists = blocks.some(
    (item) => item.userId === block.userId && item.targetId === block.targetId,
  );
  if (!exists) {
    blocks.unshift(block);
    writeJsonArray(BLOCKS_FILE, blocks);
  }
  res.json({ ok: true, block });
});

app.get('/api/blocks', (req, res) => {
  const userId = req.query.userId;
  const blocks = readJsonArray(BLOCKS_FILE);
  res.json(userId ? blocks.filter((block) => block.userId === userId) : blocks);
});

app.delete('/api/blocks/:targetId', (req, res) => {
  const userId = req.query.userId || 'unknown-user';
  const blocks = readJsonArray(BLOCKS_FILE);
  const nextBlocks = blocks.filter(
    (block) => !(block.userId === userId && block.targetId === req.params.targetId),
  );
  writeJsonArray(BLOCKS_FILE, nextBlocks);
  res.json({ ok: true });
});

/** 問い合わせをサーバーの data/inquiries.json に保存 */
app.post('/api/inquiries', (req, res) => {
  const inquiry = {
    id: randomUUID(),
    userId: req.body?.userId || 'unknown-user',
    userName: req.body?.userName || 'unknown',
    category: req.body?.category || 'その他',
    message: req.body?.message || '',
    createdAt: new Date().toISOString(),
    status: 'unread',
  };
  const inquiries = readJsonArray(INQUIRIES_FILE);
  inquiries.unshift(inquiry);
  writeJsonArray(INQUIRIES_FILE, inquiries);
  res.json({ ok: true, inquiry });
});

app.get('/api/inquiries', (_req, res) => {
  res.json(readJsonArray(INQUIRIES_FILE));
});

/** 管理者通話リクエストを保存。管理アプリはこのAPIを見れば通知として扱える */
app.post('/api/admin-call-requests', (req, res) => {
  const request = {
    id: randomUUID(),
    userId: req.body?.userId || 'unknown-user',
    userName: req.body?.userName || 'unknown',
    reason: req.body?.reason || '管理者と通話したい',
    createdAt: new Date().toISOString(),
    status: 'waiting',
  };
  const requests = readJsonArray(ADMIN_CALL_REQUESTS_FILE);
  requests.unshift(request);
  writeJsonArray(ADMIN_CALL_REQUESTS_FILE, requests);
  res.json({ ok: true, request });
});

app.get('/api/admin-call-requests', (_req, res) => {
  res.json(readJsonArray(ADMIN_CALL_REQUESTS_FILE));
});

/** ランダムマッチング: 待機 or マッチ完了 */
app.post('/api/join', async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      error: 'livekit_not_configured',
      message: 'LiveKit の API キーを token-server/.env に設定してください',
    });
  }

  const sessionId = randomUUID();
  const identity = `user-${sessionId.slice(0, 8)}`;
  const currentUser = {
    sessionId,
    identity,
    joinedAt: Date.now(),
    profile: normalizeProfile(req.body?.profile),
    filter: normalizeFilter(req.body?.filter),
  };

  const matchIndex = waitingUsers.findIndex((waitingUser) => canMatch(currentUser, waitingUser));

  if (matchIndex >= 0) {
    const partner = waitingUsers[matchIndex];
    waitingUsers = waitingUsers.filter((_, index) => index !== matchIndex);
    const roomName = `call-${randomUUID()}`;

    const token = await createToken(identity, roomName);
    const partnerToken = await createToken(partner.identity, roomName);

    sessions.set(sessionId, {
      status: 'matched',
      roomName,
      token,
      livekitUrl: LIVEKIT_URL,
    });
    sessions.set(partner.sessionId, {
      status: 'matched',
      roomName,
      token: partnerToken,
      livekitUrl: LIVEKIT_URL,
    });

    return res.json({
      status: 'matched',
      sessionId,
      roomName,
      token,
      livekitUrl: LIVEKIT_URL,
    });
  }

  waitingUsers.push(currentUser);
  sessions.set(sessionId, {
    status: 'waiting',
    filter: currentUser.filter,
  });

  return res.json({
    status: 'waiting',
    sessionId,
    filter: currentUser.filter,
  });
});

/** 待機中のクライアントがポーリング */
app.get('/api/status/:sessionId', (req, res) => {
  const data = sessions.get(req.params.sessionId);
  if (!data) {
    return res.status(404).json({ status: 'unknown' });
  }
  res.json(data);
});

/** 通話終了・待機キャンセル */
app.post('/api/leave', (req, res) => {
  const { sessionId } = req.body || {};
  if (sessionId) {
    sessions.delete(sessionId);
    waitingUsers = waitingUsers.filter((user) => user.sessionId !== sessionId);
  }
  res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DareTalk token server: http://0.0.0.0:${PORT}`);
  console.log(`LiveKit configured: ${isConfigured()}`);
  if (!isConfigured()) {
    console.log('Copy .env.example to .env and add LiveKit Cloud credentials.');
  }
});
