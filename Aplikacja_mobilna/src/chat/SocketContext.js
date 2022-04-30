import React from "react";
import { io } from "socket.io-client";

export const socket = null;//io("http://" + "192.168.31.47" + ":2300");
export const SocketContext = React.createContext();
// const SocketContext = React.createContext({
//     socket: null,
//     setContextSocket: (newSocket) => {}
// });

//export default SocketContext;

// export const SocketContextData = {
//     socket: socket = null,
//     setSocket: (newSocket) => {
//         socket = newSocket;
//     },
// }