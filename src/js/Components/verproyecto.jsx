
const React = require('react');
const Navlog = require('./SubComponents/navlog.jsx');
import * as  firebase from 'firebase'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton' ;
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {uploadDocument} from './../config.jsx';
import {añadircolaborador} from './../config.jsx';
import File from 'material-ui/svg-icons/action/description';
import IconButton from 'material-ui/IconButton';
/*global localStorage*/

const carddiv ={
	width: '100%',
	height: '100%',
	display:'flex' ,
	alignItems: 'center' ,
	backgroundColor: "rgb(168,229,251)"
}

const itemcolor ={
  color: '#FFFFFF',
  marginTop: '1%',
  marginRight: '2%',
  
  height: '5%'
}

const styles={
  mediumIcon: {
    width: 48,
    height: 48,
  }
}

const iconbutton ={
    padding: 0 
}

class VerProyecto extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            auth:"",
            admin: '',
            idactivo:   localStorage.getItem('idactivo'),
            idproyecto: localStorage.getItem('idproyecto'),
            idcreador:  localStorage.getItem('idusuariodelpost'),
            nombrecreador: '' ,
            titulo: '',
            descripcion: '' ,
            mipost: false ,
            file: '' ,
            open: false , 
            usuarioslist : [],
            opencolaborador : false ,
            archivos: [] ,
            colaboradorselected : '' ,
            nombrecolaborador: '' ,
            colaboradoreslist : [],
        }
           this.getFileName = this.getFileName.bind(this);
           this.subirdocumento = this.subirdocumento.bind(this);
           this.descargardocumento = this.descargardocumento.bind(this);
            this.cambiaropcion = this.cambiaropcion.bind(this);
            this.anadircolaborador = this.anadircolaborador.bind(this);
    }




componentWillMount(){

        var padre = this;
firebase.auth().onAuthStateChanged(function(user) {
   
  if (user) {
      
            if(padre.state.idactivo == padre.state.idcreador){
                padre.setState(({ mipost: true}))
            }
  } else {
      
      
padre.setState({ auth: false});
 padre.props.history.push({pathname:'/login'})
 
  }
});


                firebase.database().ref().child('proyectos/'+ this.state.idproyecto).on('value',(snapshot) =>{
                let messages = snapshot.val();
                
                const archivos = messages.archivos ;
                let newState = [];
                
            for(let archivo in archivos){
            newState.push({
            id: archivo,
            link : archivos[archivo].link ,
            name: archivos[archivo].name ,
            });  
                }
                
                
               padre.setState({titulo: messages.nombre , descripcion: messages.descripcion, nombrecreador: messages.nombrecreador , archivos: newState});
               
               });


       const ref = firebase.database().ref().child('usuarios');
       ref.on('value',(snapshot) =>{
        let messages = snapshot.val();
        const miembros = [] ;
        for ( let cadauno in messages){
            
            miembros.push({
                id : cadauno ,
                nombre: messages[cadauno].nombre ,
            })
        }
        padre.setState({ usuarioslist: miembros })
        });

       const r = firebase.database().ref().child('proyectos/'+ this.state.idproyecto + '/colaboradores');
       r.on('value',(snapshot) =>{
        let messages = snapshot.val();
        const colaboradores = [] ;
        for ( let cadauno in messages){

              if( cadauno == this.state.idactivo){
                  console.log('ocurrio');
                 padre.setState({ mipost: true}) 
               }
            colaboradores.push({
                id : cadauno ,
                nombre: messages[cadauno].nombre ,
            })
        }
        padre.setState({ colaboradoreslist: colaboradores })
        });


}
 
     getFileName(){
        var name = document.getElementById('documentselector');
        this.state.file = name.files.item(0);
         }

    handleClose () {
    this.setState({open: false , opencolaborador: false});
  };

          handleOpen() {
    this.setState({open: true});
  };
            openColaborador() {
    this.setState({opencolaborador: true});
  };

subirdocumento(){

      uploadDocument(this.state.file , this.state.file.name , this.state.idcreador , this.state.idproyecto);
      alert('Subiendo archivo en proceso, espere un momento');
      this.setState({open:false});
}

