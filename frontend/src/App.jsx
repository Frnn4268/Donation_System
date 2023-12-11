import { BrowserRouter, Routes, Route, NavLink  } from "react-router-dom";
import { Proyectos } from './pages/Projects';
import { Login } from './pages/Login';
import { Usuarios } from './pages/Users';
import { Register } from './pages/Register';
import { Logout } from './pages/Logout';
import { Donations } from './pages/Donations';

import "./App.css";

function App() {
  
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Login</NavLink>
          </li>
          <li>
            <NavLink to="/register">Register</NavLink>
          </li>
          <li>
            <NavLink to="/proyectos">Proyectos</NavLink>
          </li>
          <li>
            <NavLink to="/donaciones">Donaciones</NavLink>
          </li>
          <li>
            <NavLink to="/usuarios">Usuarios</NavLink>
          </li>
          <li>
            <NavLink to="/logout">Cerrar sesión</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/proyectos" element={<Proyectos />} />

        <Route path="/donaciones" element={<Donations />} />

        <Route path="/usuarios" element={<Usuarios />} />

        <Route path="/logout" element={<Logout />} />
    
        <Route path="*" element={<h2>No encontramos la página :p</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
