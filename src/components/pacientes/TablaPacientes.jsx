import React, {useContext, useState} from 'react'; //importamos el useContext
import {Link, Prompt, useHistory} from 'react-router-dom';
import {PacientesContext} from '../../context/PacientesContext'; //importamos el hook que hemos creado del tipo useContext

/*MATERIAL UI*/
import '../css/Tabla.css'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

/**dialog */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';



/* Order by descending */
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'id', numeric: true, disablePadding: false, label: 'ID' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Nombre' },
  { id: 'surname', numeric: false, disablePadding: false, label: 'Apellido' },
  { id: 'age', numeric: false, disablePadding: false, label: 'Edad' },
  { id: 'acciones', numeric: false, disablePadding: false, label: 'Acciones' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort} = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
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
  deleteButton: {
    background: 'linear-gradient(45deg, #ca0f0f 10%, #ff5353 80%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
  }
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('id');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const {titulo} = props;
  
  const [pacienteAEliminar, setpacienteAEliminar] = useState(null);

  const [mensajeAlert, setmensajeAlert] = useState('');

  const {pacientes, eliminarPaciente, calcularEdad} = useContext(PacientesContext);

  const history = useHistory();  //para redirect a otra pagina


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const [open, setOpen] = React.useState(false);


  const handleClose = () => {
    setOpen(false);
  };

    const handleCloseEliminar = () => {
      setOpen(false);
      eliminarPaciente(pacienteAEliminar);
      setpacienteAEliminar(null);
      //merjora: poner notificaciones al usuario
      
    };

  const handleEliminarPaciente = (event, paciente) => {
    event.preventDefault();
    //abrimos modal para asegurarnos que quiera eliminar
    setpacienteAEliminar(paciente);
    setOpen(true);
    //eliminarPaciente(paciente); //lo gestionamos en handleCloseEliminar
  }

  const handleEditarPaciente = (event, paciente) => {
    event.preventDefault();
    history.push('pacientes/'+paciente.id);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const emptyRows = rowsPerPage - Math.min(rowsPerPage, pacientes.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
        <h1>{titulo}</h1>
        {/* SI EXISTEN PACIENTES MOSTRAMOS TABLA CON RESULTADOS. SINO, MOSTRAMOS MENSAJE */}
        {(pacientes.length > 0) ? 
              <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(pacientes, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.surname}</TableCell>
                      <TableCell align="center">{calcularEdad(row.id)}</TableCell>
                      <TableCell align="center">
                        <Fab className={classes.editButton} aria-label="edit" onClick={(event) => handleEditarPaciente(event,row)}>
                            <EditIcon />
                        </Fab>
                        <Fab className={classes.deleteButton} aria-label="edit" onClick={(event) => handleEliminarPaciente(event,row.id)}>
                            <DeleteIcon />
                        </Fab>
                        </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pacientes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </Paper>
              : <p className="sin-pacientes">No hay pacientes dados de alta.</p> }
        <Link to={'/nuevo-paciente'} className="enlace">
            <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button, classes.insertButton}
                startIcon={<AddIcon />} >
                Nuevo paciente
            </Button>
            
        </Link> 

        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Vas a eliminar un paciente"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que quieres eliminar el paciente #{pacienteAEliminar !== null ? pacienteAEliminar : null} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            ¡No!
          </Button>
          <Button onClick={handleCloseEliminar} color="primary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/*<Alert variant="outlined" severity="error">
        This is an error alert — check it out!
              </Alert>*/}
    </div>
    
  );
}
