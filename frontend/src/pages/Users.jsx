import { useEffect, useState } from "react";

export const Users = () => {
  const ENDPOINT = 'http://localhost:4001/api/v1/usuarios';

  const [usuarios, setUsuarios] = useState([]);

  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  const toggleUserStatus = async (user) => {
    try {
      const newStatus = user.Activo === true ? false : true;

      const response = await fetch(`${ENDPOINT}/${user.UsuarioID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}` // Cambia "x-access-token" a "Authorization"
        },
        body: JSON.stringify({ ...user, Activo: newStatus })
      });

      if (response.ok) {
        const updatedUsers = usuarios.map((u) =>
          u.UsuarioID === user.UsuarioID ? { ...u, Activo: newStatus } : u
        );
        setUsuarios(updatedUsers);
      } else {
        console.error("Error al actualizar el estado del usuario");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        console.log(sessionStorage.getItem("token"));
        const response = await fetch(ENDPOINT, {
          headers: {
            "Authorization": `Bearer ${getToken()}` // Cambia "x-access-token" a "Authorization"
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.error("Error al obtener usuarios");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      <table className="w3-table w3-striped w3-bordered w3-border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.UsuarioID}>
              <td>{user.UsuarioID}</td>
              <td>{user.Nombre}</td>
              <td>{user.Apellido}</td>
              <td>{user.Email}</td>
              <td>{user.Rol}</td>
              <td>
                {user.Activo ? (
                  <button
                    className="w3-button w3-green"
                    onClick={() => toggleUserStatus(user)}
                  >
                    Activo
                  </button>
                ) : (
                  <button
                    className="w3-button w3-red"
                    onClick={() => toggleUserStatus(user)}
                  >
                    Inactivo
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
