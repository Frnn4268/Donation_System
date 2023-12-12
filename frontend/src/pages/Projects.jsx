import { useEffect, useState, useRef } from "react";
export const Projects = () => {
    const PROJECT_ENDPOINT = import.meta.env.VITE_PROJECT_ENDPOINT;

    const getToken = () => {
        return sessionStorage.getItem("token");
    };

    const [proyectos, setProyectos] = useState([])
    const dialogRef = useRef(null)
    const dialogDeleteRef = useRef(null)
    const [currentProyecto, setCurrentProyecto] = useState ({
        ProyectoID: 0,
        NombreProyecto: '',
        DescripcionProyecto: '',
        EmpleadoID: '',
        NombreEmpleado: '',
        ApellidoEmpleado: '',
        MetaTotal: '',
        EstadoProyecto: '',
    })

    const getAll = async () => {
        let fetchResp = await fetch(PROJECT_ENDPOINT)
        let dataJson = await fetchResp.json()
        setProyectos(dataJson);
    }

    useEffect(() => {
        (async () => {
            try {
                console.log(sessionStorage.getItem("token"));
                const response = await fetch(PROJECT_ENDPOINT, {
                    headers: {
                        "Authorization": `Bearer ${getToken()}` 
                      }
                });
                if(response.ok) {
                    const data = await response.json();
                    setProyectos(data);
                } else {
                    console.error("Error getting projects");
                }
            } catch (error) {
                console.error(error);
            }
        })()
      }, [])

    const newProyectoClick = (e) => {
        e.preventDefault()
        dialogRef.current.showModal()
    }

    const closeNewProyectoModal = (e) => {
        e.preventDefault()
        dialogRef.current.close()
    }

    const valueHasChanged = (e) => {
        setCurrentProyecto({
          ...currentProyecto,
          [e.target.name]: e.target.value,
        })
    }

    const formSubmit = async (e) => {
        e.preventDefault();
        if (currentProyecto.ProyectoID <= 0) {
            // Create
            await postData(currentProyecto);
        } else {
            // Update
            await updateData(currentProyecto);
        }
        setCurrentProyecto({
            ProyectoID: 0,
            NombreProyecto: '',
            DescripcionProyecto: '',
            EmpleadoID: '',
            NombreEmpleado: '',
            ApellidoEmpleado: '',
            MetaTotal: '',
            EstadoProyecto: ''
        });
        dialogRef.current.close();
    }

    const postData = async (data) => {
        let fetchResp = await fetch(PROJECT_ENDPOINT, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${getToken()}`
          },
          body: JSON.stringify(data)
          })
          let json = await fetchResp.json()
          await getAll()
    }

    const updateData = async (data) => {
        let fetchResp = await fetch(PROJECT_ENDPOINT + "/" + data.ProyectoID, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${getToken()}`
          },
          body: JSON.stringify(data)
        });
        let json = await fetchResp.json();
        await getAll();
    }
    

    const deleteRow = async (row)=>{
        setCurrentProyecto(row)
        dialogDeleteRef.current.showModal()
    }

    const deleteData = async (row) => {
        let fetchResp = await fetch(PROJECT_ENDPOINT + "/" + row.ProyectoID, {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${getToken()}`
          }
        });
        let json = await fetchResp.json();
        await getAll();
    }
    
    const confirmDelete = async(e)=>{
        e.preventDefault();
        await deleteData(currentProyecto);
        await dialogDeleteRef.current.close(); 
        await getAll();
    }

    const showEdit = (row) => {
        setCurrentProyecto(row);
        dialogRef.current.showModal();
    }

    const uploadFile = (project, file) => {
        if (file) {
            const formData = new FormData();
            formData.append("archivo", file);
    
            fetch(`${PROJECT_ENDPOINT}/${project.ProyectoID}/cargar-archivo`, {
                method: "POST",
                body: formData,
            })
            .then((response) => {
                if (response.ok) {
                    alert("File uploaded successfully");
                    getAll();
                } else {
                    alert("Error loading file.");
                }
            })
            .catch((error) => {
                console.error(error);
                alert("Error loading file.");
            });
        }
    };    
      
    const openFileUploadDialog = (project) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".pdf,.doc,.docx,.jpg,.png"; // Define los tipos de archivos permitidos
        fileInput.onchange = (e) => uploadFile(project, e.target.files[0]);
        fileInput.click();
    };

    const viewFile = async (project) => {
        const fetchResp = await fetch(`${PROJECT_ENDPOINT}/${project.ProyectoID}/ver-archivo`);
        if (fetchResp.status === 200) {
            const blob = await fetchResp.blob();
            const url = URL.createObjectURL(blob);
            window.open(url);
        } else {
            alert("No supporting files were found for the project.");
        }
    };

    return (
        <>
            <dialog ref={dialogRef}>
                <h4>New Project</h4>
                <form onSubmit={formSubmit} className="w3-container">
                    <label htmlFor="nombreProyecto">ProjectName</label>
                    <input
                        type="text"
                        id="NombreProyecto"
                        name="NombreProyecto"
                        className="w3-input"
                        value={currentProyecto.NombreProyecto}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="descripcionProyecto">ProjectDescripcion</label>
                    <input
                        type="text"
                        id="DescripcionProyecto"
                        name="DescripcionProyecto"
                        className="w3-input"
                        value={currentProyecto.DescripcionProyecto}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="empleadoID">EmployeeID</label>
                    <input
                        type="text"
                        id="EmpleadoID"
                        name="EmpleadoID"
                        className="w3-input"
                        value={currentProyecto.EmpleadoID}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="nombre">EmployeeFirstName</label>
                    <input
                        type="text"
                        id="NombreEmpleado"
                        name="NombreEmpleado"
                        className="w3-input"
                        value={currentProyecto.NombreEmpleado}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="apellido">EmployeeLastName</label>
                    <input
                        type="text"
                        id="ApellidoEmpleado"
                        name="ApellidoEmpleado"
                        className="w3-input"
                        value={currentProyecto.ApellidoEmpleado}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="metaTotal">TotalGoal</label>
                    <input
                        type="text"
                        id="MetaTotal"
                        name="MetaTotal"
                        className="w3-input"
                        value={currentProyecto.MetaTotal}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor='estadoProyecto'>State</label>
                        <select
                            className='w3-select'
                            name="EstadoProyecto" 
                            id="estadoProyecto"
                            value={currentProyecto.EstadoProyecto}
                            onChange={valueHasChanged}
                            >
                                <option value="">Select</option>
                                <option value="Inactivo">Idle</option>
                                <option value="Activo">Active</option>
                        </select>
                    <div className="w3-row">
                        <div className="w3-col m4">
                            <button type="submit" className="w3-button w3-green">Guardar</button>         
                        </div>
                        <div className="w3-col m4">
                            <button className="w3-button w3-red" onClick={closeNewProyectoModal}>Cerrar</button>
                        </div>
                    </div>
                </form>
            </dialog>
                <button onClick={newProyectoClick}>New Project</button>
            <h1>Projects</h1>
            <table className="w3-table w3-striped w3-bordered w3-border">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Employee ID</th>
                        <th>Employee First Name</th>
                        <th>Employee Last Name</th>
                        <th>Goal</th>
                        <th>State</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {proyectos.map((row) => (
                    <tr key={row.ProyectoID} style={{ backgroundColor: row.EstadoProyecto === "Inactivo" ? "gray" : "" }}>
                        <td>{row.ProyectoID}</td>
                        <td>{row.NombreProyecto}</td>
                        <td>{row.DescripcionProyecto}</td>
                        <td>{row.EmpleadoID}</td>
                        <td>{row.NombreEmpleado}</td>
                        <td>{row.ApellidoEmpleado}</td>
                        <td>{row.MetaTotal}</td>
                        <td>{row.EstadoProyecto}</td>
                        <td>
                            <button className="w3-button w3-yellow" onClick={(e) => { showEdit(row) }}>Edit</button>
                            <button className="w3-button w3-red" onClick={(e) => { deleteRow(row) }}>Delete</button>
                            <button className="w3-button w3-blue" onClick={(e) => { openFileUploadDialog(row) }}>Support documents</button>   
                            <button className="w3-button w3-green" onClick={(e) => { viewFile(row) }}>See Support documents</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <dialog ref={dialogDeleteRef}>
                <h4>Deletion confirmation</h4>
                <form onSubmit={confirmDelete} className="w3-container">
                    Are you sure you want to delete the project {currentProyecto.NombreProyecto}?
                    <div className="w3-row">
                        <div className="w3-col m6">
                            <button className="w3-button w3-red" type="submit">Confirm</button>
                        </div>
                        <div className="w3-col m6">
                            <button className="w3-button w3-blue" onClick={(e) => {
                                e.preventDefault();
                                dialogDeleteRef.current.close();
                            }}>Cancel</button>
                        </div>
                    </div>
                </form>
            </dialog>
        </>
    )
}