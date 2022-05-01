import React, { useRef, useState } from "react";
import {
    SafeAreaView,
    View,
    FlatList,
    StyleSheet,
    Text,
    //StatusBar,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    RefreshControl,
    TextInput,
  } from "react-native";
import SplashScreen from "../screens/SplashScreen";
import { FontAwesome } from '@expo/vector-icons';
import { SocketContext } from "./SocketContext";
import { useFocusEffect } from '@react-navigation/native';
//import { SocketContext } from "./ChatStack";
import { stylesAnnouncements, chatListItem, chatMessageInput, chatListItemIncoming, chatListItemOutgoing, chatListItemOutgoingMessage, chatListItemIncomingMessage, chatListItemOutgoingContainer, chatListItemIncomingContainer } from "../components/styles";

const convertDate = (data) => {
  const newDate = new Date(data);
  return newDate.getDate() + "." + (newDate.getUTCMonth() + 1) + "." + newDate.getUTCFullYear() + " " + (newDate.getHours() + newDate.getTimezoneOffset()/60) + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
  //return newDate.toLocaleString("de-DE");
}

const ChatItem = ({message, user}) => (
    <View style={user.login == message.login ? (chatListItemOutgoingContainer) : (chatListItemIncomingContainer)}>
      <View style={user.login == message.login ? (chatListItemOutgoingMessage) : (chatListItemIncomingMessage)}>
        <Text>{message.message_text}</Text>
      </View>
      <Text style={{marginHorizontal: 5}}>{convertDate(message.message_date)}</Text>
    </View>
  );

const ChatView = ({ route, navigation }) => {
    const [userData, setUserData] = useState(route.params.userData);
    //const [socket, setSocket] = useState(React.useContext(SocketContext));
    const [chatMessages, setChatMessages] = useState([]);
    const {socket, setSocket} = React.useContext(SocketContext);
    const [message, setMessage] = useState("");
    const flatListRef = React.useRef();


    React.useEffect(() => {
        console.log("jestem w czacie");
        //console.log(socket);
        socket.emit("get-chat-messages", route.params.item.chat_id);
        socket.emit("join-chat", route.params.item.chat_id);
        console.log(chatMessages);

        socket.on("chat-messages", (count, chatMsg) => {
          console.log(chatMsg);
          setChatMessages(chatMsg);
        });
  
        socket.on("join-chat-response", (anons_id, chat_id, message) => {
          console.log("Dolaczyles do czatu");
        });
    
        socket.on("leave-chat-response", (anons_id, chat_id, message) => {
          console.log("Opusciles czat");
        });
    
        socket.on("chat-msg", (message_id, chat_id, username, datatime, message) => {
          const msg = {
              message_id: message_id,
              chat_id: chat_id,
              image_id: null,
              login: username,
              message_date: datatime,
              message_text: message
          }
          // console.log(msg);
          if (chat_id === route.params.item.chat_id) setChatMessages((prev) => [...prev, msg])
        });

    },[socket]);

    useFocusEffect(
      React.useCallback(() => {
          socket.emit("get-chat-messages", route.params.item.chat_id);

          return () => {
            socket.emit("leave-chat", route.params.item.chat_id);
            // socket.off("chat-messages", (count, chatMsg) => {});
            // socket.off("join-chat-response", (anons_id, chat_id, message) => {});
            // socket.off("leave-chat-response", (anons_id, chat_id, message) => {});
            // socket.off("chat-msg", (message_id, chat_id, username, datatime, message) => {});
            socket.removeAllListeners();
          }
      }, [])
  );

    const renderItem = ({ item }) => (
        // <TouchableOpacity
        //   onPress={() => alert("wiadomosc")}
        // >
        
          <ChatItem
            message={item}
            user={route.params.userData}
          />
        // </TouchableOpacity>
    );

    const handleMessageSend = () => {
      //alert(message);
      if (socket !== null) {
        socket.emit("chat-msg", route.params.item.chat_id, message);
    }
      setMessage("");
    }

    

    return(
        //<SplashScreen/>
        //<Text>{route.params.item.chat_id}</Text>
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={chatMessages}
                keyExtractor={(item) => item.message_id}
                renderItem={renderItem}
                ref={flatListRef}
                onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"space-evenly", backgroundColor: "white"}}>
              <TextInput style={chatMessageInput}
                value={message}
                onChangeText={setMessage}
                multiline={true}
                numberOfLines={2}
                placeholder="Wpisz wiadomość tutaj..."
              />
              <TouchableOpacity onPress={handleMessageSend} disabled={!message}>
                <FontAwesome name="send" size={28} color={message ? ("#6ea9d7") : ("lightgray")} style={{marginRight: 20}}/>
              </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    );
};

export default ChatView;