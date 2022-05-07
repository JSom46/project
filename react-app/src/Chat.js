import React, { useState /*useEffect*/ } from 'react';
import io from 'socket.io-client';

import { Typography } from '@mui/material';
import { Divider } from '@mui/material';
import { Button, IconButton } from '@mui/material';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import { LinearProgress } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { Badge } from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Sidebar,
    Conversation,
    ConversationList,
    ConversationHeader,
} from "@chatscope/chat-ui-kit-react";

export default function Chat(props) {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState({ open: false });
    const [snackbarData, setSnackbarData] = useState({
        open: false,
        message: "",
        severity: "info",
        loading: true
    });

    const fileInput = React.useRef(null);

    const [header, setHeader] = useState(null);
    const [chatId, setChatId] = useState(-1);
    const [chatDeleteId, setChatDeleteId] = useState(-1);
    const [createNewChat, setCreateNewChat] = useState(parseInt(sessionStorage.getItem('anonsId')));

    const [userChats, setUserChats] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    const login = sessionStorage.getItem('login');

    React.useEffect(() => {
        if (socket === null) {
            const newSocket = io('http://localhost:2400');
            setSocket(newSocket);
            setSnackbarData({
                open: true,
                message: "Nawiązuje połączenie z serwerem...",
                severity: "info",
                loading: true
            });
        }
        else {
            if (!connected) {
                socket.on("connect", (event) => {
                    // console.log("con");
                    // console.log(socket.id);
                    setConnected(true);
                    setSnackbarData((prev) => ({
                        open: true,
                        message: "Połączono. Uwierzytelnianie...",
                        severity: "info",
                        loading: true
                    }));
                });
            }
            if (connected && !authenticated) {
                socket.on("auth-response", (status) => {
                    if (status === -1) window.location.href = "/login";
                    else {
                        setAuthenticated(true);
                        socket.emit('get-user-chats');
                        setSnackbarData((prev) => ({
                            open: true,
                            message: "Połączono i uwierzytelniono",
                            severity: "success",
                            loading: true
                        }));
                    }
                    // console.log("auth");
                });
                socket.emit('auth-request', login);
            }
            if (connected && authenticated) {
                if (createNewChat !== undefined && createNewChat !== null) {
                    sessionStorage.removeItem('anonsId');
                    socket.emit('new-chat', createNewChat);
                }
                socket.on("new-chat-response", (chat_id, message) => {
                    // console.log(chat_id);
                    // console.log(message);
                    if (message === 'Chat already exists' || 'Chat created') {
                        setChatId(chat_id);
                        setCreateNewChat(null);
                        socket.emit('get-user-chats');
                        socket.emit("get-chat-messages", chat_id);
                        socket.emit("join-chat", chat_id);
                    }
                    else {
                        setSnackbarData((prev) => ({
                            open: true,
                            message: "Nie udało się utworzyć czatu",
                            severity: "error",
                            loading: false
                        }));
                    }
                });
                socket.on("user-chats", (count, userChats) => {
                    console.log(userChats);
                    setUserChats(userChats);
                });
                socket.on("chat-messages", (count, chatMsg) => {
                    // console.log(chatMsg);
                    setChatMessages(chatMsg);
                });
                socket.on("chat-msg", (message_id, chat_id, username, datatime, message) => {
                    // console.log(message_id);
                    // console.log(chat_id);
                    // console.log(username);
                    // console.log(datatime);
                    // console.log(message);
                    var msg = {
                        message_id: message_id,
                        chat_id: chat_id,
                        image_id: null,
                        login: username,
                        message_date: datatime,
                        message_text: message
                    }
                    // console.log(msg);
                    if (chat_id === chatId) setChatMessages((prev) => [...prev, msg])
                });
                socket.on("chat-img", (image_id, chat_id, username, datetime, lastImage, img_name, img_type, data) => {
                    // console.log(image_id);
                    // console.log(chat_id);
                    // console.log(username);
                    // console.log(datetime);
                    // console.log(lastImage);
                    // console.log(img_name);
                    // console.log(img_type);
                    var msg = {
                        message_id: image_id,
                        chat_id: chat_id,
                        image_id: lastImage,
                        login: username,
                        message_date: datetime,
                        mimetype: img_type,
                        thumbnail: data
                    }
                    if (chat_id === chatId) setChatMessages((prev) => [...prev, msg])
                });
                socket.on("image", (image_id, img_name, img_type, img_data) => {
                    // console.log(image_id);
                    // console.log(img_name);
                    // console.log(img_type);
                    // console.log(img_data);
                    const blob = new Blob([img_data], { type: img_type })
                    const url = URL.createObjectURL(blob);
                    setOpenImageDialog({
                        open: true,
                        src: url
                    })
                });
                socket.on("chat-response", (status, message) => {
                    console.log(status);
                    console.log(message);
                });
                socket.on("join-chat-response", (anons_id, chat_id, message) => {
                });
                socket.on("delete-chat-response", (status, message) => {
                    if (status === 1) {
                        setSnackbarData({
                            open: true,
                            message: "Usunięto czat",
                            severity: "info",
                            loading: false
                        });
                        socket.emit('get-user-chats');
                    }
                });
                socket.on("disconnect", () => {
                    // console.log("dc");
                    setAuthenticated(false);
                    setConnected(false);
                });
            }
            return () => socket.off();
        }
    }, [socket, connected, authenticated, chatId, login, createNewChat]);
    const updateNewMsgs = (chat_id) => {
        let index = userChats.findIndex((item => item.chat_id == chat_id));
        let chats = userChats;
        if(chats[index].NewMsgs !== 0){
            chats[index].NewMsgs = 0;
            setUserChats(chats);
        }
    };
    const handleChatClick = (login, chat_id) => {
        // console.log(anons_id);
        // console.log(chat_id);
        if (socket !== null) {
            if (chatId !== -1) {
                socket.emit("leave-chat", chatId);
            }
            setHeader(login);
            setChatId(chat_id);
            socket.emit("get-chat-messages", chat_id);
            socket.emit("join-chat", chat_id);
            updateNewMsgs(chat_id);
        }
    }
    const handleSendMessage = (message) => {
        // console.log(anons_id);
        // console.log(chat_id);
        const regex1 = /<br\s*?><br\s*?>$/gi;
        const regex2 = /<br\s*?>/gi;
        const msg = decodeHTMLEntities(message.replace(regex1, "<br>").replace(regex2, "\n"));
        console.log(msg);
        if (socket !== null) {
            socket.emit("chat-msg", chatId, msg);
        }
    }
    const handleSendPicture = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function () {
            if (socket !== null) {
                socket.emit("chat-img", chatId, file.name, file.type, reader.result);
            }
        };
    }
    const handleChatDelete = () => {
        if (socket !== null) {
            socket.emit("leave-chat", chatId);
            socket.emit("delete-chat", chatDeleteId);
        }
    }
    function decodeHTMLEntities(text) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
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
                            <Conversation key={item.chat_id}
                                onClick={() => handleChatClick(item.login, item.chat_id)}
                                active={item.chat_id === chatId}
                                unreadCnt={item.NewMsgs}
                            >
                                {/* <Badge badgeContent={3} color="secondary"></Badge> */}
                                <Conversation.Content>
                                    <Typography variant="subtitle2">{item.login}</Typography>
                                    <Typography variant="caption">{item.title}</Typography>
                                </Conversation.Content>
                                <Conversation.Operations>
                                    <IconButton onClick={(e) => { e.stopPropagation(); setOpenDeleteDialog(true); setChatDeleteId(item.chat_id) }} >
                                        <ClearIcon />
                                    </IconButton>
                                </Conversation.Operations>
                            </Conversation>
                        ))}
                    </ConversationList>
                </Sidebar>
                <ChatContainer>
                    <ConversationHeader hidden={chatId === -1}>
                        {/* <ConversationHeader.Back /> */}
                        <ConversationHeader.Content userName={header} />
                    </ConversationHeader>
                    <MessageList>
                        {chatId !== -1 && chatMessages && chatMessages.map((item) => (
                            <Message key={item.message_id}
                                model={{
                                    type: (item.image_id === null ? "html" : "custom"),
                                    message: decodeHTMLEntities(item.message_text),
                                    sentTime: item.message_date.toString(),
                                    sender: item.login,
                                    direction: (login === item.login ? "outgoing" : "incoming")
                                }}>
                                {item.image_id !== null ?
                                    <Message.CustomContent>
                                        <img
                                            alt={item.image_id}
                                            src={URL.createObjectURL(new Blob([item.thumbnail], { type: item.mimetype }))}
                                            onClick={() => { setOpenImageDialog({ open: true, src: null }); socket.emit("get-image", item.image_id) }}
                                            style={{ borderRadius: "5%", cursor: "pointer" }}
                                        />
                                        {/* <Button
                                            onClick={() => { setOpenImageDialog({ open: true, src: null }); socket.emit("get-image", item.image_id) }}
                                            color="inherit"
                                            size="small"
                                            endIcon={<ImageIcon />}
                                        >
                                            ZDJĘCIE
                                        </Button> */}
                                    </Message.CustomContent> :
                                    <Message.CustomContent>
                                        {item.message_text}
                                    </Message.CustomContent>}
                                {/* <Message.Header>{item.login}</Message.Header> */}
                                <Message.Footer>{new Date(item.message_date).toLocaleString('pl-PL')}</Message.Footer>
                            </Message>
                        ))}
                    </MessageList>
                    <MessageInput disabled={chatId === -1} placeholder="Wpisz wiadomość tutaj..." onAttachClick={() => fileInput.current.click()} onSend={(message) => handleSendMessage(message)} />
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
                <LinearProgress hidden={openImageDialog.src !== null} />
                <img src={openImageDialog.src} alt={openImageDialog.src} />
            </Dialog>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbarData.open}
                onClose={() => setSnackbarData((prev) => ({ message: prev.message, open: false }))}
                autoHideDuration={(connected && authenticated) ? 5000 : null}
            >
                {/* <LinearProgress hidden={!snackbarData.loading} /> */}
                <Alert onClose={() => setSnackbarData((prev) => ({ message: prev.message, open: false }))} severity={snackbarData.severity} sx={{ width: '100%' }}>
                    {snackbarData.message}
                </Alert>
            </Snackbar>
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth>
                <DialogTitle>Czy na pewno chcesz usunąć ten czat?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Anuluj</Button>
                    <Button color='error' onClick={() => { handleChatDelete(); setOpenDeleteDialog(false) }}>Usuń</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}