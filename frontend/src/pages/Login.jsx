import { useState } from "react";

export const Login = () => {
  const ENDPOINT = "http://localhost:4000/api/v1/login";

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
        alert("Successfully authenticated user");
      } else {
        alert("Authentication failed");
        console.log(response.json())
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w3-cell-row">
      <div className="w3-container w3-light-gray w3-cell w3-cell-middle">
        <form className="w3-container" onSubmit={loginClick}>
          <h3>Login</h3>
          <label htmlFor="Email">Email: </label>
          <input
            type="text"
            id="Email"
            name="Email"
            className="w3-input"
            value={usuario.Email}
            onChange={valueHasChanged}
          />
          <label htmlFor="PasswordHash">Password: </label>
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
            className="w3-button-blue w3-margin-top w3-margin-bottom">
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;