import React, { useState } from "react";
import SplashScreen from "../screens/SplashScreen";

const ChatView = ({ route, navigation }) => {
    const [userData, setUserData] = useState(route.params.userData);

    return(
        <SplashScreen/>
    );
};

export default ChatView;