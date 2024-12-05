import api from "./axios";

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await api.get("/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProfile = async (token: string, data: any) => {
  const response = await api.put("/users/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
