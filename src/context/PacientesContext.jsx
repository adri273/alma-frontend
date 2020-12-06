import moment from "moment";
import { createContext, useState } from "react";

export const PacientesContext = createContext();

//Provider es donde se encuentran las funciones y state
const PacientesProvider = (props) => {
	//creamos el state del context
	const [pacientes, setpacientes] = useState([{
        id: 1, 
        name: "Adrián",
        surname: "Avellaneda",
        birthdate: "27/03/1994"
    },{
        id: 2, 
        name: "Pepe",
        surname: "Apellido",
        birthdate: "27/03/1979"
    },{
        id: 3, 
        name: "Montse",
        surname: "Garcia",
        birthdate: "27/03/1982"
    }]);


    //función para eliminar PAciente
    const eliminarPaciente = (id) => {
        setpacientes(pacientes.filter(paciente => paciente.id != id));
    }

    //función para crear nuevo paciente
    const nuevoPaciente = (paciente) => {
        setpacientes([...pacientes, paciente]);
    }

    //función para editar un paciente
    const editarPaciente = (nuevosDatos) => {

        const pacienteIndex = pacientes.findIndex(paciente => paciente.id == nuevosDatos.id );
        let copyPacientes = [...pacientes];
        copyPacientes[pacienteIndex] = nuevosDatos;
        setpacientes(copyPacientes);
        
    }

    //función para obtener el último id de pacientes
    const lastId = () => {
        return (pacientes.length > 0) ? pacientes[pacientes.length - 1].id : 0;  //esto si está conectado a api/bd no podrá ser 0
    }

    //funcion para obtener datos del paciente a través del id
    const getInfoPaciente = (id) => {
            return pacientes.filter(paciente => paciente.id == id)[0];
    }

    //función para calcular edad paciente
    const calcularEdad = (id) => {
        const bday = pacientes.filter(paciente => paciente.id == id)[0].birthdate;
        const date = bday.split('/');
        return moment().diff([date[2],date[1], date[0]], 'years');
    }
  

	//aquí también pondremos el useEffect

	return(
	<PacientesContext.Provider
		value={{		//lo que vaya aquí dentro son valores que van a estar disponibles dentro de los componentes
			pacientes,
            setpacientes,
            eliminarPaciente,
            nuevoPaciente,
            lastId,
            getInfoPaciente,
            editarPaciente,
            calcularEdad
		}}
	>
		{props.children}	{/*los diferentes componentes del proyecto van a estar dentro de este props.children, para pasarle los datos del provider*/}
	</PacientesContext.Provider>

	)
}
export default PacientesProvider;