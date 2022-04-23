import React from 'react';
import { View, Text, ActivityIndicator} from 'react-native';

//dolozyc tu logo

const SplashScreen = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{marginBottom: 10}}>Trwa ładowanie...</Text>
          <ActivityIndicator size="large" color="#1e90ff"/>
        </View>
      );
}

export default SplashScreen;