import { useState } from "react";
import { fetchWithAuth } from "../../helpers/fetchWithAuth";
import { useAuth } from "../../hooks/useAuth";
import { showToast } from "../../helpers/showToast";

interface Props {
  publicacionId: string;
  onComentarioAgregado: () => void;
}

const FormularioComentario: React.FC<Props> = ({ publicacionId, onComentarioAgregado }) => {
  const { token } = useAuth();
  const [contenido, setContenido] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim()) return;
    try {
      setEnviando(true);
      await fetchWithAuth("comentario/crear", token, {
        method: "POST",
        body: JSON.stringify({ contenido, publicacion: publicacionId }),
        headers: { "Content-Type": "application/json" },
      });
      setContenido("");
      showToast("Comentario enviado", "success");
      onComentarioAgregado();
    } catch (err) {
      console.error("[Comentario] Error al enviar:", err);
      showToast("Error al enviar el comentario", "error");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="mt-2 flex items-center gap-2">
      <input
        type="text"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        placeholder="Escribe un comentario..."
        className="input-field flex-1"
        disabled={enviando}
      />
      <button
        type="submit"
        className="btn-primary px-3 py-2 text-sm"
        disabled={enviando || !contenido.trim()}
      >
        {enviando ? "Enviando..." : "Comentar"}
      </button>
    </form>
  );
};

export default FormularioComentario;