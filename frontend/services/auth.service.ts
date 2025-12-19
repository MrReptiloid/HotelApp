import api from '../lib/api';
import { LoginRequest, RegisterRequest, User } from '../types/api';

export class AuthService {
  async login(credentials: LoginRequest): Promise<User> {
    const response = await api.login(credentials.email, credentials.password);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<User> {
    const response = await api.register(data.email, data.password, data.displayName);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.refreshSession();
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();

