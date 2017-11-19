
const React = require('react');
const Navlog = require('./SubComponents/navlog.jsx');
import * as  firebase from 'firebase'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
/*global localStorage*/
const card ={
	display:'flex',
	'justifyContent':'center',
	padding:'0px',
	'paddingTop':'16px',
	cursor: 'pointer'
}

const carddiv ={
	width: '100%',
	backgroundColor: "rgb(168,229,251)"
}




class Home extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            auth:"",
            admin: '',
            proyectos: [] ,
        }
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

           firebase.database().ref().child('proyectos/').on('value',(snapshot) =>{
            let messages = snapshot.val();
           
           const newState = [] ;
            for (let message in messages){
                
            newState.push({
            id: message,
            autor : messages[message].autor ,
            nombrecreador: messages[message].nombrecreador ,
            nombre: messages[message].nombre ,
            descripcion : messages[message].descripcion ,
            });  
            
            }
           
           padre.setState({
               proyectos: newState ,
           })
           
           });





}



verproyecto(id , idusuariodelpost){
    
        localStorage.setItem('idproyecto' , id);
        localStorage.setItem('idusuariodelpost' , idusuariodelpost);
        this.props.history.push({pathname: '/verproyecto'});
}



	render() {


		 if (this.state.auth == true) {    /*  IF */
	return (
	 <MuiThemeProvider>   
	<div>
<Navlog history={this.props.history} admin={this.state.admin} />

<h1 className="tituloproyectos">Lista Proyectos</h1>

{this.state.proyectos.map(item=>{
    	            return ( 
    	            <div key={item.id} className="cardsproyectos" >
    	<Card style={carddiv} >
		<CardTitle style={card} titleStyle={card}   title={item.nombre}  onClick={ ()=> this.verproyecto(item.id , item.autor)}/>
		
    	<CardActions>
           <h5>{item.descripcion}</h5>
           <br/>
           <h6>{"Autor: " + item.nombrecreador}</h6>
		</CardActions>
        </Card>
    	            
    	            
    	            </div>
    	            );
})}




</div>
</MuiThemeProvider>
	);
}else{

return(
<div>
</div>
	);

		} /* END IF*/
	}  /* END RENDER */

}export default Home;
