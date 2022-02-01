/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';

import AuthScreenLog from './AuthScreenLog';
import AuthScreenSign from './AuthScreenSign';
import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';

const Stack = createNativeStackNavigator();
export const AuthContext = React.createContext();



const App = () => {

  //const [userToken, setUserToken] = useState(null);
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'LOG_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'LOG_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

    const authContextData = React.useMemo(() => ({
      logIn: async (data) => {

          //zapytanie do serwera

        dispatch({type: 'LOG_IN', token: 'dummy-token'});
      },

      logOut: () => dispatch({type: 'LOG_OUT'}),

      signUp: async (data) => {

          //zapytanie do serwera

        dispatch({type: 'LOG_IN', token: 'dummy-token'});
      },
    }),
    []
    )

    React.useEffect(() => {
      // Fetch the token from storage then navigate to our appropriate place
      const bootstrapAsync = async () => {
        let userToken;
  
        try {
          // Restore token stored in `SecureStore` or any other encrypted storage
          // userToken = await SecureStore.getItemAsync('userToken');
        } catch (e) {
          // Restoring token failed
        }
  
        // After restoring token, we may need to validate it in production apps
  
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      };
  
      bootstrapAsync();
    }, []);

    return(
      <AuthContext.Provider value={authContextData}>
        <StatusBar barStyle='dark-content' backgroundColor={'white'}/>
        <NavigationContainer>
          <Stack.Navigator>
            {state.isLoading ? (
              <Stack.Screen
              name='Ładowanie'
              component={SplashScreen}
              />
            ) : state.userToken ? (
              <Stack.Screen
              name='Strona domowa'
              component={HomeScreen}
              />
            ) : (
              <>
              <Stack.Screen
              name='Logowanie'
              component={AuthScreenLog}
              options={{
                title: 'Zaloguj się w X',
                headerShown: false,
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
              />

              <Stack.Screen
              name='Rejestracja'
              component={AuthScreenSign}
              options={{title: 'Zarejestruj się w X'}}
              />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    )
}

export default App;
