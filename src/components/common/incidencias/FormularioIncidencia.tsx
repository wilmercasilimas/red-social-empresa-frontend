import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showToast } from "../ui/showToast";
import { Plus } from "lucide-react";
import BotonIcono from "../../ui/BotonIcono";

interface Usuario {
  _id: string;
  nombre: string;
  apellidos: string;
}

interface Props {
  onIncidenciaCreada: () => void;
}

const FormularioIncidencia: React.FC<Props> = ({ onIncidenciaCreada }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [form, setForm] = useState({
    tipo: "permiso",
    descripcion: "",
    usuario: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const obtenerUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://red-social-empresa-backend.onrender.com/api/user/usuarios",
        {
          headers: { Authorization: token || "" },
        }
      );
      const data = await response.json();
      if (data.status === "success") setUsuarios(data.usuarios);
    } catch {
      showToast("Error al cargar usuarios", "error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación previa
    if (!form.usuario || !startDate || !endDate) {
      showToast("Todos los campos son obligatorios", "error");
      return;
    }

    const payload = {
      tipo: form.tipo,
      descripcion: form.descripcion,
      usuario: form.usuario,
      fecha_inicio: startDate.toISOString(),
      fecha_fin: endDate.toISOString(),
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://red-social-empresa-backend.onrender.com/api/incidencia/crear",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        showToast("Incidencia registrada", "success");
        setForm({
          tipo: "permiso",
          descripcion: "",
          usuario: "",
          fecha_inicio: "",
          fecha_fin: "",
        });
        setStartDate(null);
        setEndDate(null);
        onIncidenciaCreada();
      } else {
        showToast(data.message || "Error al registrar incidencia", "error");
      }
    } catch {
      showToast("Error al registrar la incidencia", "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 border rounded-md shadow-md space-y-4 mt-4"
    >
      <div>
        <label className="form-label">Empleado:</label>
        <Select
          options={usuarios.map((u) => ({
            value: u._id,
            label: `${u.nombre} ${u.apellidos}`,
          }))}
          classNamePrefix="react-select"
          onChange={(selected) => {
            if (selected) {
              setForm({ ...form, usuario: selected.value });
            }
          }}
        />
      </div>

      <div>
        <label className="form-label">Tipo de incidencia:</label>
        <Select
          classNamePrefix="react-select"
          options={[
            { value: "permiso", label: "Permiso" },
            { value: "reposo", label: "Reposo" },
            { value: "falta", label: "Falta" },
            { value: "cumpleaños", label: "Cumpleaños" },
            { value: "aniversario", label: "Aniversario" },
          ]}
          defaultValue={{
            value: form.tipo,
            label: form.tipo.charAt(0).toUpperCase() + form.tipo.slice(1),
          }}
          onChange={(selected) => {
            if (selected) {
              setForm({ ...form, tipo: selected.value });
            }
          }}
        />
      </div>

      <div>
        <label className="form-label">Descripción:</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="form-label">Fecha inicio:</label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => {
            if (!date) return;
            setStartDate(date);
            setForm({ ...form, fecha_inicio: date.toISOString() });
          }}
          className="input-field"
          dateFormat="dd-MM-yyyy"
          placeholderText="Selecciona una fecha"
        />
      </div>

      <div>
        <label className="form-label">Fecha fin:</label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => {
            if (!date) return;
            setEndDate(date);
            setForm({ ...form, fecha_fin: date.toISOString() });
          }}
          className="input-field"
          dateFormat="dd-MM-yyyy"
          placeholderText="Selecciona una fecha"
        />
      </div>

      <BotonIcono
        type="submit"
        texto="Registrar Incidencia"
        Icono={Plus}
        variante="primario"
      />
    </form>
  );
};

export default FormularioIncidencia;
