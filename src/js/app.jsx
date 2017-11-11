/*Router Page*/
const Style = require('../css/style.scss');
import Login from'./Components/login.jsx';
import Home from'./Components/home.jsx';
import Registro from'./Components/registro.jsx';
import Perfil from'./Components/perfil.jsx';
import Proyectos from'./Components/proyectos.jsx';


import React from 'react'
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

  
    
 ReactDOM.render((
  <Router>
  <div>
    <Route exact path="/"  component={Home} />
    <Route exact path="/login"  component={Login} />
    <Route exact path="/proyectos"  component={Proyectos} />
    <Route exact path="/perfil"  component={Perfil} />
    <Route exact path="/registro"  component={Registro} />
    </div>
  </Router>
), document.getElementById('app'));