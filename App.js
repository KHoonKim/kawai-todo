import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, AsyncStorage } from 'react-native';
import { ScrollView } from './node_modules/react-native-gesture-handler';
import ToDo from './ToDo';
import {AppLoading} from 'expo'
import uuidv1 from "uuid/v1"


const { height, width } = Dimensions.get("window")

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos : false,
    toDos : {}
  };

  componentDidMount = () => {
    this._loadToDos()
  }

  render() {
    const { newToDo, loadedToDos, toDos } = this.state;

    console.log(toDos)
    if(!loadedToDos){
      <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New To Do"} 
            value={newToDo} 
            onChangeText={this._controllNewToDO}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
            underlineColorAndroid={"transparent"}
          />

          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
              .reverse()  
              .map(toDo => 
                <ToDo 
                key={toDos.id} 
                deleteToDo={this._deleteToDo}
                uncomplteToDo={this._uncomplteToDo}
                complteToDo={this._complteToDo}
                updateToDo={this._updateToDo}
                {...toDo} 
              />
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controllNewToDO = text => {
    this.setState({
      newToDo: text
    });
  };

  _loadToDos = async () => { // async 조사 필요
    try {
      const toDos = await AsyncStorage.getItem("toDos"); // 기다리라는 신호 awiat 조사
      const parsedToDos = JSON.parse(toDos);
      console.log(toDos)
      this.setState({
        loadedToDos : true, toDos : parsedToDos || {} // Object 가 null 일 경우를 대비
      })
    } catch (err) {
      console.log(err)
    }

   
  };

  _addToDo = () => {
    const {newToDo} = this.state
    if(newToDo !== ""){
      this.setState(prevState => {
        const ID = uuidv1()
        const newToDoObject = {
          [ID] : { //variable 을 이름으로 정하려면 [] 써야함
            id : ID,
            isCompleted : false,
            text : newToDo,
            createdAt : Date.now()
          }
        }

        const newState = {
          ...prevState,
          newToDo : "" ,// flush
          toDos : {
            ...prevState.toDos,
            ...newToDoObject
          }
        }

        // console.log(this.state)
        this._saveToDos(newState.toDos);
        return {...newState};
      })  
    }
  }
  _deleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id]
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }

  _uncomplteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id]: { //있으면 덮어 쓴다.
            ...prevState.toDos[id],
            isCompleted : false
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState}; 
    })
  }

  _complteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id]: { //있으면 덮어 쓴다.
            ...prevState.toDos[id],
            isCompleted : true
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState}; 
    })
  }

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id]: { //있으면 덮어 쓴다.
            ...prevState.toDos[id], text : text
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState}; 
    })
  }

  _saveToDos = (newToDos) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "400",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({  // shadow 는 ios, Android 다르다. plaform specific code 가 필요함
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    fontSize: 25,
  },
  toDos : {
    alignItems : "center"
  }

});
