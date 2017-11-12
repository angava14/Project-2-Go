
const React = require('react');
const Navlog = require('./SubComponents/navlog.jsx');
import * as  firebase from 'firebase'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton' ;
import {crearnuevoproyecto} from './../config.jsx';
import {getToken} from './../config.jsx';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Arrow from 'material-ui/svg-icons/navigation/arrow-drop-down-circle';
import IconMenu from 'material-ui/IconMenu';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
/*global localStorage*/
const itemcolor ={
  color: '#FFFFFF',
  marginTop: '1%',
  marginRight: '2%',
  
  height: '5%'
}

const botoncrearproyecto = {
  margin:'0% 0% 2% 2%' ,
}

class MisProyectos extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            auth:"",
            admin: '',
            nombreproyecto: '' ,
            open: false ,
            descripcion: '' ,
            proyectos: [] ,
            menu: 1 ,
            idactivo : localStorage.getItem('idactivo') , 
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.crearproyecto = this.crearproyecto.bind(this);
         this.verproyecto = this.verproyecto.bind(this);
    }




componentWillMount(){

        var padre = this;
firebase.auth().onAuthStateChanged(function(user) {
   
  if (user) {
      
            firebase.database().ref().child('usuarios/'+ user.uid).on('value',(snapshot) =>{
            let messages = snapshot.val();
           
            padre.setState({
                auth: true,
               admin: messages.admin,
            });
            
           });
      

  } else {
      
      
padre.setState({ auth: false});
 padre.props.history.push({pathname:'/login'})
 
  }
  
  
});


           firebase.database().ref().child('usuarios/'+ this.state.idactivo + "/proyectos").on('value',(snapshot) =>{
            let messages = snapshot.val();
           
           const newState = [] ;
            for (let message in messages){
                
            newState.push({
            id: message,
            nombre: messages[message].nombre ,
            descripcion : messages[message].descripcion ,
            });  
            
            }
           
           padre.setState({
               proyectos: newState ,
           })
           
           });





}



          handleOpen() {
    this.setState({open: true});
  };
  
    handleClose () {
    this.setState({open: false , nombreproyecto: '' , descripcion: ''});
  };

          handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
            
        });
    }
    
    crearproyecto(){
        const token = getToken();
        const objeto = {
            id: this.state.idactivo ,
            nombrecreador: token.displayName , 
            nombre: this.state.nombreproyecto ,
            descripcion : this.state.descripcion , 
        }
        
        
        crearnuevoproyecto(objeto);
        this.setState({ open: false , nombreproyecto: '' , descripcion: '' });
    }

verproyecto(id){
    
        localStorage.setItem('idproyecto' , id);
        localStorage.setItem('idusuariodelpost' , this.state.idactivo);
        this.props.history.push({pathname: '/verproyecto'});
}


	render() {


		 if (this.state.auth == true) {    /*  IF */
	return (
	<div>
<Navlog history={this.props.history} admin={this.state.admin} />
<MuiThemeProvider>
<div>

<h1 className='tituloproyectos'>Mis Proyectos</h1>
<RaisedButton style={botoncrearproyecto} label="Nuevo Proyecto" primary={true} onClick={ () => this.handleOpen()}  />

              <Dialog
          title="Nuevo Proyecto"
          modal={true}
          open={this.state.open}
        >
        <br/>
    <TextField
      value={this.state.nombreproyecto}
      onChange={this.handleChange} 
      floatingLabelText="Nombre del Proyecto"
      name = "nombreproyecto"
    />
    <br/>
        <TextField
        
      value={this.state.descripcion}
      onChange={this.handleChange} 
      floatingLabelText="Descripcion"
      name='descripcion'
      multiLine={true}
      rows={5}
    />
<br/>
<FlatButton  style={itemcolor} label="Cancelar" onClick={ () => this.handleClose()}  backgroundColor="#00bcd4" hoverColor="#006775" />
<FlatButton  style={itemcolor} label="Crear" backgroundColor="#00bcd4" hoverColor="#006775" onClick={this.crearproyecto} />
</Dialog>


<div className="tabla">

<Table >
<TableHeader  adjustForCheckbox={false}  displaySelectAll={false}    >
            <TableRow>
              <TableHeaderColumn colSpan="3" tooltip="Lista de Proyectos" style={{textAlign: 'center'}}>
                Proyectos
              </TableHeaderColumn>
            </TableRow>
<TableRow    >
        <TableHeaderColumn>Nombre</TableHeaderColumn>
        <TableHeaderColumn>Descripcion</TableHeaderColumn>
        <TableHeaderColumn>Opciones</TableHeaderColumn>
</TableRow>
</TableHeader>
<TableBody  displayRowCheckbox={false} stripedRows={true} showRowHover={true} >


                        	 {this.state.proyectos.map(item=>{
    	            return (
    	            
    	<TableRow key={item.id}>
        <TableRowColumn>{item.nombre}</TableRowColumn>
        <TableRowColumn>{item.descripcion}</TableRowColumn>
        
        <TableRowColumn> 
        <IconMenu
          iconButtonElement={<IconButton><Arrow /></IconButton>}
          value={this.state.menu}
        >
          <MenuItem value={2} primaryText="Ver Perfil" onClick={() => this.verproyecto(item.id) }  />
          <MenuItem value={3} primaryText="Eliminar"/>
        
        </IconMenu>
        
        </TableRowColumn>
    	           </TableRow>
    	            
    	         )  
    	           
    	        })
    	      }


</TableBody>
</Table>

</div>


</div>
</MuiThemeProvider>
</div>
	);
}else{

return(
<div>
</div>
	);

		} /* END IF*/
	}  /* END RENDER */

}export default MisProyectos;
