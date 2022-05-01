import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { io } from "socket.io-client";
import ChatList from "./ChatsList";
import ChatView from "./ChatView";
import { SocketContext } from "./SocketContext";
import { userDataContext } from "../screens/UserDataContext";

const ChatStack = createNativeStackNavigator();
//const socket = null;//io("http://" + "192.168.31.47" + ":2300");
//export const SocketContext = React.createContext();

const ChatStackScreen = ({ route, navigation }) => {
    //const [userData, setUserData] = useState(route.params.userData);
    const {userData, setUserData} = React.useContext(userDataContext);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const socketContextData = {socket: socket, setSocket: setSocket};

    return(
        <SocketContext.Provider value={socketContextData}>
            <ChatStack.Navigator screenOptions={{ headerShown: false }}>
                <ChatStack.Screen
                    name="Lista rozmów"
                    component={ChatList}
                    //initialParams={{ userData: userData}}
                />
                <ChatStack.Screen
                    name="Rozmowa"
                    component={ChatView}
                    //initialParams={{ userData: userData }}
                />
            </ChatStack.Navigator>
        </SocketContext.Provider>
    );
};

export default ChatStackScreen;