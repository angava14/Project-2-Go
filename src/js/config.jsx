/*Firebase Functions Page*/
import * as  firebase from 'firebase'

  
    var config = {
    apiKey: "AIzaSyAMOwnsCogetDEAFXKaBY3rHm4Bq2WwOyQ",
    authDomain: "project2go-24170.firebaseapp.com",
    databaseURL: "https://project2go-24170.firebaseio.com",
    projectId: "project2go-24170",
    storageBucket: "project2go-24170.appspot.com",
    messagingSenderId: "309265132306"
  };
  firebase.initializeApp(config);

export const fire = firebase.storage();


const ref = firebase.database().ref()
const firebaseAuth = firebase.auth

export function auth (email, pw) {
  return firebaseAuth().createUserWithEmailAndPassword(email, pw)
}

export function logout () {
  return firebaseAuth().signOut()
}

export function login (email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw)
}

export function resetPassword (email) {
  return firebaseAuth().sendPasswordResetEmail(email)
}

export function actualizarpass (id , password) {
  
  firebase.database().ref("usuarios/"+id).update({ password: password });
  
}

export function saveUser (user) {
  return ref.child(`usuarios/${user.uid}`)
    .set({
       uid: user.uid,
      correo: user.email,
      nombre: user.name,
      password: user.password,
      
    })
    .then(() => user)
}
  
 export function saveFotoDefault (objeto) {
  return ref.child('usuarios/'+objeto.uid+'/avatar')
    .set({
       link: objeto.link ,
       name: 'photo.jpg'
    })
    
} 
  




export function  uploadImage(file,fileName , iduser){
 
        var fileName = file.name;
        var storageRef = firebase.storage().ref(iduser+'/images/'+fileName);
        var uploadTask = storageRef.put(file);
        
        uploadTask.on('state_changed', function(snapshot){
            
            
        }, function(error){
            
        } , function(){
            var downloadURL = uploadTask.snapshot.downloadURL;
            
            const imageRef = firebase.database().ref().child('usuarios/'+iduser+'/avatar');
            const newImage = {
                link: downloadURL,
                name: fileName
            }
            
          imageRef.set(newImage);
          
        });
        
        
    }

export function getToken(){
  var user = firebase.auth().currentUser;
  return user ;
}


export function crearnuevoproyecto(objeto){
   const messagesRef = firebase.database().ref().child('usuarios/'+objeto.id+'/proyectos/');
  const proyecto ={
     nombre: objeto.nombre,
     descripcion: objeto.descripcion,
   }
   const temp =  messagesRef.push(proyecto);
   const key  = temp.key;
   console.log(key);
    
  
  
  const Ref = firebase.database().ref().child('proyectos/'+ key);
  const proyect ={
     descripcion: objeto.descripcion,
     autor: objeto.id,
     nombre: objeto.nombre ,
     nombrecreador: objeto.nombrecreador , 
   }
     Ref.set(proyect);
    
}


export function uploadDocument(archivo , nombrearchivo , idcreador , idproyecto){
 
         var storageRef = firebase.storage().ref(idcreador+"/proyectos/"+idproyecto+"/"+nombrearchivo);
        var uploadTask = storageRef.put(archivo);
 
 
        uploadTask.on('state_changed', function(snapshot){
            
            
        }, function(error){
            
        } , function(){
            var downloadURL = uploadTask.snapshot.downloadURL;
            
            const imageRef = firebase.database().ref().child('proyectos/'+idproyecto+'/archivos/');
            const newImage = {
                link: downloadURL,
                name: nombrearchivo
            }
            
          imageRef.push(newImage);
          
        });
        
}


export function añadircolaborador(idusuario , idproyecto , nombrecolaborador){
   const messagesRef = firebase.database().ref().child('proyectos/'+idproyecto+"/colaboradores/"+idusuario);
   const objeto = {
       nombre : nombrecolaborador
   }
   messagesRef.update(objeto);
}
