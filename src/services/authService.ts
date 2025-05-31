import Global from "../helpers/Global";
import type { Usuario } from "../types/Usuario";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  token?: string;
  user?: Usuario;
  message?: string;
}

export const loginService = async ({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await fetch(Global.url + "user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data as LoginResponse;
  } catch (error) {
    console.error("Error en loginService:", error);
    return {
      status: "error",
      message: "No se pudo conectar con el servidor",
    };
  }
};
