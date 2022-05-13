import React, { useState } from "react";
import SplashScreen from "../screens/SplashScreen";
import { io } from "socket.io-client";
import { useFocusEffect } from '@react-navigation/native';
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    //StatusBar,
    TouchableOpacity,
    Image,
    RefreshControl,
    Modal,
  } from "react-native";
  import { stylesAnnouncements,
            chatListItem,
            dialogContainer, 
            innerDialogContainer, 
            innerDialogButtonsContainer, 
            dialogButton,
            modalBackground, 
} from "../components/styles";
  import { StatusBar } from "expo-status-bar";
  import {
    Octicons,
    Ionicons,
    Fontisto,
    AntDesign,
    Entypo,
    Feather,
  } from "@expo/vector-icons";
  import { SocketContext } from "./SocketContext";
  import { userDataContext } from "../screens/UserDataContext";
  //import { SocketContext } from "./ChatStack";


const ChatList = ({ route, navigation }) => {
    //const [userData, setUserData] = useState(route.params.userData);
    const {userData, setUserData} = React.useContext(userDataContext);
    const [isLoading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [userChats, setUserChats] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState();
    const [refreshing, setRefreshing] = useState(false);

    const [anonsId, setAnonsId] = useState(-1);
    const [header, setHeader] = useState(null);
    const [chatId, setChatId] = useState(-1); 
    const [createNewChat, setCreateNewChat] = useState(route?.params?.createNewChat); 

    //const login = route.params.userData.login;
    const login = userData.login;

    const {socket, setSocket} = React.useContext(SocketContext);
    
    React.useEffect(() => {
        //console.log(socket);
        if (socket === null || socket === undefined) {
            //const newSocket = io("http://" + serwer);
            //setSocket(newSocket);
            console.log("Nawiązuje połączenie z serwerem...");
            //console.log(newSocket);
            //console.log(socket);
        }
        else{
            console.log("ELSE");

            if (!connected) {
                socket.on("connect", (event) => {
                    // console.log("con");
                    // console.log(socket.id);
                    console.log("LACZENIE SIE WYWOLALO");
                    setConnected(true);
                    console.log("Połączono. Uwierzytelnianie...");
                });
            }
            if (connected && !authenticated) {
                socket.on("auth-response", (event) => {
                    setAuthenticated(true);
                    socket.emit('get-user-chats');
                    // console.log("auth");
                    console.log("Połączono i uwierzytelniono");
                    //setLoading(false);
                });
                socket.emit('auth-request', login);
            }
            if (connected && authenticated) {
                //console.log("W tym ifie");
                if (route?.params?.createNewChat !== undefined && route?.params?.createNewChat !== null) {
                    console.log("jakies tam paramtry sa");
                    socket.emit('new-chat', route?.params?.createNewChat);
                    console.log("TWORZRE NOWY CZAT", route?.params?.createNewChat);
                    //setCreateNewChat(null);
                    //route.params.createNewChat = null;
                    socket.once("new-chat-response", (chat_id, message) => {
                        //console.log(chat_id);
                        //console.log(message);
                        if (message === 'Chat already exists' || 'Chat created') {
                            navigation.navigate("Rozmowa", {item: {chat_id: chat_id}});

                            // socket.emit("get-chat-messages", chat_id);
                        }
                        else {
                            console.log("Nie udało się utworzyć czatu");
                            //route.params.createNewChat = null;
                        }
                    });
                }
                
                socket.on("user-chats", (count, userChats) => {
                    //console.log(userChats);
                    console.log("socket on user-chats");
                    console.log("lista ogloszen",userChats);
                    setUserChats(userChats);
                    console.log("Ustawiono czaty uzytkownika");
                    setRefreshing(false);
                    setLoading(false);
                });
////////
                socket.on("delete-chat-response", () => {
                    console.log("W socket on delete-response");
                    socket.emit('get-user-chats');
                    console.log("Usunieto czat");
                });
        
                socket.on("disconnect", () => {
                    console.log("dc");
                    setAuthenticated(false);
                    setConnected(false);
                });
            }
            return () => {
                socket.off();
                //socket.disconnect();
                //socket.removeAllListeners();
            }
        }
    },[socket, connected, authenticated, route?.params?.createNewChat])

//
    useFocusEffect(
        React.useCallback(() => {
            //console.log("FOCUS EFFECT");
            //console.log("paranetry: ",route?.params);
            setCreateNewChat(route?.params?.createNewChat);
            //console.log("socket: ",socket);

            //setTimeout(()=>console.log(socket), 5000);
            
            if (socket != null) {
                console.log("FOCUS EFFECT - odswiezono czaty");
                socket.emit('get-user-chats');
                console.log("po get user-chats w focuseffect");
                setTimeout(()=>{socket.emit('get-user-chats')}, 1000);
            }
        }, [])
    );

    const updateNewMsgs = (chat_id) => {
        let index = userChats.findIndex((item => item.chat_id == chat_id));
        let chats = userChats;
        if(chats[index].NewMsgs !== 0){
            chats[index].NewMsgs = 0;
            setUserChats(chats);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                updateNewMsgs(item.chat_id);
                navigation.navigate("Rozmowa", {item: item});
            }}
        >
          <ChatItem
            item={item}
          />
        </TouchableOpacity>
    );

    const ChatItem = ({ title, login, newMsgs, item }) => (
        <View style={chatListItem}>
            {/* {item.NewMsgs > 0 ? (
                <Ionicons name="notifications" size={28} color="red" style={{alignSelf: 'center'}}/>
            ):(
                <Ionicons name="notifications" size={28} color="lightgray" style={{alignSelf: 'center'}}/>
            )} */}
          <View style={{ flex: 1 }}>
            <Text style={{fontSize: 24}}>{item.title}</Text>
            <Text>Z użytkownikiem: {item.login}</Text>
          </View>
          <TouchableOpacity onPress={()=>{
            setModalData(item);
              toggleModal();
            }}>
            <Ionicons name="close" size={28} color="darkgray" />
          </TouchableOpacity>
          
          
        </View>
    );

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleDelete = () => {
        if(socket != null){
            socket.emit('delete-chat', modalData?.chat_id);
            //alert(modalData?.chat_id);
            toggleModal();
            console.log("handleDelete");
        }
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        if(socket != null){
            socket.emit('get-user-chats');
        }
      }, []);
