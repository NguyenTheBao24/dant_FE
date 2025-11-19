import localStorageService from './local-storage.service';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_KEY = 'jwt_token';

class ApiService {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    
    // Thêm interceptor mặc định để xử lý JWT token
    this.addRequestInterceptor(this.handleAuthToken);
    this.addResponseInterceptor(this.handleAuthResponse);
  }

  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  handleAuthToken = async (config) => {
    const token = localStorageService.get(TOKEN_KEY);
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    return config;
  }

  handleAuthResponse = async (response) => {
    // Xử lý response liên quan đến authentication
    if (response.status === 401) {
      localStorageService.remove(TOKEN_KEY);
      // Có thể thêm logic redirect đến trang login ở đây
      window.location.href = '/login';
    }
    return response;
  }

  async applyRequestInterceptors(config) {
    let currentConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      currentConfig = await interceptor(currentConfig);
    }
    return currentConfig;
  }

  async applyResponseInterceptors(response) {
    let currentResponse = { ...response };
    for (const interceptor of this.responseInterceptors) {
      currentResponse = await interceptor(currentResponse);
    }
    return currentResponse;
  }

  async request(method, url, data = null, customHeaders = {}) {
    let config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...customHeaders,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      // Áp dụng request interceptors
      config = await this.applyRequestInterceptors(config);

      const response = await fetch(this.baseURL + url, config);
      const responseInfo = {
        status: response.status,
        headers: response.headers,
        data: null
      };

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseInfo.data = await response.json();
      } else {
        responseInfo.data = await response.text();
      }

      // Áp dụng response interceptors
      const processedResponse = await this.applyResponseInterceptors(responseInfo);

      if (!response.ok) {
        throw processedResponse;
      }

      return processedResponse.data;
    } catch (error) {
      throw error;
    }
  }

  get(url, headers = {}) {
    return this.request('GET', url, null, headers);
  }

  post(url, data, headers = {}) {
    return this.request('POST', url, data, headers);
  }

  put(url, data, headers = {}) {
    return this.request('PUT', url, data, headers);
  }

  delete(url, headers = {}) {
    return this.request('DELETE', url, null, headers);
  }
}

export default new ApiService(); 