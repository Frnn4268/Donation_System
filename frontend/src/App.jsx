import { BrowserRouter, Routes, Route, NavLink  } from "react-router-dom";
import { Proyects } from './pages/Proyects';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
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
            <NavLink to="/proyect">Proyects</NavLink>
          </li>
          <li>
            <NavLink to="/donation">Donations</NavLink>
          </li>
          <li>
            <NavLink to="/user">Users</NavLink>
          </li>
          <li>
            <NavLink to="/logout">Logout</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/proyect" element={<Proyects />} />

        <Route path="/donation" element={<Donations />} />

        <Route path="/user" element={<Users />} />

        <Route path="/logout" element={<Logout />} />
    
        <Route path="*" element={<h2>No encontramos la página :p</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
