import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import Login from './components/Login';
import Pacientes from './components/pacientes/Pacientes';
import FormularioPaciente from './components/pacientes/FormularioPaciente';
import Header from './components/Header';
import PacientesProvider from './context/PacientesContext';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <PacientesProvider>
        <Switch>
          <Route exact path="/pacientes" component={Pacientes} />
          <Route exact path="/nuevo-paciente" >
            <FormularioPaciente action="nuevo"/>
          </Route>
          <Route path='/pacientes/:idpaciente' >
            <FormularioPaciente action="edit"/>
          </Route>
          <Route path="/" component={Pacientes} /> {/* mejora: implementar componente login */}
        </Switch>
        </PacientesProvider>
      </Router>
    </div>
  );
}

export default App;
