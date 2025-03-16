import api from "./axios";

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  emailOrUsername: string;
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

interface DeleteAccountData {
  password: string;
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

export const changePassword = async (
  token: string,
  data: ChangePasswordData
) => {
  const response = await api.post(`/auth/change-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

export const requestEmailVerification = async (token: string) => {
  const response = await api.post(
    `/auth/request-verification`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const verifyEmail = async (token: string, code: string) => {
  const response = await api.post(
    `/auth/verify-email`,
    { code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getEmailVerificationStatus = async (token: string) => {
  const response = await api.get(`/auth/email-verification-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteAccount = async (token: string, data: DeleteAccountData) => {
  const response = await api.delete("/users/delete-account", {
    headers: { Authorization: `Bearer ${token}` },
    data,
  });
  return response.data;
};
