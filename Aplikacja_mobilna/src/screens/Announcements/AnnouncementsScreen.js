import React ,{useState}from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import {stylesHome, stylesAnnouncements} from '../../components/styles';
import AnnouncementsList from './AnnouncementsList';
import AnnouncementView from '../AnnouncementView';
import AddAnnouncement from '../Map/AddAnnouncement';


const AnnouncementsStack = createNativeStackNavigator();

const AnnouncementsScreen = ({ route, navigation }) => {
  const [userData, setUserData] = useState(route.params.userData);

    return(
      //<NavigationContainer>
        <AnnouncementsStack.Navigator screenOptions={{headerShown: false}}>
          <AnnouncementsStack.Screen name="Lista" component={AnnouncementsList} initialParams={{userData: userData}}/>
          <AnnouncementsStack.Screen name="Ogloszenie" component={AnnouncementView}/>
          <AnnouncementsStack.Screen name="Dodaj Ogloszenie" component={AddAnnouncement}/>
        </AnnouncementsStack.Navigator>
      //</NavigationContainer>
    );
}

export default AnnouncementsScreen;