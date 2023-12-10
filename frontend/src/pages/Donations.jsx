import  { useEffect, useState, useRef } from "react";

export const Donations = () => {
  const ENDPOINT = 'http://localhost:4001/api/v1/proyect';
  const DONACION_ENDPOINT = 'http://localhost:4001/api/v1/donation'; 

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
        const response = await fetch(ENDPOINT, {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProyectos(data);
        } else {
          console.error("Error al obtener proyectos");
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
      EmpleadoID: 1,
      ProyectoID: currentProyecto.ProyectoID,
      FechaDonacion: new Date(),
      Monto: parseFloat(montoDonacion),
      BoletaDeposito: generarBoletaDeposito(),
      Estado: "Realizado",
    };

    try {
      const response = await fetch(DONACION_ENDPOINT, {
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
      console.error("Error al realizar la donación:", error);
      errorMessage.current.showModal();
    }
  };

  const generarBoletaDeposito = () => {
    return "BD-" + Math.floor(Math.random() * 10000);
  };

  return (
    <>
      <h1>Proyectos</h1>
      <table className="w3-table w3-striped w3-bordered w3-border">
        <thead>
          <tr>
            <th>ProyectoID</th>
            <th>NombreProyecto</th>
            <th>DescripcionProyecto</th>
            <th>MetaTotal</th>
            <th>Donar</th>
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
                <button onClick={() => handleDonarClick(proyecto)}>Donar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dialog ref={dialogDonarRef}>
        <h4>Donar al Proyecto</h4>
        <label htmlFor="montoDonacion">Monto de Donación:</label>
        <input
          type="number"
          id="montoDonacion"
          value={montoDonacion}
          onChange={(e) => setMontoDonacion(e.target.value)}
        />
        <button onClick={confirmarDonacion}>Aceptar</button>
        <button onClick={() => dialogDonarRef.current.close()}>Cancelar</button>
      </dialog>

      <dialog ref={successMessage}>
        <p>La donación se realizó con éxito.</p>
        <button onClick={() => successMessage.current.close()}>Cerrar</button>
      </dialog>

      <dialog ref={errorMessage}>
        <p>Hubo un problema al realizar la donación. Verifica el monto ingresado.</p>
        <button onClick={() => errorMessage.current.close()}>Cerrar</button>
      </dialog>
    </>
  );
};
