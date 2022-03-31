import React from 'react';
import { View, Text} from 'react-native';
import { stylesHome } from '../components/styles';

const MyProfileScreen = ({navigation, route}) => {

    return(
        
        <View style={stylesHome.dashboard}>
            
            <Text style={{fontSize: 32}}>
                Profil użytkownika:{"\n"}
                {route.params.userData.login}
            </Text>
            <Text>
                Email: {route.params.userData.email}
            </Text>

        </View>
    )
}

export default MyProfileScreen;