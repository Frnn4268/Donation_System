import  { useEffect, useState, useRef } from "react";

export const Donations = () => {
  const PROJECT_ENDPOINT = import.meta.env.VITE_PROJECT_ENDPOINT;
  const DONATION_ENDPOINT = import.meta.env.VITE_DONATION_ENDPOINT;

  const [proyectos, setProyectos] = useState([]);
  const [currentProyecto, setCurrentProyecto] = useState(null);
  const [montoDonacion, setMontoDonacion] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
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

    if (selectedFile) {
      await uploadFile();
    }

    const donacion = {
      DonanteID: currentProyecto.EmpleadoID,
      EmpleadoID: currentProyecto.EmpleadoID,
      ProyectoID: currentProyecto.ProyectoID,
      FechaDonacion: new Date(),
      Monto: parseFloat(montoDonacion),
      BoletaDeposito: selectedFile ? selectedFile.name : null,
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

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("archivo", selectedFile);

    if (selectedFile.size > 5000000) {
      alert("File size exceeds the limit (5 MB). Please upload a smaller file.");
      return;
    }

    try {
      const response = await fetch(`${PROJECT_ENDPOINT}/${currentProyecto.ProyectoID}/upload-file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        alert("Error uploading file.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading file.");
    }
  };

  const openFileUploadDialog = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.doc,.docx,.jpg,.png"; // Files types
    fileInput.onchange = (e) => {
      setSelectedFile(e.target.files[0]);
      setSelectedFileName(e.target.files[0].name);
    };
    fileInput.click();
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
        <h4>Donate to Project</h4>
        <label htmlFor="montoDonacion">Donation ammount:</label>
        <input
          type="number"
          id="montoDonacion"
          value={montoDonacion}
          onChange={(e) => setMontoDonacion(e.target.value)}
        />
        <button onClick={openFileUploadDialog}>Support Document</button>
        <label>File selected: {selectedFileName}</label>
        <button onClick={confirmarDonacion}>Accept</button>
        <button onClick={() => dialogDonarRef.current.close()}>Cancel</button>
      </dialog>
    </>
  );
};
