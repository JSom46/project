import React, { useState, createContext } from "react";

const UserLocationContext = createContext();

export const UserLocationProvider = (props) => {
  const [userLocation, setUserLocation] = useState({
    latitude: "",
    longitude: "",
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <UserLocationContext.Provider value={[userLocation, setUserLocation]}>
      {props.children}
    </UserLocationContext.Provider>
  );
};

export default UserLocationContext;
