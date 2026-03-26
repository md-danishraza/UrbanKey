class ApiClient {
  private baseUrl: string;

  constructor() {
    // Make sure this points to your Node.js backend port (usually 5000 or 8000)
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  }

  // Accepts the token passed from the React hook
  private getHeaders(token?: string | null) {
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async get<T>(path: string, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: this.getHeaders(token),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  async post<T>(path: string, data: any, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  async put<T>(path: string, data: any, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
  async patch<T>(path: string, data: any, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PATCH  ",
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  async delete<T>(path: string, token?: string | null): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers: this.getHeaders(token),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
}

export const apiClient = new ApiClient();
