import  { useEffect, useState, useRef } from "react";

export const Donations = () => {
  const PROJECT_ENDPOINT = import.meta.env.VITE_PROJECT_ENDPOINT;
  const DONATION_ENDPOINT = import.meta.env.VITE_DONATION_ENDPOINT;

  const [proyectos, setProyectos] = useState([]);
  const [currentProyecto, setCurrentProyecto] = useState(null);
  const [montoDonacion, setMontoDonacion] = useState("");
  const dialogDonarRef = useRef(null);
  const successMessage = useRef(null);
  const errorMessage = useRef(null);

  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(PROJECT_ENDPOINT, {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProyectos(data);
        } else {
          console.error("Error getting projects");
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleDonarClick = (proyecto) => {
    setCurrentProyecto(proyecto);
    dialogDonarRef.current.showModal();
  };

  const confirmarDonacion = async () => {
    if (isNaN(montoDonacion) || parseFloat(montoDonacion) <= 0) {
      errorMessage.current.showModal();
      return;
    }

    const donacion = {
      DonanteID: null,
      EmpleadoID: currentProyecto.EmpleadoID,
      ProyectoID: currentProyecto.ProyectoID,
      FechaDonacion: new Date(),
      Monto: parseFloat(montoDonacion),
      BoletaDeposito: generarBoletaDeposito(),
      Estado: "Done",
    };

    try {
      const response = await fetch(DONATION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(donacion),
      });

      if (response.ok) {
        successMessage.current.showModal();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        errorMessage.current.showModal();
      }
    } catch (error) {
      console.error("Donation error:", error);
      errorMessage.current.showModal();
    }
  };

  const generarBoletaDeposito = () => {
    return "BD-" + Math.floor(Math.random() * 10000);
  };

  return (
    <>
      <h1>Projects</h1>
      <table className="w3-table w3-striped w3-bordered w3-border">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Goal</th>
            <th>Donate</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map((proyecto) => (
            <tr key={proyecto.ProyectoID}>
              <td>{proyecto.ProyectoID}</td>
              <td>{proyecto.NombreProyecto}</td>
              <td>{proyecto.DescripcionProyecto}</td>
              <td>{proyecto.MetaTotal}</td>
              <td>
                <button onClick={() => handleDonarClick(proyecto)}>Donate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dialog ref={dialogDonarRef}>
        <h4>Donar al Proyecto</h4>
        <label htmlFor="montoDonacion">Donation ammount:</label>
        <input
          type="number"
          id="montoDonacion"
          value={montoDonacion}
          onChange={(e) => setMontoDonacion(e.target.value)}
        />
        <button onClick={confirmarDonacion}>Accept</button>
        <button onClick={() => dialogDonarRef.current.close()}>Cancelar</button>
      </dialog>

      <dialog ref={successMessage}>
        <p>The donation was made successfully.</p>
        <button onClick={() => successMessage.current.close()}>Close</button>
      </dialog>

      <dialog ref={errorMessage}>
        <p>There was a problem making the donation. Check the amount entered</p>
        <button onClick={() => errorMessage.current.close()}>Cerrar</button>
      </dialog>
    </>
  );
};
