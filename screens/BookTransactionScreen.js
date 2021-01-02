import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image ,KeyboardAvoidingView ,ToastAndroid ,Alert} from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import firebase from 'firebase';
import db from '../config';
export default class TransactionScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            hasCameraPermissions: null,
            scanned: false,
            scannedData: '',
            buttonState: 'normal',
            scannedStudentId: '',
            scannedBookId: '',
            transactionMessage:''

        }
    }
    getCameraPermission = async(id) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)

        this.setState({
            hasCameraPermissions: status === "granted ",
            buttonState: id,
            scanned: false

        });
    }
    handleBarCodeScan = async({ type, data }) => {
        const { buttonState } = this.state
        if (buttonState === "BookId") {
            this.setState({
                scanned: true,
                scannedBookId: data,
                buttonState: 'normal'
            })
      }   
        else if (buttonState === "StudentId") {
            this.setState({
                scanned: true,
                scannedStudentId: data,
                buttonState: 'normal'
            })
        }

    }
    initiatebook=async()=>{
        db.collection("Transaction").add({
            'StudentId':this.state.scannedStudentId,
         'BookId':this.state.scannedBookId,
         //'date':firebase.firestore.Timestamp.now().toDate(),
        'transactiontype':"issue"
        })
        db.collection("Books").doc(this.state.scannedBookId).update({
            'BookAvailability':false
        })
        db.collection("Students").doc(this.state.scannedStudentId).update({
            'NumberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
        })
        
    }
    initiatebookreturn=async()=>{
        db.collection("Transaction").add({
            'StudentId':this.state.scannedStudentId,
         'BookId':this.state.scannedBookId,
         //'date':firebase.firestore.Timestamp.now().toDate(),
        'transactiontype':"return"
        })
        db.collection("Books").doc(this.state.scannedBookId).update({
            'BookAvailability':true
        })
        db.collection("Students").doc(this.state.scannedStudentId).update({
            'NumberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
        })
     
    }
    handleTransaction = async() => {
var transactionMessage
db.collection("Books").doc(this.state.scannedBookId).get()
.then((doc)=>{
    var book =doc.data()
    if(book.BookAvailability){
        this.initiatebook()
        transactionMessage="Book Issued"
ToastAndroid.show(transactionMessage, ToastAndroid.SHORT)
    }
    else{
        
        this.initiatebookreturn()
        transactionMessage="Book Return";
        ToastAndroid.show(transactionMessage, ToastAndroid.SHORT);
    }
})
this.setState({
    transactionMessage:transactionMessage
})
    }
    render() {
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const buttonState = this.state.buttonState;
        const scanned = this.state.scanned;
        if (buttonState !== "normal" && hasCameraPermissions) {
            return( 
               <BarCodeScanner
               onBarCodeScanned = { scanned ? undefined : this.handleBarCodeScan }
                style = { StyleSheet.absoluteFillObject }
                />

            )
        } 
        else if (buttonState === "normal") {
 
            return(
<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                
                <View> 
                    <Image source = { require("../assets/booklogo.jpg") }

                style = {{ width: 200, height: 200 } }
                />
                 <Text style = {{ textAlign: 'center', fontSize: 30 } } > Library </Text> 
                </View>
                <View style = { styles.inputVeiw } >

                <TextInput style = { styles.InputBox }
                placeholder = "Book Id"
                onChangeText ={text=>this.setState({scannedBookId:text})}
                value = { this.state.scannedBookId }/> 
                <TouchableOpacity style = { styles.button }
                onPress = {()=> { this.getCameraPermission("BookId") } } >
                <Text style = { styles.displaytext } > Scan </Text> 
                </TouchableOpacity>
                </View>
                <View style = { styles.inputVeiw } >

                <TextInput style = { styles.InputBox }
                placeholder = "Student Id"
                onChangeText ={text=>this.setState({scannedStudentId:text})}
                value = { this.state.scannedStudentId }
                />        

                <TouchableOpacity style = { styles.button }
                onPress = {()=> { this.getCameraPermission("StudentId") } } >
                <Text style = { styles.displaytext } > Scan </Text>
                </TouchableOpacity></View>
                <TouchableOpacity style = { styles.Scanbutton }
                onPress = { async()=> {var transactionMessage=await this.handleTransaction() 
                this.setState({
                    scannedBookId:'',
                    scannedStudentId:''
                })
                }}>
                <Text style = { styles.displaytext } > Submit </Text> 
                </TouchableOpacity>

               
</KeyboardAvoidingView>

            )
        }
    }
}

const styles = StyleSheet.create({
    button: {

        padding: 10,
        margin: 10,
        backgroundColor: "red"


    },
    displaytext: {
        fontSize: 24


    },
    InputBox: {
        width: 200,
        height: 40,
        borderWidth: 1.5,
        borderRightWidth: 0,
        fontSize: 20

    },
    inputVeiw: {
        flexDirection: 'row',
        margin: 20
    },
    Scanbutton: {
        width: 100,
        height: 50,
        backgroundColor: "red"
    },
    container:{
        flex: 1,
        justifyContent: 'center',
         alignItems: 'center' 
    }

})