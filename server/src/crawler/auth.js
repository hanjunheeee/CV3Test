import axios from 'axios';
import { API_BASE_URL, API_PATHS } from './constants.js';
import { log, logError } from './utils/logger.js';

/**
 * 기존 Cookie 헤더와 응답 Set-Cookie를 합쳐 하나의 Cookie 문자열로 만든다.
 * sign_in 성공 시 발급되는 sales2 세션 쿠키를 이후 list API 요청에 실어 보내기 위해 사용한다.
 */
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

/**
 * sign_in result=5(동시접속 세션 초과)일 때 종료할 세션 ID를 고른다.
 * 브라우저 세션보다 이전 크롤러 세션을 우선 종료해, 사용자 브라우저 로그인을 최대한 유지한다.
 */
function pickSessionToTerminate(oldSessions = []) {
  const crawlerSession = oldSessions.find((session) =>
    session.agent?.includes('AssignmentCrawler'),
  );

  return crawlerSession?.sess_id ?? oldSessions[0]?.sess_id ?? null;
}

/**
 * 과제 사이트 API 호출용 axios 클라이언트를 생성한다.
 * - 요청마다 누적된 세션 쿠키를 자동 첨부
 * - 브라우저 Fetch와 동일하게 domain 헤더 포함
 */
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

/** POST /api/user/sign_in 호출 후 응답 JSON을 반환한다. */
async function requestSignIn(client, credentials) {
  const response = await client.post(API_PATHS.signIn, credentials);
  return response.data;
}

/**
 * 과제 사이트에 로그인한다.
 *
 * result 코드:
 * - 1: 성공 (세션 쿠키 발급)
 * - 5: 동시접속 세션 초과 → sess_id를 지정해 기존 세션 종료 후 재시도
 *
 * @returns {Promise<object>} 로그인 성공 응답 (user 등 포함)
 */
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
