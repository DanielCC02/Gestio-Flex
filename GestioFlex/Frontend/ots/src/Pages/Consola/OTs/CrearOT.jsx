import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Components/Navbar/Navbar";
import DataList from "../../../Components/DataList/DataList";
import { useSnackbar } from "notistack";
import "../../../Styles/Global.css";
import "../Insumos/insumos.css"; // Para usar userForm, formBox, btnUserForm

export default function CrearOT() {
  const { enqueueSnackbar } = useSnackbar();
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [ot, setOt] = useState({
    titulo: "",
    fecha_inicio: "",
    fecha_finalizacion: "",
    notas: "",
  });

  const [usuariosSel, setUsuariosSel] = useState([]);
  const [serviciosSel, setServiciosSel] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOt((prev) => ({ ...prev, [name]: value }));
  };

  const fetchUsuarioLabel = async (id) => {
    try {
      const token = sessionStorage.getItem("access");
      const r = await fetch(`${API_URL}/usuario/api/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error("No se pudo cargar usuario");
      const u = await r.json();
      return u.username || `Usuario #${id}`;
    } catch {
      return `Usuario #${id}`;
    }
  };

  const fetchServicioLabel = async (id) => {
    try {
      const token = sessionStorage.getItem("access");
      const r = await fetch(`${API_URL}/servicio/servicios/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error("No se pudo cargar servicio");
      const s = await r.json();
      return s.nombre || `Servicio #${id}`;
    } catch {
      return `Servicio #${id}`;
    }
  };

  const addUsuario = async (id) => {
    const numId = Number(id);
    if (!numId || usuariosSel.some((u) => u.id === numId)) return;
    const label = await fetchUsuarioLabel(numId);
    setUsuariosSel((prev) => [...prev, { id: numId, label }]);
  };
  const removeUsuario = (id) =>
    setUsuariosSel((prev) => prev.filter((u) => u.id !== id));

  const addServicio = async (id) => {
    const numId = Number(id);
    if (!numId || serviciosSel.some((s) => s.id === numId)) return;
    const label = await fetchServicioLabel(numId);
    setServiciosSel((prev) => [...prev, { id: numId, label }]);
  };
  const removeServicio = (id) =>
    setServiciosSel((prev) => prev.filter((s) => s.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ot.fecha_inicio && ot.fecha_finalizacion) {
      const fi = new Date(ot.fecha_inicio);
      const ff = new Date(ot.fecha_finalizacion);
      if (ff < fi) {
        enqueueSnackbar(
          "La fecha de finalización no puede ser menor que la fecha de inicio.",
          { variant: "warning" }
        );
        return;
      }
    }

    const payload = {
      estado: "EP",
      titulo: ot.titulo.trim(),
      fecha_inicio: ot.fecha_inicio || null,
      fecha_finalizacion: ot.fecha_finalizacion || null,
      notas: ot.notas ?? "",
      usuarios_ids: usuariosSel.map((u) => u.id),
      servicios_ids: serviciosSel.map((s) => s.id),
    };

    if (!payload.titulo) {
      enqueueSnackbar("El título es obligatorio.", { variant: "warning" });
      return;
    }

    try {
      const token = sessionStorage.getItem("access");
      const res = await fetch(`${API_URL}/ot/ots/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      let data = null;
      try {
        data = await res.json();
      } catch { }
      if (!res.ok) {
        const msg =
          (data && (data.detail || data.message || JSON.stringify(data))) ||
          `Error al crear OT (status ${res.status})`;
        enqueueSnackbar(msg, { variant: "error" });
        return;
      }
      enqueueSnackbar("OT creada correctamente", { variant: "success" });
      navigate("/ordenes");
    } catch (err) {
      enqueueSnackbar(err.message || "Error al crear OT", { variant: "error" });
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="title">
          <h1>Crear Orden de Trabajo</h1>
        </div>

        <div className="contenido">
          <form className="userForm" onSubmit={handleSubmit}>
            <div className="formBox">
              <label>Título</label>
              <input
                name="titulo"
                value={ot.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formBox">
              <label>Fecha Inicio</label>
              <input
                type="date"
                name="fecha_inicio"
                value={ot.fecha_inicio}
                onChange={handleChange}
              />
            </div>

            <div className="formBox">
              <label>Fecha Finalización</label>
              <input
                type="date"
                name="fecha_finalizacion"
                value={ot.fecha_finalizacion}
                onChange={handleChange}
              />
            </div>

            <div className="formBox">
              <label>Notas</label>
              <input
                type="text"
                name="notas"
                value={ot.notas}
                onChange={handleChange}
                placeholder="Notas breves…"
              />
            </div>

            {/* Usuarios */}
            <div className="formBox">
              <label>Asignar Usuarios</label>
              <DataList
                apiUrl={`${API_URL}/usuario/api/`}
                keyField="id"
                valueField="id"
                renderOption={(u) => u.username || `Usuario #${u.id}`}
                onSelect={addUsuario}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {usuariosSel.map((u) => (
                  <span key={u.id} className="tag">
                    {u.label}
                    <button type="button" onClick={() => removeUsuario(u.id)}>
                      ❌
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Servicios */}
            <div className="formBox">
              <label>Asignar Servicios</label>
              <DataList
                apiUrl={`${API_URL}/servicio/servicios/`}
                keyField="id"
                valueField="id"
                renderOption={(s) => s.nombre || `Servicio #${s.id}`}
                onSelect={addServicio}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {serviciosSel.map((s) => (
                  <span key={s.id} className="tag">
                    {s.label}
                    <button type="button" onClick={() => removeServicio(s.id)}>
                      ❌
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center", // centra horizontalmente
                alignItems: "center",     // centra verticalmente
                marginTop: 20,
                gap: 12,                  // espacio entre botones
                width: "100%",             // asegura que tome todo el ancho
              }}
            >
              <button type="submit" className="btnUserForm">
                Guardar OT
              </button>
              <button
                type="button"
                className="btnUserForm"
                onClick={() => navigate("/ordenes")}
              >
                Volver
              </button>
            </div>


          </form>
        </div>
      </main>
    </>
  );
}
