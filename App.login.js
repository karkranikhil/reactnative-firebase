import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Container, Content, Header, Form, Input, Item, Button, Label} from 'native-base';
import * as firebase from 'firebase';
const firebaseConfig = {
  apiKey: "AIzaSyC6-883CwUGPqvna267g2JZoReGr8hizKY",
  authDomain: "react-firebase-49de9.firebaseapp.com",
  databaseURL: "https://react-firebase-49de9.firebaseio.com",
  projectId: "react-firebase-49de9",
  storageBucket: "",
};
firebase.initializeApp(firebaseConfig);


export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state =({
      email:'',
      password:''
    })
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(user != null){
        console.log(user)
      }
    })
  }
  signUpUser =(email, password) =>{
    try{
      if(this.state.password.length<6){
        alert("please enter atleast 6 character")
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch(error){
      console.log(error)
    }
  }
  loginUser =(email, password) =>{
    try{
      firebase.auth().createUserWithEmailAndPassword(email, password).
      then(function(user){
        console.log(success)
        console.log(user)
      })
    } catch(error){
      console.log(success)
      console.log(error.toString())
    }
  }

  async loginWithFacebook(){
    const {type,token} = await Expo.Facebook.logInWithReadPermissionsAsync
    ('182491879087838',{permissions:['public_profile']})
    console.log(type)
    if(type === 'success'){
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      firebase.auth().signInWithCredential(credential).catch((error) => {
        console.log('facebook error', error)
      })
    }
  }
  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input 
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(email)=>this.setState({email})}/>
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input 
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(password)=>this.setState({password})}/>
          </Item>
          <Button style={{marginTop:10}}
          full 
          rounded 
          success
          onPress={()=> this.loginUser(this.state.email, this.state.password)}>
            <Text style={{color:'white'}}>Login</Text>
          </Button>
          <Button style={{marginTop:10}}
          full 
          rounded 
          primary
          onPress={()=> this.signUpUser(this.state.email, this.state.password)}>
            <Text style={{color:'white'}}>Sign Up</Text>
          </Button>
          <Button style={{marginTop:10}}
          full 
          rounded 
          primary
          onPress={()=>this.loginWithFacebook()}>
            <Text style={{color:'white'}}>Login with facebook</Text>
          </Button>
        </Form>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  }
});