////
    return(
        <View style={{flex: 1}}>
            {isLoading ? (
                <SplashScreen/>
            ):(
                <>
                {userChats.length > 0 ? (
                    <SafeAreaView style={{ flex: 1 }}>
                        <Modal visible={isModalVisible} transparent={true} onRequestClose={() => {setModalVisible(!isModalVisible)}}>
                            <View style={modalBackground}>
                                <View style={dialogContainer}>
                                    <Text style={{ fontSize: 24, color: "black", fontWeight: "bold"}}>Potwierdź</Text>
                                    <View style={innerDialogContainer}>
                                    <Text style={{ fontSize: 18, color: "black", textAlign: "center" }}>Czy na pewno chcesz usunąć ten czat?</Text>
                                    <Text style={{ fontSize: 18, color: "black", marginTop: 20}}>{modalData?.title}</Text>
                                    </View>
                                    <View style={innerDialogButtonsContainer}>
                                    <TouchableOpacity style={dialogButton} onPress={toggleModal}>
                                        <Text style={{ fontSize: 18, color: "black" }}>
                                        Anuluj
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[dialogButton, {backgroundColor: "red", borderWidth: 1, borderColor: "red"}]} onPress={handleDelete}>
                                        <Ionicons
                                        name="trash-outline"
                                        size={24}
                                        color={"white"}
                                        />
                                        <Text style={{ fontSize: 18, color: "white", marginLeft: 5 }}>
                                        Tak
                                        </Text>
                                    </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <FlatList
                            data={userChats}
                            keyExtractor={(item) => item.chat_id}
                            renderItem={renderItem}
                            refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                            }
                        />
                    </SafeAreaView>
                ):(
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{fontSize: 20}}>Nie masz jeszcze żadnych wiadomości!</Text>
                    </View>
                )}
                </>
            )}
        </View>
    );
};

export default ChatList;