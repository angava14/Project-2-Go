
const React = require('react');
const Nav = require('./SubComponents/nav.jsx');
import {saveUser} from './../config.jsx';
import {saveFotoDefault} from './../config.jsx';
import {saveUserEnOrg} from './../config.jsx';
import {auth} from './../config.jsx';
import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import {logout} from './../config.jsx';

  const card ={
	display:'flex',
	'justifycontent':'center',
	padding:'0px',
	'paddingTop':'16px',
	'flexDirection': 'column',
	'alignItems':'center'
	
}



class Registro extends React.Component {
	        constructor() {
        super();
        this.state = {
            email: '',
            name: '',
            orgselected: '',
            lastname: '',
            password: '' ,
            snack: false ,
            snackuso: false ,
            snackinvalido: false ,
            snackdebil: false ,
          
        }
            this.handleChange = this.handleChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleRequestClose = this.handleRequestClose.bind(this);
          
    }
    

	
	
	handleChange(e){
        
        this.setState({
            [e.target.name]: e.target.value
            
        });
    }
	
	handleSubmit(e) {
        e.preventDefault();
        const padre = this;
		const emailtemp = this.state.email;
		const nametemp = this.state.name;
		const lastnametemp= this.state.lastname;
		const passwordtemp = this.state.password;
	

		auth(emailtemp, passwordtemp)
		.then((userRecord) => {
              var	objeto = {
					uid: userRecord.uid ,
					email: userRecord.email,
					name: nametemp+" "+lastnametemp ,
					password: passwordtemp,
					link: 'https://firebasestorage.googleapis.com/v0/b/proyectofinal-a3139.appspot.com/o/fotodefault%2Fphoto.jpg?alt=media&token=1a60d501-a316-403f-80e5-28f9c9cd9358'
				}
				saveUser(objeto);
				saveFotoDefault(objeto);
				userRecord.updateProfile({displayName: nametemp+" "+lastnametemp});
                padre.props.history.push({pathname:'/login'});          
            
            
			}).catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;
       if (errorCode === "auth/email-already-in-use"){
          padre.setState({ snackuso: true})
       }else{
           if(errorCode === "auth/invalid-email"){
               
               padre.setState({ snackinvalido: true})
           }else{
               
               if (errorCode === "auth/weak-password"){
                  
                   padre.setState({ snackdebil: true})
               }
           }
           
       }
       
       
        });  

 

	}
	
	
      handleRequestClose () {
          
    this.setState({
      snack: false,
      snackuso: false,
      snackinvalido: false,
      snackdebil: false,
    });
  }
	
	render() {
	return (<section>


		<MuiThemeProvider>
  <div>
 <Nav history={this.props.history} />
 <form className="cardloginregistro"  onSubmit={this.handleSubmit} >
      <div className="login">
  
  	<Card >
  	
		<CardTitle style={card}  titleStyle={card}  title="Registro"  />
		
    	<CardActions>
      <TextField
      floatingLabelText="Nombre" value={this.state.name} onChange={this.handleChange}  name="name" type="text"
    /><br />
        <TextField
      
      floatingLabelText="Apellido" value={this.state.lastname} onChange={this.handleChange}  name="lastname" type="text"
    /><br />
            <TextField
      
      floatingLabelText="Correo Electronico" value={this.state.email} onChange={this.handleChange}  name="email"  type="mail"
    /><br />
    
                <TextField
      
      floatingLabelText="Contraseña" value={this.state.password} onChange={this.handleChange}  name="password"  type="password"
    /><br />

        <button className="botoncard">Aceptar</button>
		</CardActions>
        </Card>
        
       <Snackbar
          open={this.state.snack}
          message="Usuario Creado"
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
        
               <Snackbar
          open={this.state.snackuso}
          message="Correo Electronico en Uso"
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
               <Snackbar
          open={this.state.snackinvalido}
          message="Correo Electronico Invalido"
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
               <Snackbar
          open={this.state.snackdebil}
          message="Contraseña muy debil"
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
        
        
  </div>
  </form>
  </div>
  </MuiThemeProvider>

	</section>);
	}
}

export default Registro;
