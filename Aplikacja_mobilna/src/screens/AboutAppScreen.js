import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import SplashScreen from "../screens/SplashScreen";
import { Logo } from "../components/styles";

const AboutAppScreen = ({ route, navigation }) => {

    return(
        <View style={{flex: 1}}>
            <Text style={{fontSize: 32, textAlign: 'center', marginVertical: 5, fontWeight: 'bold'}}>ZwierzoZnajdźca</Text>
            <View style={{padding: 15}}>
                <Image 
                    style={{
                        width: 250, 
                        height: 250, 
                        alignSelf: 'center', 
                        marginBottom: 20,
                    }} 
                    source={require('../../assets/logo_transparent.png')}
                />
                <Text style={{fontSize: 16, textAlign: 'justify'}}>
                Aplikacja mająca na celu ułatwienie znajdowania zagubionych zwierząt. 
                Użytkownicy mogą dodawać ogłoszenia o zaginięciu zwierząt, wraz z informacjami o zwierzęciu, zdjęciami i informacją o miejscu w którym ostatnio mieli kontakt z pupilem.
                {"\n"}
                Inni użytkownicy mogą odpowiadać na takie ogłoszenia, zamieszczając zdjęcia i lokację w któryj widzieli zwierzę.
                Istnieje tez opcja dodania ogłoszeń o znalezieniu zwierzęcia, które wygląda na zaginione.
                </Text>
                {/* <Text style={{fontSize: 32, textAlign: 'center', marginVertical: 5}}>FAQ</Text>
                <Text style={{fontSize: 16, textAlign: 'justify'}}>
                    1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.{"\n"}
                    2. Praesent enim felis, malesuada at molestie eu, congue euismod elit.{"\n"}
                    3. Curabitur dictum iaculis viverra.{"\n"}
                    4. Ut mattis, tortor a aliquet tincidunt, diam purus rutrum mi, sit amet vehicula leo lorem id odio.{"\n"}
                    5. Quisque faucibus risus nibh, quis maximus turpis sollicitudin at.{"\n"}
                    6. Quisque sodales pharetra turpis nec gravida. In hac habitasse platea dictumst.{"\n"}
                </Text> */}
            </View>
        </View>
    );
};

export default AboutAppScreen;