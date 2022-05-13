import React from 'react';
import { View, Text, ActivityIndicator, Image} from 'react-native';

const SplashScreen = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: 250, height: 250, alignSelf: 'center', marginBottom: 20,}} source={require('../../assets/logo_transparent.png')}/>
          <Text style={{marginBottom: 10}}>Trwa ładowanie...</Text>
          <ActivityIndicator size="large" color="#1e90ff"/>
        </View>
      );
}

export default SplashScreen;