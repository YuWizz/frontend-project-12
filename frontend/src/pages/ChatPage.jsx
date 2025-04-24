import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChannels, setCurrentChannel, addChannel, removeChannel, renameChannel,
} from '../slices/channelsSlice.js';
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
import AddChannelModal from '../components/modals/AddChannelModal.jsx';
import RenameChannelModal from '../components/modals/RenameChannelModal.jsx';
import RemoveChannelModal from '../components/modals/RemoveChannelModal.jsx';
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const channels = useSelector((state) => state.channels.entities);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const channelsLoadingStatus = useSelector((state) => state.channels.loadingStatus);
  const channelsError = useSelector((state) => state.channels.error);
  const messages = useSelector((state) => state.messages.entities);
  const messagesLoadingStatus = useSelector((state) => state.messages.loadingStatus);
  const messagesError = useSelector((state) => state.messages.error);

  const socketRef = useRef(null);
  const messagesBoxRef = useRef(null);

  const [modalInfo, setModalInfo] = useState({ type: null, channel: null });
  const handleShowModal = (type, channel = null) => setModalInfo({ type, channel });
  const handleCloseModal = () => setModalInfo({ type: null, channel: null });

  useEffect(() => {
    if (channelsLoadingStatus === 'failed' && channelsError) {
       if (channelsError === 'Unauthorized') {
          toast.error(t('errors.invalidCredentials'));
       } else {
         toast.error(t('toasts.fetchDataError'));
       }
    }
  }, [channelsLoadingStatus, channelsError, t]);

   useEffect(() => {
    if (messagesLoadingStatus === 'failed' && messagesError) {
       if (messagesError === 'Unauthorized') {
          toast.error(t('errors.invalidCredentials'));
       } else {
         toast.error(t('toasts.fetchDataError'));
       }
    }
  }, [messagesLoadingStatus, messagesError, t]);

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

      socketRef.current.on('newMessage', (msg) => {
        console.log('SOCKET: Received newMessage', msg);
        dispatch(addMessage(msg));
      });

      socketRef.current.on('newChannel', (ch) => {
        console.log('SOCKET: Received newChannel', ch);
        dispatch(addChannel(ch));
      });

      socketRef.current.on('removeChannel', (payload) => {
         console.log('SOCKET: Received removeChannel', payload);
        dispatch(removeChannel(payload));
      });

      socketRef.current.on('renameChannel', (ch) => {
        console.log('SOCKET: Received renameChannel', ch);
        dispatch(renameChannel(ch));
      });

      socketRef.current.on('connect', () => console.log('Socket connected:', socketRef.current.id));
      socketRef.current.on('disconnect', (r) => console.log('Socket disconnected:', r));
      socketRef.current.on('connect_error', (e) => console.error("Socket conn error:", e));
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
  }, [messages, currentChannelId]);

  const handleChannelSelect = (id) => dispatch(setCurrentChannel(id));

  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId);

  const renderChannelButton = (channel) => (
    <Nav.Item key={channel.id} className="w-100 position-static">
      <div className="btn-group w-100 dropdown" role="group">
        <Button
          variant={channel.id === currentChannelId ? 'secondary' : 'light'}
          onClick={() => handleChannelSelect(channel.id)}
          className={`w-100 rounded-0 text-start text-truncate border-0 ${channel.removable ? '' : 'rounded'}`}
        >
          # {channel.name}
        </Button>

        {channel.removable && (
          <Dropdown>
            <Dropdown.Toggle
              split
              variant={channel.id === currentChannelId ? 'secondary' : 'light'}
              id={`dropdown-split-basic-${channel.id}`}
              className="border-0 rounded-0 rounded-end"
             >
              <span className="visually-hidden">{t('buttons.add')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleShowModal('remove', channel)}>Удалить</Dropdown.Item>
              <Dropdown.Item onClick={() => handleShowModal('rename', channel)}>Переименовать</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </Nav.Item>
  );

  return (
    <Container fluid className="h-100 d-flex flex-column px-0">

      <AddChannelModal show={modalInfo.type === 'add'} handleClose={handleCloseModal} />
      <RenameChannelModal
        show={modalInfo.type === 'rename'}
        handleClose={handleCloseModal}
        channelId={modalInfo.channel?.id}
        currentName={modalInfo.channel?.name}
      />
       <RemoveChannelModal
        show={modalInfo.type === 'remove'}
        handleClose={handleCloseModal}
        channelId={modalInfo.channel?.id}
      />

      <Container fluid className="my-4 overflow-hidden rounded shadow flex-grow-1">
        <Row className="h-100 bg-white flex-md-row">
          <Col xs={4} md={3} lg={2} className="border-end px-0 bg-white d-flex flex-column h-100">
             <div className="d-flex justify-content-between align-items-center mb-2 ps-4 pt-3 pe-2">
                <b>{t('chat.channelsHeader')}</b>
                <Button variant="outline-primary" size="sm" onClick={() => handleShowModal('add')}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg>
                  <span className="visually-hidden">+</span>
                </Button>
             </div>

            {channelsLoadingStatus === 'loading' && <Spinner animation="border" className="mx-auto" />}
            {channelsError && <Alert variant="danger" className="m-2">Ошибка: {channelsError}</Alert>}

            <Nav
              variant="pills"
              className="flex-column px-2 overflow-auto"
            >
              {channels.map(renderChannelButton)}
            </Nav>
          </Col>

          <Col className="p-0 h-100 d-flex flex-column">
             <div className="bg-light shadow-sm p-3 mb-0 small">
                {currentChannelId && channels.find(ch => ch.id === currentChannelId) && (
                <>
                    <b># {channels.find(ch => ch.id === currentChannelId).name}</b>
                    <div className="text-muted">{t('chat.messagesCount', { count: currentMessages.length })}</div>
                </>
                )}
            </div>
            <div ref={messagesBoxRef} id="messages-box" className="chat-messages overflow-auto px-5 py-3 flex-grow-1">
                {messagesLoadingStatus !== 'loading' && currentMessages.map((message) => (
                    <div key={message.id} className="text-break mb-2">
                    <b>{message.username}</b>: {message.body}
                    </div>
                ))}
                {messagesLoadingStatus === 'loading' && <Spinner animation="border" className="mx-auto d-block" />}
                {messagesError && <Alert variant="danger">Ошибка: {messagesError}</Alert>}
            </div>

             <div className="mt-auto px-4 py-3">
                {currentChannelId && <MessageForm channelId={currentChannelId} />}
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ChatPage;
