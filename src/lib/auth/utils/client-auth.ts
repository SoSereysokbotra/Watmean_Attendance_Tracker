class AuthClient {
  private baseUrl = "/api/auth";

  async signup(data: {
    email: string;
    fullName: string;
    password: string;
    role?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async verifyEmail(code: string) {
    const response = await fetch(`${this.baseUrl}/verify/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return response.json();
  }

  async refreshToken(refreshToken: string) {
    const response = await fetch(`${this.baseUrl}/tokens/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    return response.json();
  }

  async requestPasswordReset(email: string) {
    const response = await fetch(`${this.baseUrl}/password/forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.json();
  }

  async verifyResetCode(code: string) {
    const response = await fetch(`${this.baseUrl}/password/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return response.json();
  }

  async resetPassword(newPassword: string, confirmPassword: string) {
    const response = await fetch(`${this.baseUrl}/password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword, confirmPassword }),
    });
    return response.json();
  }

  async logout(refreshToken: string) {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    return response.json();
  }

  async getProfile(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  }

  async getSessions(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/sessions/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  }

  async logoutAllSessions(accessToken: string) {
    const response = await fetch(`${this.baseUrl}/sessions/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  }

  async revokeSession(accessToken: string, sessionId: string) {
    const response = await fetch(`${this.baseUrl}/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  }
}

export const authClient = new AuthClient();
