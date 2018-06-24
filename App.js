import React from 'react';
import { StyleSheet, Text, View, ListView, StatusBar } from 'react-native';
import {Container, Content, Header, Form, Input, Item, Button, Label,Icon, List, ListItem} from 'native-base';
import * as firebase from 'firebase';
import {Permissions, Notifications} from 'expo';
const firebaseConfig = {
  apiKey: "AIzaSyC6-883CwUGPqvna267g2JZoReGr8hizKY",
  authDomain: "react-firebase-49de9.firebaseapp.com",
  databaseURL: "https://react-firebase-49de9.firebaseio.com",
  projectId: "react-firebase-49de9",
  storageBucket: "",
};
firebase.initializeApp(firebaseConfig);
var data = []

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2})
    this.state={
      ListViewData:data,
      newContact:''
    }
  }
  componentDidMount(){
    var that = this
    firebase.auth().signInWithEmailAndPassword('nixalar@yahoo.com',
  'password').then(user=>{
    that.registerForPushNotificationsAsync(user)
  })
    firebase.database().ref('/contacts').on('child_added', function(data){
      var newData = [...that.state.ListViewData]
      newData.push(data)
      that.setState({ListViewData: newData})
    })
  }
  registerForPushNotificationsAsync = async (user)=>{
    const {status:existingStatus} = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if(existingStatus !== 'granted'){
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if(finalStatus !=='granted'){
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();

    var updates={}
    updates['/expoToken'] = token
    firebase.database().ref('user').child(user.uid).update(updates)
  }
  addRow(data){
    this.setState({
      newContact:''
    })
    console.log(data);
    var key = firebase.database().ref('/contacts').push().key
    firebase.database().ref('/contacts').child(key).set({name:data})
  }
  async deleteRow(secId,rowId,rowMap,data){
    await firebase.database().ref('contacts/'+data.key).set(null)
    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData=[...this.state.ListViewData]
    newData.splice(rowId,1)
    this.setState({ListViewData:newData})
  }
  showInformation(){
    
  }
  render() {
    return (
      <Container style={styles.container}>
        <Header style={{marginTop:StatusBar.currentHeight}}>
          <Content>
            <Item>
              <Input
              value={this.state.newContact}
              placeholder="Add Note"
              onChangeText={(newContact)=>this.setState({newContact})}
              />
              <Button 
              onPress={()=>this.addRow(this.state.newContact)}>
                <Icon name="add"/>
              </Button>
            </Item>
          </Content>
          </Header>
          <Content>
            <List 
            enableEmptySections
            dataSource = {this.ds.cloneWithRows(this.state.ListViewData)}
            renderRow={(data)=>{
              console.log(data)
              return (
            <ListItem>
              <Text>{data.val().name}</Text>
            </ListItem>
              )
            
            }
            }
            renderLeftHiddenRow={data=>
            <Button full onPress={()=>this.addRow(data)}>
            <Icon name="information-circle"/></Button>}
            renderRightHiddenRow={(data,secId,rowId,rowMap)=>
              <Button full danger onPress={()=>this.deleteRow(secId,rowId,rowMap,data)}>
              <Icon name="trash"/></Button>}
              leftOpenValue={75}
              rightOpenValue={-75}
            />
          </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
