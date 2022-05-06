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
    Modal,
  } from "react-native";
import SplashScreen from "../screens/SplashScreen";
import { FontAwesome } from '@expo/vector-icons';
import { SocketContext } from "./SocketContext";
import { useFocusEffect } from '@react-navigation/native';
//import { SocketContext } from "./ChatStack";
import { userDataContext } from "../screens/UserDataContext";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";
import { stylesAnnouncements,
         chatListItem, 
         chatMessageInput, 
         chatListItemIncoming, 
         chatListItemOutgoing, 
         chatListItemOutgoingMessage, 
         chatListItemIncomingMessage, 
         chatListItemOutgoingContainer, 
         chatListItemIncomingContainer,
         modalBackground,
         photoModal,
} from "../components/styles";

const convertDate = (data) => {
  const newDate = new Date(data);
  return newDate.getDate() + "." + (newDate.getUTCMonth() + 1) + "." + newDate.getUTCFullYear() + " " + (newDate.getHours() /*+ newDate.getTimezoneOffset()/60*/) + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
  //return newDate.toLocaleString("de-DE");
}


//
const ChatView = ({ route, navigation }) => {
    //const [userData, setUserData] = useState(route.params.userData);
    const {userData, setUserData} = React.useContext(userDataContext);
    //const [socket, setSocket] = useState(React.useContext(SocketContext));
    const [chatMessages, setChatMessages] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const {socket, setSocket} = React.useContext(SocketContext);
    const [message, setMessage] = useState("");
    const [modalImage, setModalImage] = useState();
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

        socket.on("chat-img", (image_id, chat_id, username, datetime, lastImage, img_name, img_type, data) => {
          // console.log(image_id);
          // console.log(chat_id);
          // console.log(username);
          // console.log(datetime);
          // console.log(lastImage);
          // console.log(img_name);
          // console.log(img_type);
          var msg = {
              message_id: image_id,
              chat_id: chat_id,
              image_id: lastImage,
              login: username,
              message_date: datetime,
              mimetype: img_type,
              thumbnail: data
          }
          if (chat_id === route.params.item.chat_id) setChatMessages((prev) => [...prev, msg])
        });

        socket.on("image", (image_id, img_name, img_type, img_data) => {
          // console.log(image_id);
          // console.log(img_name);
          // console.log(img_type);
          // console.log(img_data);
          setModalImage(parseImage(img_data));
          setModalVisible(true);
        });

    },[socket]);

    useFocusEffect(
      React.useCallback(() => {
          socket.emit("get-chat-messages", route.params.item.chat_id);

          return () => {
            socket.emit("leave-chat", route.params.item.chat_id);
            socket.removeAllListeners("chat-messages");
            socket.removeAllListeners("join-chat-response");
            socket.removeAllListeners("leave-chat-response");
            socket.removeAllListeners("chat-msg");
            socket.removeAllListeners("image");
            socket.removeAllListeners("chat-img");
            //socket.removeAllListeners();
          }
      }, [])
  );

    const renderItem = ({ item }) => (
        // <TouchableOpacity
        //   onPress={() => alert("wiadomosc")}
        // >
        
          <ChatItem
            message={item}
            user={userData}
          />
        // </TouchableOpacity>
    );

    const ChatItem = ({message, user}) => (
      <View style={user.login == message.login ? (chatListItemOutgoingContainer) : (chatListItemIncomingContainer)}>
        <View style={user.login == message.login ? (chatListItemOutgoingMessage) : (chatListItemIncomingMessage)}>
          
          {message.image_id === null ? (
            <Text>{message.message_text}</Text>
          ):(
            <TouchableOpacity onPress={()=>socket.emit("get-image", message.image_id)}>
              <Image style={{width: 85, height: 85}} source={{uri: parseImage(message.thumbnail)}}/>
            </TouchableOpacity>  
          )}
        </View>
        <Text style={{marginHorizontal: 5}}>{convertDate(message.message_date)}</Text>
      </View>
    );

    const handleMessageSend = () => {
      //alert(message);
      if (socket !== null) {
        socket.emit("chat-msg", route.params.item.chat_id, message);
    }
      setMessage("");
    }

    const openImagePickerAsync = async () => {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (permissionResult.granted === false) {
        alert("Wymagana jest zgoda na korzystanie z aparatu!");
        return;
      }
  
      let pickerResult = await ImagePicker.launchImageLibraryAsync({base64: true});
      //console.log(pickerResult);
      if (!pickerResult.cancelled) {
        //let imageByte = new Buffer(pickerResult.base64, "base64");
        let imageByte = Buffer(pickerResult.base64, "base64");
        handleImageSend(pickerResult.fileName, pickerResult.type, imageByte);

        //console.log("W open image picker");
        //console.log(pickerResult.uri);
        //console.log(imageByte);
      }
    };

    const handleImageSend = (fileName, type, imageData) => {
      if (socket !== null) {
        socket.emit("chat-img", route.params.item.chat_id, fileName, type, imageData);
      }
      setMessage("");
    }

    const parseImage = (image) => {
      let base64data;
      base64data = Buffer.from(image, 'binary').toString('base64');
      return "data:image/png;base64," + base64data;
    }

    return(
        //<SplashScreen/>
        //<Text>{route.params.item.chat_id}</Text>
        <SafeAreaView style={{ flex: 1 }}>
            <Modal visible={isModalVisible} transparent={true} onRequestClose={() => {setModalVisible(!isModalVisible)}}>
              <View style={modalBackground}>
                <View  style={photoModal}>
                  <TouchableOpacity onPress={()=>setModalVisible(false)} style={{alignSelf: 'flex-end',}}>
                    <Ionicons name="close" size={32} color="white"  />
                  </TouchableOpacity>
                  <Image style={{width: 320, height: 320}} source={{uri: modalImage}}/>
                </View>
              </View>
            </Modal>
            <FlatList
                data={chatMessages}
                keyExtractor={(item) => item.message_id}
                renderItem={renderItem}
                initialNumToRender={20}
                ref={flatListRef}
                onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"space-evenly", backgroundColor: "white"}}>
              <TouchableOpacity onPress={openImagePickerAsync}>
                <FontAwesome5 name="paperclip" size={28} color="#6ea9d7" style={{marginLeft: 10}}/>
              </TouchableOpacity>
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