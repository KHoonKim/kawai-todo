import React, {Component} from "react";
import {View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { TextInput } from "./node_modules/react-native-gesture-handler";
import PropTypes from "prop-types";

const {width, height} = Dimensions.get("window")

export default class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing : false,
            // isCompleted : false,
            toDoValue : props.text
        }
    } 
    
    static propTypes = {
        text : PropTypes.string.isRequired,
        isCompleted : PropTypes.bool.isRequired,
        deleteToDo : PropTypes.func.isRequired,
        id : PropTypes.string.isRequired,
        uncomplteToDo : PropTypes.func.isRequired,
        complteToDo : PropTypes.func.isRequired,
        updateToDo : PropTypes.func.isRequired
    }
    
    
    render() {
        const {text, id, isCompleted, deleteToDo, uncomplteToDo, complteToDo, updateToDo} = this.props
        const {isEditing, toDoValue} = this.state

        return (
            <View style={styles.container}>
                <View style={styles.column}>
                    <TouchableOpacity onPress={this._toggleTodo}>
                        <View style={[styles.circle, isCompleted ? styles.completedCircle : styles.uncompletedCircle]} >
                        </View>
                    </TouchableOpacity>

                    {isEditing ? (
                        <TextInput 
                            style={[styles.text, styles.input]} 
                            value={toDoValue} 
                            multiline={true}
                            onChangeText={this._controllInput}
                            returnKeyType={"done"}
                            onEndEditing={this._finishEditing}
                            underlineColorAndroid={"transparent"}
                            ></TextInput>
                    ) : (
                        <Text style={[styles.text, 
                            isCompleted ? styles.completedText : styles.uncompletedText]}>
                            {text}
                        </Text>   
                    )} 
                </View>
                    {isEditing ? (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._finishEditing}>
                                <View style={styles.actionContatiner}>
                                    <Text style={styles.actionText}>✅</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._startEditing}>
                                <View style={styles.actionContatiner}>
                                    <Text style={styles.actionText}>✏️</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={event => {
                                event.stopPropagation  // 상위에 있는 Scroll view 도 이벤트에 영향을 받게 됨, 따라서 이를 막기 위해 사용한다.
                                deleteToDo(id)}}>
                                <View style={styles.actionContatiner}>
                                    <Text style={styles.actionText}>️❌</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
            </View>
        )
    }

    _toggleTodo = (event) => {
        event.stopPropagation(); // 상위에 있는 Scroll view 도 이벤트에 영향을 받게 됨, 따라서 이를 막기 위해 사용한다.
        const {isCompleted, uncomplteToDo, complteToDo, id} = this.props;
        if(isCompleted){
            uncomplteToDo(id)
        }else{
            complteToDo(id)
        }

    }

    _startEditing = (event) => {
        event.stopPropagation();
        this.setState({
            isEditing : true,
        })
    }

    _finishEditing = (event) => {
        event.stopPropagation();
        const {id, updateToDo} = this.props
        const {toDoValue} = this.state
        updateToDo(id, toDoValue)
        
        this.setState({
            isEditing : false
        })
    }

    _controllInput = (text) => {
        this.setState({
            toDoValue : text
        })

        // console.log("todoValue : " + toDoValue)
    }
}

const styles = StyleSheet.create({
    container : {
        width : width - 50,
        borderBottomColor : "#bbb",
        borderBottomWidth : StyleSheet.hairlineWidth,
        flexDirection : "row",
        alignItems : "center",
        justifyContent: 'space-between'
    },
    circle : {
        width : 30,
        height : 30,
        borderRadius : 15,
        borderColor : "red",
        borderWidth : 3,
        marginRight : 20
    },
    completedCircle : {
        borderColor : "#bbb"
    },  
    uncompletedCircle : {
        borderColor : "#F23657"
    },
    text : {
        fontWeight : "600",
        fontSize : 20,
        marginVertical : 20
    },
    completedText : {
        color : "#bbb",
        textDecorationLine : "line-through"
    },
    uncompletedText : {
        color : '#353839'
    },
    column : {
        flexDirection: 'row',
        alignItems : 'center',
        width : width / 2,
    },
    actions : {
        flexDirection: 'row',
    },
    actionContatiner : {
        marginHorizontal: 10,
        marginVertical: 10,
    },
    input : {
      marginVertical: 15,  
      width : width / 2,
      paddingBottom: 5,
    }
});