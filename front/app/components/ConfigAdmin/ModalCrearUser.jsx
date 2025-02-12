import { useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import Toast from "../toastr/toast"; // Importa el componente Toast

const ModalCrearUser = ({ open, handleClose, handleAddUser }) => {
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });
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
      setNewUser({ name: "", email: "", password: "" });
      handleClose();

      // 🔹 Mostrar el toast de éxito
      setToast(<Toast type="success" message="Los datos se han guardado correctamente." />);
      setTimeout(() => setToast(null), 3000); // 🔹 Oculta el toast después de 3 segundos
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      setToast(<Toast type="error" message="Error al guardar los datos." />);
      setTimeout(() => setToast(null), 3000); // 🔹 Oculta el toast después de 3 segundos
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast} {/* Renderiza el toast */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box className="modal-container">
          <Box className="modal-content">
            <div>
              <h1>Agregar Nuevo Usuario</h1>
            </div>
            <div className="options">
              <label>Nombre</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={newUser.name}
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
                  value={newUser.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <label>Contraseña</label>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className="error-text">* Todos los campos son obligatorios</p>}
              <div className="buttons">
                <Button variant="contained" color="error" onClick={handleClose}>
                  Cerrar
                </Button>
                <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ModalCrearUser;