descargardocumento(link){
   
   window.open(link,'_blank'); 
}

	cambiaropcion(e){
        const texto = document.getElementsByName('colaboradorselected');
        this.setState({
            [e.target.name]: e.target.value ,
            nombrecolaborador: texto[0].options[texto[0].selectedIndex].text
        });
       

    }

anadircolaborador( ){
    
    añadircolaborador(this.state.colaboradorselected , this.state.idproyecto , this.state.nombrecolaborador) ;
    this.setState({ opencolaborador : false})
}
	render() {

	return (
	 <MuiThemeProvider>   
	<div>
<Navlog history={this.props.history}/>

<h1 className="tituloproyectos">{'Proyecto: ' + this.state.titulo}</h1>

    	<div className="cardverproyectos" >
    	<Card style={carddiv} title="" >
        <h4>{"Descripcion: "+this.state.descripcion}</h4>
        <br/>
        <h6>{'Autor: '+ this.state.nombrecreador}</h6>
        <div style={{ display:'flex' , flexDirection: 'row' }}>
        <h6>Colaboradores :</h6>
        {this.state.colaboradoreslist.map(item=>{ 
        
        return (
           <h6 key={item.id}> {item.nombre} - </h6> 
           );
        })}
        </div>
    	<CardActions>
    	{ this.state.mipost == true ?
    	<div style={{ display:'flex' , flexDirection: 'row' }}>
        <RaisedButton  label="Subir Archivo" primary={true} onClick={ () => this.handleOpen()}  />
        <RaisedButton  label="Añadir Colaborador"  style = {{ marginLeft: '5px'}}primary={true}  onClick={ () => this.openColaborador()}  />
        </div>
        :null
    	}
		</CardActions>
        </Card>
    	</div>
    	
    	
    	              <Dialog
          title="Seleccionar Archivo"
          modal={true}
          open={this.state.open}
                 >
             <br/>
            <input type='file' id="documentselector"  onChange={this.getFileName}/>
            <br/>
            <FlatButton  style={itemcolor} label="Cancelar" onClick={ () => this.handleClose()}  backgroundColor="#00bcd4" hoverColor="#006775" />
            <FlatButton  style={itemcolor} label="Aceptar" backgroundColor="#00bcd4" hoverColor="#006775" onClick={()=> this.subirdocumento()}  />
            </Dialog>
    	
    	<Dialog
          title="Buscar Colaborador"
          modal={true}
          open={this.state.opencolaborador}
                 >
             <br/>
           
<select  className="selectfield"  value={this.state.colaboradorselected}  onChange={this.cambiaropcion} name="colaboradorselected"  >
<option   value="" >Usuarios</option>
                 	 {this.state.usuarioslist.map(item =>{
    	         return <option key={item.nombre}  value={item.id} >{item.nombre}</option> 
    	        })
    	      }
 </select>
           
            <br/>
            <FlatButton  style={itemcolor} label="Cancelar" onClick={ () => this.handleClose()}  backgroundColor="#00bcd4" hoverColor="#006775" />
            <FlatButton  style={itemcolor} label="Crear" backgroundColor="#00bcd4" hoverColor="#006775"  onClick={ () => this.anadircolaborador()} />
          </Dialog>

    	<div className="cardverproyectos" >
    	<Card style={carddiv} >
    	<h3>Archivos</h3>
<div  className="listadocumentos">
    	{this.state.archivos.map(item=>{
    	            return ( 
    	            <div key={item.id} style={{marginRight: "5%"}} >
            <IconButton  style={iconbutton} iconStyle={styles.mediumIcon} onClick={() => this.descargardocumento(item.link)} tooltip={item.name}><File/> </IconButton>
            <h6>{item.name}</h6>
            </div>
            );
})}
</div>
    	<CardActions>

		</CardActions>
        </Card>
    	</div>
    	            



</div>
</MuiThemeProvider>
	);
	}  /* END RENDER */

}export default VerProyecto;
