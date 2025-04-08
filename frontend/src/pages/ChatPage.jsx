import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../slices/channelsSlice.js';
import { fetchMessages, addMessage } from '../slices/messagesSlice.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { io } from 'socket.io-client';
import MessageForm from '../components/MessageForm.jsx';


const ChatPage = () => {
  const { logOut, user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const channels = useSelector((state) => state.channels.entities);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const channelsLoadingStatus = useSelector((state) => state.channels.loadingStatus);
  const channelsError = useSelector((state) => state.channels.error);
  const messages = useSelector((state) => state.messages.entities);
  const messagesLoadingStatus = useSelector((state) => state.messages.loadingStatus);
  const messagesError = useSelector((state) => state.messages.error);

  const socketRef = useRef(null);
  const messagesBoxRef = useRef(null);

  
  useEffect(() => {
    if (channelsLoadingStatus === 'idle') {
      dispatch(fetchChannels());
    }
    if (messagesLoadingStatus === 'idle') {
      dispatch(fetchMessages());
    }
  }, [dispatch, channelsLoadingStatus, messagesLoadingStatus]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io();

      socketRef.current.on('newMessage', (messagePayload) => {
        console.log('New message received:', messagePayload);
        dispatch(addMessage(messagePayload));
      });
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current.id);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

       socketRef.current.on('connect_error', (err) => {
         console.error("Socket connection error:", err);
       });
    }

    return () => {
      if (socketRef.current && socketRef.current.connected) {
        console.log('Disconnecting socket...');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLogout = () => {
    logOut();
  };

  const handleChannelSelect = (id) => {
    dispatch(setCurrentChannel(id));
  };

  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId);

  return (
    <Container fluid className="h-100">
      <Row className="h-100 bg-light">
        <Col xs={4} md={3} lg={2} className="border-end px-0 bg-white d-flex flex-column h-100">
          <div className="d-flex justify-content-between mb-2 ps-4 pt-3 pe-2">
            <b>Каналы</b>
            <Button variant="outline-primary" size="sm">+</Button>
          </div>

          {channelsLoadingStatus === 'loading' && <Spinner animation="border" className="mx-auto" />}
          {channelsError && <Alert variant="danger" className="m-2">Ошибка загрузки каналов: {channelsError}</Alert>}

          <Nav
            fill
            variant="pills"
            className="flex-column px-2 overflow-auto"
            activeKey={currentChannelId}
            onSelect={handleChannelSelect}
          >
            {channels.map((channel) => (
              <Nav.Item key={channel.id}>
                <Nav.Link eventKey={channel.id} className="w-100 rounded-0 text-start">
                  # {channel.name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
           <div className="mt-auto p-2">
             {user && <span className="me-2">Вы вошли как: {user.username}</span>}
             <Button variant="outline-secondary" size="sm" onClick={handleLogout}>Выйти</Button>
           </div>
        </Col>

        <Col className="p-0 h-100 d-flex flex-column">
          <div className="bg-white shadow-sm p-3 mb-3">
            {currentChannelId && channels.find(ch => ch.id === currentChannelId) && (
              <>
                <b># {channels.find(ch => ch.id === currentChannelId).name}</b>
                <div className="text-muted">{currentMessages.length} сообщений</div>
              </>
            )}
          </div>

          <div id="messages-box" className="chat-messages overflow-auto px-4 flex-grow-1">
             {messagesLoadingStatus === 'loading' && <Spinner animation="border" className="mx-auto d-block" />}
             {messagesError && <Alert variant="danger">Ошибка загрузки сообщений: {messagesError}</Alert>}
             {messagesLoadingStatus === 'succeeded' && currentMessages.map((message) => (
              <div key={message.id} className="text-break mb-2">
                <b>{message.username}</b>: {message.body}
              </div>
            ))}
          </div>

          <div className="mt-auto px-4 py-3 bg-white">
             {currentChannelId && <MessageForm channelId={currentChannelId} />}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
