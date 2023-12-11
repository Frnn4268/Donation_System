import { useEffect, useState, useRef } from "react";
export const Proyectos = () => {
    const ENDPOINT = "http://localhost:4000/api/v1/proyectos";

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
        let fetchResp = await fetch(ENDPOINT)
        let dataJson = await fetchResp.json()
        setProyectos(dataJson);
    }

    useEffect(() => {
        (async () => {
            try {
                console.log(sessionStorage.getItem("token"));
                const response = await fetch(ENDPOINT, {
                    headers: {
                        "Authorization": `Bearer ${getToken()}` // Cambia "x-access-token" a "Authorization"
                      }
                });
                if(response.ok) {
                    const data = await response.json();
                    setProyectos(data);
                } else {
                    console.error("Error al obtener proyectos");
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
        let fetchResp = await fetch(ENDPOINT, {
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
        let fetchResp = await fetch(ENDPOINT + "/" + data.ProyectoID, {
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
        let fetchResp = await fetch(ENDPOINT + "/" + row.ProyectoID, {
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
    
            fetch(`${ENDPOINT}/${project.ProyectoID}/cargar-archivo`, {
                method: "POST",
                body: formData,
            })
            .then((response) => {
                if (response.ok) {
                    alert("Archivo cargado con éxito.");
                    getAll();
                } else {
                    alert("Error al cargar el archivo.");
                }
            })
            .catch((error) => {
                console.error(error);
                alert("Error al cargar el archivo.");
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
        const fetchResp = await fetch(`${ENDPOINT}/${project.ProyectoID}/ver-archivo`);
        if (fetchResp.status === 200) {
            const blob = await fetchResp.blob();
            const url = URL.createObjectURL(blob);
            window.open(url);
        } else {
            alert("No se encontraron archivos de soporte para el proyecto.");
        }
    };

    return (
        <>
            <dialog ref={dialogRef}>
                <h4>Nuevo Proyecto</h4>
                <form onSubmit={formSubmit} className="w3-container">
                    <label htmlFor="nombreProyecto">NombreProyecto</label>
                    <input
                        type="text"
                        id="NombreProyecto"
                        name="NombreProyecto"
                        className="w3-input"
                        value={currentProyecto.NombreProyecto}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="descripcionProyecto">DescripcionProyecto</label>
                    <input
                        type="text"
                        id="DescripcionProyecto"
                        name="DescripcionProyecto"
                        className="w3-input"
                        value={currentProyecto.DescripcionProyecto}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="empleadoID">EmpleadoID</label>
                    <input
                        type="text"
                        id="EmpleadoID"
                        name="EmpleadoID"
                        className="w3-input"
                        value={currentProyecto.EmpleadoID}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="NombreEmpleado"
                        name="NombreEmpleado"
                        className="w3-input"
                        value={currentProyecto.NombreEmpleado}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="apellido">Apellido</label>
                    <input
                        type="text"
                        id="ApellidoEmpleado"
                        name="ApellidoEmpleado"
                        className="w3-input"
                        value={currentProyecto.ApellidoEmpleado}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor="metaTotal">MetaTotal</label>
                    <input
                        type="text"
                        id="MetaTotal"
                        name="MetaTotal"
                        className="w3-input"
                        value={currentProyecto.MetaTotal}
                        onChange={valueHasChanged}
                    />
                    <label htmlFor='estadoProyecto'>Estado</label>
                        <select
                            className='w3-select'
                            name="EstadoProyecto" 
                            id="estadoProyecto"
                            value={currentProyecto.EstadoProyecto}
                            onChange={valueHasChanged}
                            >
                                <option value="">Seleccione</option>
                                <option value="Inactivo">Inactivo</option>
                                <option value="Activo">Activo</option>
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
                <button onClick={newProyectoClick}>Nuevo Proyecto</button>
            <h1>Proyectos</h1>
            <table className="w3-table w3-striped w3-bordered w3-border">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Empleado ID</th>
                        <th>Nombre empleado</th>
                        <th>Apellido empleado</th>
                        <th>Meta Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
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
                            <button className="w3-button w3-yellow" onClick={(e) => { showEdit(row) }}>Editar</button>
                            <button className="w3-button w3-red" onClick={(e) => { deleteRow(row) }}>Borrar</button>
                            <button className="w3-button w3-blue" onClick={(e) => { openFileUploadDialog(row) }}>Documentos de Soporte</button>   
                            <button className="w3-button w3-green" onClick={(e) => { viewFile(row) }}>Ver Documento de Soporte</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <dialog ref={dialogDeleteRef}>
                <h4>Confirmación de borrado</h4>
                <form onSubmit={confirmDelete} className="w3-container">
                    ¿Está seguro de que desea eliminar el proyecto {currentProyecto.NombreProyecto}?
                    <div className="w3-row">
                        <div className="w3-col m6">
                            <button className="w3-button w3-red" type="submit">Confirmar</button>
                        </div>
                        <div className="w3-col m6">
                            <button className="w3-button w3-blue" onClick={(e) => {
                                e.preventDefault();
                                dialogDeleteRef.current.close();
                            }}>Cancelar</button>
                        </div>
                    </div>
                </form>
            </dialog>
        </>
    )
}