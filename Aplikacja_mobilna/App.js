import React from "react";

//React navigation stack
import RootStack from "./src/navigations/RootStack";

// Context dla filtrow
import { FilterProvider } from "./src/components/Map/FilterContext";
import { UserLocationProvider } from "./src/components/Context/UserLocationContext";
global.serwer = "192.168.0.16:2400";
//global.serwerIP = "192.168.0.16";

//global.serwer = "192.168.31.47:2400";
//global.serwerIP = "192.168.31.47";

global.guestData = {
  user_id: "guestId",
  email: "guest@email",
  login: "guest",
  is_admin: 0,
};

export default function App() {
  return (
    <UserLocationProvider>
      <FilterProvider>
        <RootStack />
      </FilterProvider>
    </UserLocationProvider>
  );
}
