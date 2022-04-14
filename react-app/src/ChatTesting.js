import React, { useState /*useEffect*/ } from 'react';
import io from 'socket.io-client';

export default function ChatTesting(props) {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    
    const userChatsListener = (userChats) => {
        console.log(userChats);
    };

    React.useEffect(() => {
        const newSocket = io("http://localhost:2300");
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log(newSocket.id);
            setConnected(true);
        });
        newSocket.on("user-chats", (event) => {
            console.log(event);
        })
        newSocket.on("auth-response", (event) => {
            console.log(event);
        })
        newSocket.on("error", (event) => {
            console.log(event);
        })
        newSocket.on('error', (event) => {
            console.log(event);
        })
        newSocket.emit('auth-request', sessionStorage.getItem('login'));
    }, []);
    return (
        <div>

        </div>
    )
}