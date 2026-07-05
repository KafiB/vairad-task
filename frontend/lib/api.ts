import type { AuthResponse, AuthTokens } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ---- Token storage helpers ----
// Using localStorage since this is a client-rendered SPA-style app;
// tokens persist across page refreshes but are cleared on logout.

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ---- Custom error class so components can distinguish API errors ----

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message ?? `API request failed with status ${status}`);
    this.status = status;
    this.data = data;
  }
}

// ---- Core fetch wrapper ----

interface RequestOptions extends RequestInit {
  skipAuth?: boolean; // for login/register, which shouldn't attach a token
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth, headers, ...rest } = options;

  const finalHeaders: HeadersInit = {
    ...(!(rest.body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...headers,
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      (finalHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  // Attempt token refresh once on 401, then retry the original request.
  if (response.status === 401 && !skipAuth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return request<T>(path, options);
    }
    clearTokens();
    throw new ApiError(401, null, 'Session expired. Please log in again.');
  }

  if (!response.ok) {
    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      // response had no JSON body
    }
    throw new ApiError(response.status, data);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

async function tryRefreshToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
    return true;
  } catch {
    return false;
  }
}

// ---- Public API methods ----

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// ---- Auth-specific calls ----

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>('/auth/login/', { email, password }, { skipAuth: true });
  setTokens(data.tokens);
  return data;
}

export async function register(
  full_name: string,
  email: string,
  password: string,
  confirm_password: string
): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>(
    '/auth/register/',
    { full_name, email, password, confirm_password },
    { skipAuth: true }
  );
  setTokens(data.tokens);
  return data;
}

export async function logout(): Promise<void> {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await api.post('/auth/logout/', { refresh });
    }
  } finally {
    clearTokens();
  }
}