// src/helpers/getAvatarUrl.ts
import Global from "./Global";

export const getAvatarUrl = (imagen?: string): string => {
  console.log("🟡 getAvatarUrl INPUT:", imagen);

  if (!imagen || imagen === "default.png") {
    console.log("🟡 getAvatarUrl RESULT: avatar por defecto");
    return "/img/user.png"; // ✅ nueva ruta desde public
  }

  if (imagen.startsWith("http")) {
    console.log("🟡 getAvatarUrl RESULT: ya es URL completa:", imagen);
    return imagen;
  }

  const url = `${Global.url}avatar/${imagen}`;
  console.log("🟡 getAvatarUrl RESULT:", url);
  return url;
};
