import { useState } from "react";

export const Register = () => {
    const ENDPOINT = "http://localhost:4000/api/v1/register"; // Endpoint para el registro

    const [usuario, setUsuario] = useState({
        Nombre: "",
        Apellido: "",
        Email: "",
        PasswordHash: "",
        Rol: "Empleado", // Opción predeterminada
        Activo: true
    });

    const valueHasChanged = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value,
        });
    }

    const registerClick = async (e) => {
        e.preventDefault();

        try {
            let response = await fetch(ENDPOINT, {
                method: "POST",
                credentials: "include",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                alert("Registered user successfully");
                // Puedes redirigir al usuario a otra página o hacer algo más después del registro.
            } else {
                alert("Error registering user");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="w3-cell-row">
            <div className="w3-container w3-light-gray w3-cell w3-cell-middle">
                <form className="w3-container" onSubmit={registerClick}>
                    <h3>User register</h3>
                    <label htmlFor="Nombre">First Name: </label>
                    <input
                        type="text"
                        id="Nombre"
                        name="Nombre"
                        className="w3-input"
                        value={usuario.Nombre}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="Apellido">Last Name: </label>
                    <input
                        type="text"
                        id="Apellido"
                        name="Apellido"
                        className="w3-input"
                        value={usuario.Apellido}
                        onChange={valueHasChanged}
                    />
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
                    <label htmlFor="Rol">Rol: </label>
                    <select
                        id="Rol"
                        name="Rol"
                        className="w3-select"
                        value={usuario.Rol}
                        onChange={valueHasChanged}
                    >
                        <option value="Empleado">Employee</option>
                        <option value="Donador">Donor</option>
                    </select>
                    <button type="submit" className="w3-button-blue w3-margin-top w3-margin-bottom">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;