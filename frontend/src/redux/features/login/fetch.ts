import { createAsyncThunk } from "@reduxjs/toolkit";
import { httpGet, httpPost, httpPut } from "../../../utils";

export interface User {
  id: number;
  nome: string;
  email: string;
  role: "admin" | "monitor" | "user";
  isAtivo: boolean;
}

export interface AuthResponse {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUserServer = createAsyncThunk<AuthResponse, LoginCredentials>(
  "auth/loginUserServer",
  async (credentials) => {
    const res = await httpPost("http://localhost:3001/login", {
      email: credentials.email,
      password: credentials.password,
    });

    if (!res || !res.message) {
      throw new Error("Erro ao fazer login.");
    }

    const token = res.message;

    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const user: User = {
      id: payload.id,
      nome: "",
      email: credentials.email,
      role: payload.role.toLowerCase(),
      isAtivo: true,
    };

    const authResponse: AuthResponse = {
      token
    };

    localStorage.setItem("token", authResponse.token);
    console.log("Token armazenado no localStorage:", credentials.email, credentials.password);
    return authResponse;
  }
);

export const logoutUserServer = createAsyncThunk<void, void>(
  "auth/logoutUserServer",
  async () => {
    localStorage.removeItem("token");
  }
);

export const resetPasswordServer = createAsyncThunk<
  { message: string },
  string
>("auth/resetPasswordServer", async (email) => {
  const res = await httpPost(
    `http://localhost:3001/recuperar-senha`, {
      email: email
    }
  );

  if (!res || res.length === 0) {
    throw new Error("Email não encontrado.");
  }
  console.log(email);
  return {
    message: "Redirecionando para a página de redefinir senha!",
  };
});

export interface UpdatePasswordCredentials {
  newPassword1: string;
  newPassword2: string;
}

export const updatePasswordServer = createAsyncThunk<
  { message: string },
  UpdatePasswordCredentials
>("auth/updatePasswordServer", async (credentials) => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  console.log("senhas",credentials.newPassword1, credentials.newPassword2);
  const pass = await httpPut(
    `http://localhost:3001/redefinir-senha?token=${token}`, {
      newPassword1: credentials.newPassword1,
      newPassword2: credentials.newPassword2,
    }
  );

  return {
    message: "Senha alterada com sucesso!",
  };
});