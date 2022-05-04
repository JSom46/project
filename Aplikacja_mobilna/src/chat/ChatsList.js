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
  } from "react-native";
  import { stylesAnnouncements, chatListItem } from "../components/styles";
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

  const ChatItem = ({ title, login, newMsgs }) => (
    <View style={chatListItem}>
      <View style={{ flex: 1 }}>
        <Text style={{fontSize: 24}}>{title}</Text>
        <Text>Z użytkownikiem: {login}</Text>
      </View>
      {newMsgs > 0 ? (
        <Ionicons name="notifications" size={28} color="red" />
      ):(
        <Ionicons name="notifications" size={28} color="lightgray" />
      )}
    </View>
  );

const ChatList = ({ route, navigation }) => {
    //const [userData, setUserData] = useState(route.params.userData);
    const {userData, setUserData} = React.useContext(userDataContext);
    const [isLoading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [userChats, setUserChats] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    const [anonsId, setAnonsId] = useState(-1);
    const [header, setHeader] = useState(null);
    const [chatId, setChatId] = useState(-1); 
    const [createNewChat, setCreateNewChat] = useState(route?.params?.createNewChat); 

    //const login = route.params.userData.login;
    const login = userData.login;

    const {socket, setSocket} = React.useContext(SocketContext);
    

    React.useEffect(() => {
        //console.log(socket);
        if (socket === null) {
            const newSocket = io("http://" + serwerIP + ":2400");
            setSocket(newSocket);
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
                    setLoading(false);
                });
                socket.emit('auth-request', login);
            }
            if (connected && authenticated) {
                console.log("A CZY TU DZIALA", route?.params?.createNewChat);
                console.log("W tym ifie");
                if (route?.params?.createNewChat !== undefined && route?.params?.createNewChat !== null) {
                    console.log("jakies tam paramtry sa");
                    socket.emit('new-chat', route?.params?.createNewChat);
                    console.log("TWORZRE NOWY CZAT");
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
                    setUserChats(userChats);
                    console.log("Ustawiono czaty uzytkownika");
                });
                
                // socket.on("chat-img", (image_id, chat_id, username, datetime, lastImage, img_name, img_type) => {
                //     // console.log(image_id);
                //     // console.log(chat_id);
                //     // console.log(username);
                //     // console.log(datetime);
                //     // console.log(lastImage);
                //     // console.log(img_name);
                //     // console.log(img_type);
                //     var msg = {
                //         message_id: image_id,
                //         chat_id: chat_id,
                //         image_id: lastImage,
                //         username: username,
                //         message_date: datetime,
                //     }
                //     if (chat_id === chatId) setChatMessages((prev) => [...prev, msg])
                // });
                // socket.on("image", (image_id, img_name, img_type, img_data) => {
                //     // console.log(image_id);
                //     // console.log(img_name);
                //     // console.log(img_type);
                //     // console.log(img_data);
                //     const blob = new Blob([img_data], { type: img_type })
                //     const url = URL.createObjectURL(blob);
                //     setOpenImageDialog({
                //         open: true,
                //         src: url
                //     })
                // });
                socket.on("disconnect", () => {
                    // console.log("dc");
                    setAuthenticated(false);
                    setConnected(false);
                });
            }
            return () => {
                socket.off();
                socket.removeAllListeners();
            }
        }
    },[socket, connected, authenticated, route?.params?.createNewChat])

    useFocusEffect(
        React.useCallback(() => {
            console.log("FOCUS EFFECT");
            console.log("paranetry: ",route?.params);
            setCreateNewChat(route?.params?.createNewChat);
            //console.log(socket);
            if (socket != null) {
                console.log("FOCUS EFFECT - odswiezono czaty");
                socket.emit('get-user-chats');
            }
            
        }, [])
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Rozmowa", {item: item})}
        >
          <ChatItem
            title={item.title}
            login={item.login}
            newMsgs={item.newMsgs}
          />
        </TouchableOpacity>
    );

    return(
        <View style={{flex: 1}}>
            {isLoading ? (
                <SplashScreen/>
            ):(
                <>
                {userChats.length > 0 ? (
                    <SafeAreaView style={{ flex: 1 }}>
                        <FlatList
                            data={userChats}
                            keyExtractor={(item) => item.chat_id}
                            renderItem={renderItem}
                            // refreshControl={
                            // <RefreshControl
                            //     refreshing={refreshing}
                            //     onRefresh={onRefresh}
                            // />
                            // }
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