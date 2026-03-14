class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
  }

  // Notice we now pass the token as an argument rather than using the server-side auth()
  private getHeaders(token?: string | null) {
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async get<T>(path: string, token?: string | null): Promise<T> {
    const headers = this.getHeaders(token);
    const response = await fetch(`${this.baseUrl}${path}`, { headers });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  async post<T>(path: string, data: any, token?: string | null): Promise<T> {
    const headers = this.getHeaders(token);
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  async put<T>(path: string, data: any, token?: string | null): Promise<T> {
    const headers = this.getHeaders(token);
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  async delete<T>(path: string, token?: string | null): Promise<T> {
    const headers = this.getHeaders(token);
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
}

export const apiClient = new ApiClient();
