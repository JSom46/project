import React from "react";

//React navigation stack
import RootStack from "./src/navigations/RootStack";

// Context dla filtrow
import { FilterProvider } from "./src/components/Map/FilterContext";

//global.serwer = "192.168.0.16:2400";
global.serwer = "192.168.31.47:2400";
global.guestData = {
  user_id: "guestId",
  email: "guest@email",
  login: "guest",
  is_admin: 0,
};

export default function App() {
  console.log("App executed");
  return (
    <FilterProvider>
      <RootStack />
    </FilterProvider>
  );
}
