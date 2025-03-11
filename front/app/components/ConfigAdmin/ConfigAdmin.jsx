import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsers, updateUser, deleteUser, addUser, refreshToken } from "../../services/authService/authService";
import ModalCrearUser from "./ModalCrearUser";
import ModalEditUser from "./ModalEditUser";
import Buttons from "../button/Button";
import Toast from "../toastr/toast";

const ConfigAdmin = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null); // Estado para el toast

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.usuarios);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      if (error.response && error.response.status === 401) {
        try {
          await refreshToken();
          const data = await getUsers();
          setUsers(data.usuarios);
        } catch (refreshError) {
          console.error("Error al refrescar el token:", refreshError);
        }
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleSave = async (updatedUser) => {
    try {
      await updateUser(updatedUser.id, updatedUser);
      setUsers((prev) =>
        prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  // Usamos el Toast de confirmación en lugar de window.confirm
  const handleDelete = (id) => {
    setToast(
      <Toast
        message="¿Seguro que quieres eliminar este usuario?"
        onConfirm={async () => {
          try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
            setToast(<Toast type="success" message="Usuario eliminado correctamente." />);
            setTimeout(() => setToast(null), 3000);
          } catch (error) {
            console.error("Error al eliminar usuario", error);
            setToast(<Toast type="failure" message="Error al eliminar usuario." />);
            setTimeout(() => setToast(null), 3000);
          }
        }}
        onCancel={() => {
          setToast(<Toast type="warning" message="Eliminación cancelada." />);
          setTimeout(() => setToast(null), 3000);
        }}
      />
    );
  };

  const handleAddUser = async (newUser) => {
    try {
      const response = await addUser(newUser);
      if (response && response.usuario) {
        setUsers((prevUsers) => [...prevUsers, response.usuario]);
        setOpenModal(false);
      } else {
        console.error("Error en la respuesta del servidor", response);
      }
    } catch (error) {
      console.error("Error al agregar usuario", error);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      { accessorKey: "name", header: "Nombre", size: 150 },
      { accessorKey: "email", header: "Correo", size: 200 },
      {
        header: "Acciones",
        size: 150,
        Cell: ({ row }) => (
          <div>
            <Tooltip title="Editar">
              <IconButton onClick={() => handleEditClick(row.original)} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => handleDelete(row.original.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({ columns, data: users });

  return (
    <div>
      {/* Renderizamos el toast si existe */}
      {toast}
      <div className="p-4">
        <div className="grid grid-cols-2 items-center mb-4 bg-[#20415e] p-4 rounded shadow">
          <h1 className="text-2xl font-bold text-white">Panel de Configuración</h1>
          <div className="flex justify-end">
            <Buttons onClick={() => setOpenModal(true)} variant="create" label="Agregar Usuario" />
          </div>
        </div>
      </div>

      <div className="content">
        <MaterialReactTable table={table} columns={columns} data={users} />
      </div>

      <ModalCrearUser open={openModal} handleClose={() => setOpenModal(false)} handleAddUser={handleAddUser} />

      <ModalEditUser open={openEditModal} handleClose={() => setOpenEditModal(false)} user={selectedUser} handleSave={handleSave} />
    </div>
  );
};

export default ConfigAdmin;
