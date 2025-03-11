"use client";

import { useState } from "react";
import { Modal } from "@mui/material";
import Toast from "../toastr/toast";
import Text from "../text/Text";
import Buttons from "../button/Button";

const ModalCrearUser = ({ open, handleClose, handleAddUser }) => {
  // Se inicializa 'admin' como 0 (no es admin)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", admin: 0 });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // Estado para manejar el toast

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    setError(false);
  };

  const handleSubmit = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setError(true);
      return;
    }

    setLoading(true);

    try {
      await handleAddUser(newUser);
      setNewUser({ name: "", email: "", password: "", admin: 0 });
      handleClose();

      // Mostrar toast de éxito
      setToast(<Toast type="success" message="Los datos se han guardado correctamente." />);
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      setToast(<Toast type="error" message="Error al guardar los datos." />);
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast} {/* Renderiza el toast */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Text type="title">Agregar Nuevo Usuario</Text>
            <div className="space-y-3">
              <Text type="subtitle">Nombre</Text>
              <input
                type="text"
                className="w-full p-2 border rounded"
                name="name"
                value={newUser.name}
                onChange={handleChange}
                required
              />
              <Text type="subtitle">Correo</Text>
              <input
                type="email"
                className="w-full p-2 border rounded"
                name="email"
                value={newUser.email}
                onChange={handleChange}
                required
              />
              <Text type="subtitle">Contraseña</Text>
              <input
                type="password"
                className="w-full p-2 border rounded"
                name="password"
                value={newUser.password}
                onChange={handleChange}
                required
              />
              <Text type="subtitle">¿Es administrador?</Text>
              <select
                name="admin"
                value={newUser.admin}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, admin: Number(e.target.value) }))
                }
                className="w-full p-2 border rounded"
              >
                <option value={0}>No</option>
                <option value={1}>Sí</option>
              </select>
              {error && (
                <p className="text-red-500 text-sm">
                  * Todos los campos son obligatorios
                </p>
              )}
              <div className="flex justify-center gap-2">
                <Buttons onClick={handleClose} variant="cancel" />
                <Buttons onClick={handleSubmit} variant="save" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalCrearUser;
