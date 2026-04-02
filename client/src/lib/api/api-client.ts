class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
  }

  private getHeaders(token?: string | null) {
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Helper to extract error message from response
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Try to get error message from response body
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;

      try {
        const errorBody = await response.json();
        // Handle different error response formats
        if (errorBody.error) {
          errorMessage = errorBody.error;
        } else if (errorBody.message) {
          errorMessage = errorBody.message;
        } else if (typeof errorBody === "string") {
          errorMessage = errorBody;
        }
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = `API Error: ${response.status} ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    // For 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(path: string, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: this.getHeaders(token),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data: any, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data: any, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, data: any, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PATCH",
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers: this.getHeaders(token),
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
