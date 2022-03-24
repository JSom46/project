import React ,{useState}from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import {stylesHome, stylesAnnouncements} from '../../components/styles';
import AnnouncementsList from './AnnouncementsList';
import AnnouncementView from '../AnnouncementView';


const AnnouncementsStack = createNativeStackNavigator();

const AnnouncementsScreen = ({ route, navigation }) => {

    return(
      //<NavigationContainer>
        <AnnouncementsStack.Navigator screenOptions={{headerShown: false}}>
          <AnnouncementsStack.Screen name="Lista" component={AnnouncementsList} />
          <AnnouncementsStack.Screen name="Ogloszenie" component={AnnouncementView}/>
        </AnnouncementsStack.Navigator>
      //</NavigationContainer>
    );
}

export default AnnouncementsScreen;