import { NavLink, Outlet } from "react-router-dom"

export const Layout = () => {
    return(
        <div>
            <NavLink to = "/Projects">
                Projects
            </NavLink>

            <NavLink to = "/Users">
                Users
            </NavLink>
            <Outlet/>
        </div>
    )
}