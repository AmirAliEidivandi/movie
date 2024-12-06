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
  accessToken: string;
  refreshToken: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getProfile = async (accessToken: string) => {
  const response = await api.get("/users/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const updateProfile = async (accessToken: string, data: any) => {
  const response = await api.put("/users/profile", data, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/request-password-reset", { email });
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordData) => {
  const response = await api.post("/auth/change-password", data);
  return response.data;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
