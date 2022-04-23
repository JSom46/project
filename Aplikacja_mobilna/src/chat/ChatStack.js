import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatList from "./ChatsList";
import ChatView from "./ChatView";

const ChatStack = createNativeStackNavigator();

const ChatStackScreen = ({ route, navigation }) => {
    const [userData, setUserData] = useState(route.params.userData);

    return(
        <ChatStack.Navigator screenOptions={{ headerShown: false }}>
            <ChatStack.Screen
                name="Lista rozmów"
                component={ChatList}
                initialParams={{ userData: userData }}
            />
            <ChatStack.Screen
                name="Rozmowa"
                component={ChatView}
                initialParams={{ userData: userData }}
            />
        </ChatStack.Navigator>
    );
};

export default ChatStackScreen;