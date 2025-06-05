import Global from "./Global";

interface FetchWithAuthOptions extends RequestInit {
  isFormData?: boolean;
}

/**
 * Helper genérico para realizar fetch con token de autenticación
 * con logs automáticos de depuración
 * @param endpoint - Ruta relativa (sin /api/)
 * @param token - JWT válido
 * @param options - Opciones estándar de fetch + flag isFormData
 * @returns - La respuesta tipada
 */
export async function fetchWithAuth<T>(
  endpoint: string,
  token: string,
  options: FetchWithAuthOptions = {}
): Promise<T> {
  if (!token || token.trim() === "") {
    console.warn("[fetchWithAuth] ❗ Token ausente o vacío.");
    throw new Error("Token no disponible");
  }

  // ✅ Limpieza profesional del token
  const cleanToken = token.trim();

  const headers: HeadersInit = options.isFormData
    ? {
        Authorization: cleanToken, // sin 'Bearer'
      }
    : {
        "Content-Type": "application/json",
        Authorization: cleanToken, // sin 'Bearer'
      };

  const url = `${Global.url}${endpoint}`;

  // ✅ Logs de depuración completos
  console.debug("[fetchWithAuth] ➜ Enviando solicitud a:", url);
  console.debug("[fetchWithAuth] ➜ Método:", options.method || "GET");
  console.debug("[fetchWithAuth] ➜ Token recibido:", JSON.stringify(token));
  console.debug("[fetchWithAuth] ➜ Headers finales:", headers);
  if (options.body && !options.isFormData) {
    console.debug("[fetchWithAuth] ➜ Payload:", options.body);
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error(
      `[fetchWithAuth] ❌ Error ${res.status}:`,
      data || res.statusText
    );
    throw new Error(data?.message || "Error en la solicitud");
  }

  console.debug("[fetchWithAuth] ✅ Respuesta recibida:", data);
  return data as T;
}
