import { baseUrl } from "./BaseUrl";

// Mocking Axios interface using Fetch for compatibility
const fetchWrapper = {
  create: (config: any) => {
    const defaultHeaders = config.headers || { "content-type": "application/json" };
    
    const request = async (url: string, options: any = {}) => {
      let token;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("accessToken");
      }

      const headers: any = { ...options.headers };
      
      // If it's not FormData, add default headers
      if (!(options.body instanceof FormData)) {
        Object.assign(headers, defaultHeaders);
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const fullUrl = url.startsWith("http") ? url : `${config.baseURL}${url}`;
      
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (response.status === 401 && !url.includes("login")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }

      const data = await response.json().catch(() => ({}));
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: options,
      };
    };

    return {
      get: (url: string, options: any = {}) => request(url, { ...options, method: "GET" }),
      post: (url: string, body?: any, options: any = {}) => 
        request(url, { 
          ...options, 
          method: "POST", 
          body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined)
        }),
      put: (url: string, body?: any, options: any = {}) => 
        request(url, { 
          ...options, 
          method: "PUT", 
          body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined)
        }),
      delete: (url: string, options: any = {}) => request(url, { ...options, method: "DELETE" }),
      interceptors: {
        request: { use: () => {} }, // Mocked
        response: { use: () => {} }, // Mocked
      }
    };
  }
};

export const axiosConfig = fetchWrapper.create({
  baseURL: baseUrl,
  headers: { "content-type": "application/json" },
});
