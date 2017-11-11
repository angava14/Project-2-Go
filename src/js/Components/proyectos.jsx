
const React = require('react');
const Navlog = require('./SubComponents/navlog.jsx');
import * as  firebase from 'firebase'


class Proyectos extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            auth:"",
            admin: ''
        }

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


}



	render() {


		 if (this.state.auth == true) {    /*  IF */
	return (
	<div>
<Navlog history={this.props.history} admin={this.state.admin} />

<h1>Pagina Proyectos</h1>
</div>
	);
}else{

return(
<div>
</div>
	);

		} /* END IF*/
	}  /* END RENDER */

}export default Proyectos;
