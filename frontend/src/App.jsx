import { BrowserRouter, Routes, Route, NavLink  } from "react-router-dom";
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Projects } from './pages/Projects';
import { Donations } from './pages/Donations';
import { UserDonations } from './pages/UserDonations';
import { Users } from './pages/Users';
import { Logout } from './pages/Logout';

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
            <NavLink to="/proyectos">Projects</NavLink>
          </li>
          <li>
            <NavLink to="/donaciones">Donations</NavLink>
          </li>
          <li>
            <NavLink to="/donaciones/my-donations">User Donations</NavLink>
          </li>
          <li>
            <NavLink to="/usuarios">Users</NavLink>
          </li>
          <li>
            <NavLink to="/logout">Logout</NavLink>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/proyectos" element={<Projects />} />

        <Route path="/donaciones" element={<Donations />} />

        <Route path="/donaciones/my-donations" element={<UserDonations />} />

        <Route path="/usuarios" element={<Users />} />

        <Route path="/logout" element={<Logout />} />
    
        <Route path="*" element={<h2>Page not found :p</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
