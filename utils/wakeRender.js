const https = require("https");

const url = "https://red-social-backend.onrender.com"; // Cambia si es necesario

function estaDentroDelHorario() {
  const ahora = new Date();
  const hora = ahora.getHours(); // Local por defecto en tu PC

  // Horario activo: 06:00 a 20:59 (inclusive)
  return hora >= 6 && hora < 21;
}

function hacerPing() {
  const ahora = new Date().toLocaleString("es-VE", {
    timeZone: "America/Caracas",
  });

  if (estaDentroDelHorario()) {
    https
      .get(url, (res) => {
        console.log(`[${ahora}] ✅ Ping enviado → Código ${res.statusCode}`);
      })
      .on("error", (err) => {
        console.error(`[${ahora}] ❌ Error al hacer ping:`, err.message);
      });
  } else {
    console.log(
      `[${ahora}] ⏸️ Fuera del horario (06:00–21:00). No se envía ping.`
    );
  }
}

console.log(
  "⏰ Script keep-alive iniciado. Enviando pings solo entre 06:00 y 21:00 (hora local)..."
);

hacerPing(); // Primer intento inmediato
setInterval(hacerPing, 10 * 60 * 1000); // Cada 10 minutos
