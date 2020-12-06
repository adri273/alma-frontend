import React, {useContext, useEffect} from 'react'; //importamos el useContext
import TextField from '@material-ui/core/TextField';
import '../css/NuevoPaciente.css';
import { Button, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {PacientesContext} from '../../context/PacientesContext'; //importamos el hook que hemos creado del tipo useContext
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  insertButton: {
    background: 'linear-gradient(45deg, #5CC99C 10%, #5CC99C 50%, #5E84C0 100%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
  },
  editButton: {
    background: 'linear-gradient(45deg, #FF8F00 10%, #FF8E53 80%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
  },
  backButton: {
    background: 'linear-gradient(45deg, #9e9e9e 10%, #878887 50%, #565f6d 100%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    marginTop: '30px'
  },
}));

const FormularioPaciente = ({action}) => {

const classes = useStyles();

const history = useHistory();		//HISTORY PARA HACER REDIRECT


const [error, seterror] = useState(false)
const {nuevoPaciente, lastId, getInfoPaciente, editarPaciente} = useContext(PacientesContext);

let pacienteDefault = {
    id: (parseInt(lastId())+1),  //mostramos el próximo ID concurrente
    name: '',
    surname: '',
    birthdate: ''
}

  let { idpaciente } = useParams();
if(action==="edit"){
  if(idpaciente !== null)
    pacienteDefault = getInfoPaciente(idpaciente);
  }
const [paciente, setpaciente] = useState(pacienteDefault);


const actualizarState = (e) => {
    setpaciente({
            ...paciente,    //le pasamos el state para que no lo sobreescriba entero, le pasamos todos los datos y luego modificamos
            [e.target.name]: e.target.value   //name del input : valor del input
        })
}

const handleCrear = (event) => {
    event.preventDefault();
    //validar si ambos campos están llenos
    if(paciente.id === '' || paciente.name === '' || paciente.surname === '' || paciente.birthdate === ''){
        seterror(true);
        return;
    }
    seterror(false);

    //Pasamos los datos del paciente al context
    nuevoPaciente(paciente);
    history.push('/pacientes');  //CUANDO TODO ES OK, VOLVEMOS A LISTA DE PACIENTES

}

const handleEditar = (event) => {
    event.preventDefault();
    //validar si ambos campos están llenos
    if(paciente.id === '' || paciente.name === '' || paciente.surname === '' || paciente.birthdate === ''){
        seterror(true);
        return;
    }
    seterror(false);

    //Pasamos los datos del paciente al context
    editarPaciente(paciente);
    history.push('/pacientes');  //CUANDO TODO ES OK, VOLVEMOS A LISTA DE PACIENTES

}


const handleBack = (event) => {
    event.preventDefault();
    history.push('/pacientes');  //VOLVEMOS A LISTA DE PACIENTES

}


  return (
    <div id="nuevo_paciente">
      {action==='edit' ? <h1>Modificar paciente</h1> : <h1>Nuevo paciente</h1> }
    <form noValidate autoComplete="off">
      <TextField id="standard-basic" required name="id" label="ID" defaultValue={paciente.id} InputProps={{
            readOnly: true,
          }} />
      <TextField id="standard-basic" required name="name" label="Nombre" defaultValue={paciente.name} onChange={actualizarState} />
      <TextField id="standard-basic" required name="surname" label="Apellido" defaultValue={paciente.surname} onChange={actualizarState} />
      <TextField
        id="date"
        name="birthdate"
        label="Fecha de nacimiento"
        type="date"
        defaultValue={paciente.birthdate}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={actualizarState}
      />
      {/**mostramos un botón u otro dependiendo de la acción */}
      {action === "edit" ?    
      <Button
        variant="contained"
        color="secondary"
        size="large"
        className={classes.button, classes.editButton}
        startIcon={<EditIcon />}
        type="submit"
        onClick={handleEditar}
      >
        Modificar
      </Button>
      : <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.button, classes.insertButton}
        startIcon={<AddIcon />}
        type="submit"
        onClick={handleCrear}
      >
        Crear
      </Button>
       }
      <Button
        variant="contained"
        color="secondary"
        size="large"
        className={classes.button, classes.backButton}
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
      >
        Volver a lista de pacientes
      </Button>
    </form>
    </div>
  );
}
 
export default FormularioPaciente;
