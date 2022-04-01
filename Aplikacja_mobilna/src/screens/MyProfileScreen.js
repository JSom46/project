import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { stylesHome, stylesMyProfileContainer, stylesMyProfileButton } from '../components/styles';

const MyProfileScreen = ({navigation, route}) => {

    return(
        <View style={stylesMyProfileContainer}>
            <View style={{flex: 1, marginTop: 5}}>
                <Text style={{fontSize: 32, alignSelf: 'center'}}>
                    {route.params.userData.login}
                </Text>
                <Text style={{alignSelf: 'center'}}>
                    {route.params.userData.email}
                </Text>
            </View>

            <View style={{flex: 1}}>
                <View>
                    <TouchableOpacity style={stylesMyProfileButton}>
                        <Text style={{fontSize: 20, fontWeight: "600"}}>Zmień login</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity style={stylesMyProfileButton}>
                        <Text style={{fontSize: 20, fontWeight: "600"}}>Zmień hasło</Text>
                    </TouchableOpacity>
                </View>
            </View>

            

        </View>
    )
}

export default MyProfileScreen;