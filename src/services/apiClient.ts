// Short-Lived Access Token held exclusively IN MEMORY (never persisted to localStorage)
let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

const API_BASE_URL = 'http://localhost:8000';

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export class ApiError extends Error {
  response?: {
    status: number;
    data: any;
  };

  constructor(status: number, data: any) {
    super(data?.detail || 'API Request Failed');
    this.response = { status, data };
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

async function customFetch<T = any>(
  endpoint: string,
  method: string = 'GET',
  options: RequestOptions = {},
  isRetry: boolean = false
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (inMemoryAccessToken) {
    headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include', // Send/receive HttpOnly Refresh Cookie
  };

  if (options.body !== undefined) {
    config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  let response: Response;
  let data: any;

  try {
    response = await fetch(url, config);
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
  } catch (networkError: any) {
    throw new ApiError(503, { detail: 'Unable to connect to TrustLayer Security Gateway server.' });
  }

  // Handle 401 Unauthorized with Rotating HttpOnly Refresh Token Flow
  if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/register')) {
    if (isRefreshing) {
      return new Promise<ApiResponse<T>>((resolve, reject) => {
        failedQueue.push({
          resolve: async () => {
            try {
              const res = await customFetch<T>(endpoint, method, options, true);
              resolve(res);
            } catch (err) {
              reject(err);
            }
          },
          reject: (err) => reject(err),
        });
      });
    }

    isRefreshing = true;

    try {
      // Call real backend HttpOnly Refresh Cookie endpoint
      const refreshRes = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!refreshRes.ok) {
        throw new Error('Refresh failed');
      }

      const refreshData = await refreshRes.json();
      const newAccessToken = refreshData.access_token;
      setAccessToken(newAccessToken);

      processQueue(null, newAccessToken);
      return customFetch<T>(endpoint, method, options, true);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      setAccessToken(null);
      window.dispatchEvent(new CustomEvent('trustlayer:auth_expired'));
      throw new ApiError(401, { detail: 'Session expired. Please log in again.' });
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return {
    data,
    status: response.status,
  };
}

export const apiClient = {
  get: <T = any>(url: string, headers?: Record<string, string>) =>
    customFetch<T>(url, 'GET', { headers }),
  post: <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
    customFetch<T>(url, 'POST', { body, headers }),
  put: <T = any>(url: string, body?: any, headers?: Record<string, string>) =>
    customFetch<T>(url, 'PUT', { body, headers }),
  delete: <T = any>(url: string, headers?: Record<string, string>) =>
    customFetch<T>(url, 'DELETE', { headers }),
};
