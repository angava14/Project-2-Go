
const React = require('react');
const Navlog = require('./SubComponents/navlog.jsx');
import * as  firebase from 'firebase'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
/*global localStorage*/

class VerProyecto extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            auth:"",
            admin: '',
            idactivo:   localStorage.getItem('idactivo'),
            idproyecto: localStorage.getItem('idproyecto'),
            idcreador:  localStorage.getItem('idusuariodelpost'),
            mipost: false ,
            
        }
     
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
               console.log(messages);
               
               
               
               });





}



componentDidUpdate(){
    console.log(this.state.mipost);
}

	render() {

	return (
	 <MuiThemeProvider>   
	<div>
<Navlog history={this.props.history}/>

<h1 className="tituloproyectos">Proyecto</h1>




</div>
</MuiThemeProvider>
	);
	}  /* END RENDER */

}export default VerProyecto;
