import { createAsyncThunk } from "@reduxjs/toolkit";
import { httpGet, httpPost, httpPut } from "../../../utils";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "monitor" | "user";
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUserServer = createAsyncThunk<AuthResponse, LoginCredentials>(
  "auth/loginUserServer",
  async (credentials) => {
<<<<<<< HEAD
    const usuarios = await httpGet(`http://localhost:3001/usuarios?email=${credentials.email}`);
    
=======
    const usuarios = await httpGet(
      `http://localhost:3001/usuarios?email=${credentials.email}`
    );

>>>>>>> 69d9a21a9ecc33b72e2f993160dd7421106cba84
    if (!usuarios || usuarios.length === 0) {
      throw new Error("Email não encontrado.");
    }

    const usuario = usuarios[0];

    if (usuario.password !== credentials.password) {
      throw new Error("Senha incorreta.");
    }

    const { password, ...userWithoutPassword } = usuario;

    const authResponse: AuthResponse = {
      user: userWithoutPassword as User,
      token: `fake-jwt-token-${usuario.role}-${usuario.id}-${Date.now()}`,
    };

    localStorage.setItem("token", authResponse.token);

    return authResponse;
  }
);

<<<<<<< HEAD
export const resetPasswordServer = createAsyncThunk<{ message: string }, string>(
  'auth/resetPasswordServer',
  async (email) => {
    const usuarios = await httpGet(`http://localhost:3001/usuarios?email=${email}`);
=======
export const resetPasswordServer = createAsyncThunk<
  { message: string },
  string
>("auth/resetPasswordServer", async (email) => {
  const usuarios = await httpGet(
    `http://localhost:3001/usuarios?email=${email}`
  );
>>>>>>> 69d9a21a9ecc33b72e2f993160dd7421106cba84

  if (!usuarios || usuarios.length === 0) {
    throw new Error("Email não encontrado.");
  }

  return {
    message: "Redirecionando para a página de redefinir senha!",
  };
});

export interface UpdatePasswordCredentials {
  email: string;
  newPassword: string;
}

<<<<<<< HEAD
export const updatePasswordServer = createAsyncThunk<{ message: string }, UpdatePasswordCredentials>(
  'auth/updatePasswordServer',
  async (credentials) => {
    const usuarios = await httpGet(`http://localhost:3001/usuarios?email=${credentials.email}`);

    if (!usuarios || usuarios.length === 0) {
      throw new Error('Email não encontrado.');
    }

    const usuario = usuarios[0];

    await httpPut(`http://localhost:3001/usuarios/${usuario.id}`, {
      ...usuario,
      password: credentials.newPassword,
    });

    return {
      message: 'Senha alterada com sucesso!',
    };
=======
export const updatePasswordServer = createAsyncThunk<
  { message: string },
  UpdatePasswordCredentials
>("auth/updatePasswordServer", async (credentials) => {
  const usuarios = await httpGet(
    `http://localhost:3001/usuarios?email=${credentials.email}`
  );

  if (!usuarios || usuarios.length === 0) {
    throw new Error("Email não encontrado.");
>>>>>>> 69d9a21a9ecc33b72e2f993160dd7421106cba84
  }

  const usuario = usuarios[0];

  await httpPut(`http://localhost:3001/usuarios/${usuario.id}`, {
    ...usuario,
    password: credentials.newPassword,
  });

  return {
    message: "Senha alterada com sucesso!",
  };
});
