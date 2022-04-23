import React, { useState } from "react";
import { View, Text } from "react-native";
import SplashScreen from "../screens/SplashScreen";

const AboutAppScreen = ({ route, navigation }) => {

    return(
        <View style={{flex: 1}}>
            <Text style={{fontSize: 32, textAlign: 'center', marginVertical: 5}}>Nazwa aplikacji</Text>
            <View style={{padding: 15}}>
                <Text style={{fontSize: 16, textAlign: 'justify'}}>
                    Opis aplikacji{"\n"}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Praesent enim felis, malesuada at molestie eu, congue euismod elit.
                    Curabitur dictum iaculis viverra.
                    Ut mattis, tortor a aliquet tincidunt, diam purus rutrum mi, sit amet vehicula leo lorem id odio.
                    Quisque faucibus risus nibh, quis maximus turpis sollicitudin at.
                    Quisque sodales pharetra turpis nec gravida. In hac habitasse platea dictumst.
                </Text>
                <Text style={{fontSize: 32, textAlign: 'center', marginVertical: 5}}>FAQ</Text>
                <Text style={{fontSize: 16, textAlign: 'justify'}}>
                    1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.{"\n"}
                    2. Praesent enim felis, malesuada at molestie eu, congue euismod elit.{"\n"}
                    3. Curabitur dictum iaculis viverra.{"\n"}
                    4. Ut mattis, tortor a aliquet tincidunt, diam purus rutrum mi, sit amet vehicula leo lorem id odio.{"\n"}
                    5. Quisque faucibus risus nibh, quis maximus turpis sollicitudin at.{"\n"}
                    6. Quisque sodales pharetra turpis nec gravida. In hac habitasse platea dictumst.{"\n"}
                </Text>
            </View>
        </View>
    );
};

export default AboutAppScreen;