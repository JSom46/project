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
import {Button, StatusBar} from 'react-native';

import AuthScreenLog from './AuthScreenLog';
import AuthScreenSign from './AuthScreenSign';
import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';
import AuthScreenActivate from './AuthScreenActivate';


const Stack = createNativeStackNavigator();
export const AuthContext = React.createContext();

/*Ta zmienna musi byc ustawiona na adres pod ktorym dziala komputer*/
const adresSerwera = 'localhost';


const App = () => {

  //const [userToken, setUserToken] = useState(null);

  // w state przechowujemy informacje o tym czy uzytkownik jest zalogowany i jego token
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

    /*AuthContext do wszystkich Screenow bedzie przekazywal te funkcje
    dzieki temu nie musimy przerzucac danych uzytkownika pomiedzy komponentami
    Uzywamy React.useMemo zeby nie wysylac requestow do serwera kilka razy*/
    const authContextData = React.useMemo(() => ({
      logIn: async (credentials) => {
        let response = await fetch('http://'+ adresSerwera +':2400/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(credentials)
        }).then(data => data.json())

        alert(response.msg);
        console.log(response.msg);

        if(response.msg === 'ok'){
          dispatch({type: 'LOG_IN', token: 'dummy-token'});
        }
        
      },

      logOut: () => {
          let response = fetch('http://'+ adresSerwera +':2400/auth/logout', {
            credentials: 'include',
            method: 'GET',
          }).then(data => data.json())

          alert(response.msg);

        dispatch({type: 'LOG_OUT'});
      },

      activate: async (credentials) => {
        let response = await fetch('http://'+ adresSerwera +':2400/auth/activate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify(credentials)
        }).then(data => data.json())

        alert(response.msg);

        if(response.msg === 'account activated'){
          return true;
        }
      },

      signUp: async (credentials) => {
          console.log(credentials);
          //alert(credentials);

          let response = await fetch('http://'+ adresSerwera +':2400/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
          })
          .then(data => data.json())

          alert(response.msg);

          if(response.msg === 'account created'){
            return true;
          }

          //navigation.navigate('Aktywacja');
        //dispatch({type: 'LOG_IN', token: 'dummy-token'});
      },
    }),
    []
    )

    /*To bedzie trzeba troche przerobic zeby faktycznie korzystalo z tokena przechowywanego w bezpiecznym miejscu np. SecureStore */
    React.useEffect(() => {
      // Fetch the token from storage then navigate to our appropriate place
      const bootstrapAsync = async () => {
        let userToken;
  
        const fetchData = async () => {
          try {
            const response = await fetch('http://'+ adresSerwera +':2400/auth/loggedin', {
            method: 'GET',
            credentials: 'include'
          });
          const json = await response.json();
          // console.log(json);
          //setAuth(json);
          userToken = json;
          dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        } catch (error) {
          console.log("error", error);
        }
      }

        fetchData();

        // to wg. oficjalnego poradnika (https://reactnavigation.org/docs/auth-flow/), prawdopodobnie cos takiego bedziemy docelowo chcieli
      /*
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
        */
      };
  
      bootstrapAsync();
    }, []);

    /*
    AuthContext przekazuje funkcje z authContextData do wszytskich komponentow w NavigationContainer
    W Stack.Navigator warunkowo ładujemy komponenty
      if(isLoading) wczytujemy sam SplashScreen
      elseif(state.userToken) //jesli jest token// wczytujemy cale drzewo komponentow ktore sa widoczne po zalogowaniu
      else() //nie ma tokena// wczytujemy logowanie i rejestrowanie

      Dzieki warunkowemu wczytywaniu mamy gwarancje ze nie da sie przejsc z komponentow dostepnych po zalogowaniu do komponentow logowania
      Nie musimy sie tez przejmowac tym co dzieje sie z danymi logowania - po wczytaniu innego drzewa komponentow, tamte sa odmontowywane
    */
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
                title: 'Zaloguj się',
                headerShown: false,
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
              />

              <Stack.Screen
              name='Rejestracja'
              component={AuthScreenSign}
              options={{title: 'Zarejestruj się'}}
              />

              <Stack.Screen
              name='Aktywacja'
              component={AuthScreenActivate}
              options={{title: 'Aktywuj konto'}}
              />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    )
}

// function errorMessage(code) {
//   //var element = document.getElementById("registerMessage");
//   //element.style.color = "red";
//   switch(code){
//       case "PASSWORDS_NOT_THE_SAME":
//       alert("Hasła nie są takie same");
//       break;
//       case "SUCCESS":
//       //element.style.color = "green";
//       alert("Pomyślnie założono konto\n");
//       break;
//       default:
//       alert(code);
//   }
// }

export default App;
