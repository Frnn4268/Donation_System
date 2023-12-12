import { NavLink, Outlet } from "react-router-dom"

export const Layout = () => {
    return(
        <div>
            <NavLink to = "/Proyectos">
                Projects
            </NavLink>

            <NavLink to = "/Usuarios">
                Users
            </NavLink>
            <Outlet/>
        </div>
    )
}