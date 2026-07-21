import axios from 'axios';
import { API_BASE_URL, API_PATHS } from './constants.js';
import { log, logError } from './utils/logger.js';

function mergeCookies(existingCookieHeader, setCookieHeader) {
  const jar = new Map();

  if (existingCookieHeader) {
    existingCookieHeader.split(';').forEach((part) => {
      const [name, ...rest] = part.trim().split('=');
      if (name) jar.set(name, rest.join('='));
    });
  }

  const setCookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : setCookieHeader
      ? [setCookieHeader]
      : [];

  setCookies.forEach((cookie) => {
    const [pair] = cookie.split(';');
    const [name, ...rest] = pair.trim().split('=');
    if (name) jar.set(name, rest.join('='));
  });

  return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
}

function pickSessionToTerminate(oldSessions = []) {
  const crawlerSession = oldSessions.find((session) =>
    session.agent?.includes('AssignmentCrawler'),
  );

  return crawlerSession?.sess_id ?? oldSessions[0]?.sess_id ?? null;
}

export function createApiClient() {
  let cookieHeader = '';

  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      domain: 'ecomm-data.com',
      Origin: API_BASE_URL,
      Referer: `${API_BASE_URL}/assignment`,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AssignmentCrawler/1.0',
    },
  });

  client.interceptors.request.use((config) => {
    if (cookieHeader) {
      config.headers.Cookie = cookieHeader;
    }
    return config;
  });

  client.interceptors.response.use((response) => {
    cookieHeader = mergeCookies(cookieHeader, response.headers['set-cookie']);
    return response;
  });

  return client;
}

async function requestSignIn(client, credentials) {
  const response = await client.post(API_PATHS.signIn, credentials);
  return response.data;
}

export async function signIn(client, { email, password }) {
  if (!email || !password) {
    throw new Error('CRAWL_LOGIN_EMAIL and CRAWL_LOGIN_PASSWORD are required in server/.env');
  }

  log('로그인 시도');

  try {
    let data = await requestSignIn(client, { email, password });

    if (data.result === 5) {
      const sessId = pickSessionToTerminate(data.old_sess);
      if (!sessId) {
        throw new Error('동시접속 세션 초과: 종료할 세션을 찾지 못했습니다.');
      }

      log('동시접속 세션 정리 후 재로그인');
      data = await requestSignIn(client, { email, password, sess_id: sessId });
    }

    if (data.result !== 1) {
      throw new Error(`로그인 실패 (result=${data.result})`);
    }

    log('로그인 성공');
    return data;
  } catch (error) {
    const status = error.response?.status;
    logError(`로그인 실패 (${status || error.message})`);
    throw error;
  }
}
