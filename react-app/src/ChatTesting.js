import React, { useState /*useEffect*/ } from 'react';
import io from 'socket.io-client';

import { Typography } from '@mui/material';
import { Divider } from '@mui/material';
import { Button } from '@mui/material';
import { Dialog } from '@mui/material';
import { LinearProgress } from '@mui/material';

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Sidebar,
    Conversation,
    ConversationList,
    InputToolbox,
    AttachmentButton,
    SendButton
} from "@chatscope/chat-ui-kit-react";

export default function ChatTesting(props) {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState({ open: false });

    const fileInput = React.useRef(null);

    const [anonsId, setAnonsId] = useState(-1);
    const [chatId, setChatId] = useState(-1);

    const [userChats, setUserChats] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    const login = sessionStorage.getItem('login');

    React.useEffect(() => {
        if (socket === null) {
            const newSocket = io("http://localhost:2300");
            setSocket(newSocket);
        }
        else {
            if (!connected) {
                socket.on("connect", (event) => {
                    // console.log(socket.id);
                    setConnected(true);
                })
            }
            if (connected && !authenticated) {
                socket.on("auth-response", (event) => {
                    setAuthenticated(true);
                    socket.emit('get-user-chats');
                    // console.log(event);
                })
                socket.emit('auth-request', login);
            }
            if (connected && authenticated) {
                if (props.id !== undefined) {
                    socket.emit('new-chat', props.id);
                }
                socket.on("new-chat-response", (anons_id, chat_id, message) => {
                    console.log(anons_id);
                    console.log(chat_id);
                    console.log(message);
                    if (anons_id === -1) {
                    }
                    else {
                        socket.emit('get-user-chats');
                        handleChatClick(anons_id, chat_id);
                    }
                })
                socket.on("user-chats", (count, userChats) => {
                    setUserChats(userChats);
                })
                socket.on("chat-messages", (count, chatMsg) => {
                    // console.log(chatMsg);
                    setChatMessages(chatMsg);
                })
                socket.on("chat-msg", (message_id, anons_id, chat_id, username, datatime, message) => {
                    var msg = {
                        message_id: message_id,
                        anons_id: anons_id,
                        chat_id: chat_id,
                        image_id: null,
                        username: username,
                        message_date: datatime,
                        message_text: message
                    }
                    console.log(msg);
                    if (anons_id === anonsId && chat_id === chatId) setChatMessages((prev) => [...prev, msg])
                })
                socket.on("chat-img", (image_id, anons_id, chat_id, username, datetime, img_name, img_type, img_data) => {
                    console.log(image_id);
                    console.log(anons_id);
                    console.log(chat_id);
                    console.log(username);
                    console.log(datetime);
                    console.log(img_name);
                    console.log(img_type);
                    console.log(img_data);
                })
                socket.on("image", (image_id, img_name, img_type, img_data) => {
                    // console.log(image_id);
                    // console.log(img_name);
                    // console.log(img_type);
                    // console.log(img_data);
                    const blob = new Blob([img_data], {type: img_type})
                    const url = URL.createObjectURL(blob);
                    setOpenImageDialog({
                        open: true,
                        src: url
                    })
                })
                socket.on("chat-response", (status, message) => {
                    console.log(status);
                    console.log(message);
                })
                socket.on("join-chat-response", (anons_id, chat_id, message) => {
                })
            }
            return () => socket.off();
        }
    }, [socket, connected, authenticated, anonsId, chatId, login, props.id, handleChatClick]);
    const handleChatClick = (anons_id, chat_id) => {
        // console.log(anons_id);
        // console.log(chat_id);
        setAnonsId(anons_id);
        setChatId(chat_id);
        if (socket !== null) {
            socket.emit("get-chat-messages", anons_id, chat_id);
            socket.emit("join-chat", anons_id, chat_id);
        }
    }
    const handleSendMessage = (message) => {
        // console.log(anons_id);
        // console.log(chat_id);
        if (socket !== null) {
            socket.emit("chat-msg", anonsId, chatId, message);
        }
    }
    const handleSendPicture = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function () {
            if (socket !== null) {
                socket.emit("chat-img", anonsId, chatId, file.name, file.type, reader.result);
            }
        };
    }
    return (
        <div style={{
            height: "90vh",
            position: "relative"
        }}>
            <MainContainer responsive>
                <Sidebar position="left" scrollable={false}>
                    <Typography align='center' m={2} variant='h5'>Czat</Typography>
                    <Divider />
                    <ConversationList>
                        {userChats && userChats.map((item) => (
                            <Conversation key={item.chat_id + Math.floor(Math.random() * (1000))} onClick={() => handleChatClick(item.anons_id, item.chat_id)} active={item.anons_id === anonsId && item.chat_id === chatId}>
                                <Conversation.Content>
                                    <Typography variant="subtitle2">{"Chat z ogłoszenia o id " + item.anons_id}</Typography>
                                    {item.NewMsgs !== 0 ?
                                        <Typography variant="caption">{"Nowe wiadomości: " + item.NewMsgs}</Typography>
                                        :
                                        <Typography variant="caption">{"Wszystkich wiadomości: " + item.AllMsgs}</Typography>
                                    }
                                </Conversation.Content>
                            </Conversation>
                        ))}
                    </ConversationList>
                </Sidebar>
                <ChatContainer>
                    <MessageList>
                        {chatMessages && chatMessages.map((item) => (
                            <Message key={item.message_id}
                                model={{
                                    type: (item.image_id === null ? "html" : "custom"),
                                    message: item.message_text,
                                    sentTime: item.message_date.toString(),
                                    sender: item.username,
                                    direction: (login === item.username ? "outgoing" : "incoming")
                                }}>
                                {item.image_id !== null ?
                                    <Message.CustomContent>
                                        <Button
                                            onClick={() => { setOpenImageDialog({ open: true, src: null }); socket.emit("get-image", item.image_id) }}
                                            color="inherit"
                                            fullWidth
                                        >
                                            image
                                        </Button>
                                    </Message.CustomContent> : null}
                                <Message.Header>{item.username}</Message.Header>
                                <Message.Footer>{new Date(item.message_date).toLocaleString('pl-PL')}</Message.Footer>
                            </Message>
                        ))}
                    </MessageList>
                    <MessageInput disabled={anonsId === -1 || chatId === -1} placeholder="Wpisz wiadomość tutaj..." onAttachClick={() => fileInput.current.click()} onSend={(message) => handleSendMessage(message)} />
                </ChatContainer>
            </MainContainer>
            <input
                type="file"
                ref={fileInput}
                accept="image/*"
                onChange={handleSendPicture}
                hidden
            />
            <Dialog open={openImageDialog.open} onClose={() => (setOpenImageDialog((prev) => ({ open: false, src: prev.src })))} fullWidth>
                <LinearProgress hidden={openImageDialog.src !== null}/>
                <img src={openImageDialog.src} />
            </Dialog>
        </div>
    )
}