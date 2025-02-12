import React, { useState, useEffect } from "react";
import { Box, Button, Modal } from "@mui/material";
import "../toastr/toast.css"; // Asegúrate de importar los estilos necesarios

const ModalEditUser = ({ open, handleClose, user, handleSave }) => {
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setEditedData({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!editedData.name || !editedData.email) {
      alert("Nombre y correo electrónico son campos obligatorios.");
      return;
    }
        // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedData.email)) {
      alert("Por favor, introduce un correo electrónico válido.");
      return;
    }
    if (editedData.password && editedData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const dataToSave = { ...editedData };
    if (!dataToSave.password) {
      delete dataToSave.password;
    }

    handleSave(dataToSave);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-edit-title">
      <Box className="modal-container">
        <Box className="modal-content">
          <div>
            <h1>Editar Usuario</h1>
          </div>
          <div className="options">
            <label>Nombre</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                name="name"
                value={editedData.name}
                onChange={handleChange}
                required
              />
            </div>
            <label>Correo</label>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                name="email"
                value={editedData.email}
                onChange={handleChange}
                required
              />
            </div>
            <label>Nueva Contraseña</label>
            <div className="input-group">
              <input
                type="password"
                className="form-control"
                name="password"
                value={editedData.password}
                onChange={handleChange}
                placeholder="Dejar vacío para no cambiar"
              />
            </div>
            <div className="buttons">
              <Button variant="contained" color="error" onClick={handleClose}>
                Cerrar
              </Button>
              <Button variant="contained" color="success" onClick={handleSubmit}>
                Guardar
              </Button>
            </div>
          </div>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalEditUser;