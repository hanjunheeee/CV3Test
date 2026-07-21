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

export function createApiClient() {
  let cookieHeader = '';

  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AssignmentCrawler/1.0',
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

export async function signIn(client, { email, password }) {
  if (!email || !password) {
    throw new Error('CRAWL_LOGIN_EMAIL and CRAWL_LOGIN_PASSWORD are required in server/.env');
  }

  log('로그인 시도');

  try {
    const response = await client.post(API_PATHS.signIn, { email, password });
    log('로그인 성공');
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    logError(`로그인 실패 (${status || 'unknown'})`);
    throw error;
  }
}
