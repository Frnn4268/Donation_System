import { useState } from "react";

export const Login = () => {
  const ENDPOINT = 'http://localhost:4001/api/v1/login';

  const [usuario, setUsuario] = useState({
    Email: "",
    PasswordHash: ""
  });

  const valueHasChanged = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value
    });
  };

  const loginClick = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      });

      if (response.ok) {
        const data = await response.json();
        // Guarda el token en el almacenamiento local
        sessionStorage.setItem("token", data.token)
        alert("Usuario autenticado con éxito");
      } else {
        alert("Error al autenticar");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w3-cell-row">
      <div className="w3-container w3-light-gray w3-cell w3-cell-middle">
        <form className="w3-container" onSubmit={loginClick}>
          <h3>Inicio de Sesión</h3>
          <label htmlFor="Email">Correo electrónico: </label>
          <input
            type="text"
            id="Email"
            name="Email"
            className="w3-input"
            value={usuario.Email}
            onChange={valueHasChanged}
          />
          <label htmlFor="PasswordHash">Contraseña: </label>
          <input
            type="password"
            id="PasswordHash"
            name="PasswordHash"
            className="w3-input"
            value={usuario.PasswordHash}
            onChange={valueHasChanged}
          />
          <button
            type="submit"
            className="w3-button-blue w3-margin-top w3-margin-bottom"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;