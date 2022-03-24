import React from "react";

import Register from "./src/screens/auth/Register";
import Login from "./src/screens/auth/Login";
import Welcome from "./src/screens/Welcome";

//React navigation stack
import RootStack from "./src/navigations/RootStack";

//global.serwer = "192.168.0.16:2400";
global.serwer = "192.168.31.47:2400";


export default function App() {
  console.log("App executed");
  return <RootStack />;
}
