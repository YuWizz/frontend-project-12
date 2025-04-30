import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChannels, addChannel, removeChannel, renameChannel,
} from '../slices/channelsSlice.js';
import { fetchMessages, addMessage } from '../slices/messagesSlice.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ChannelsBox from '../components/ChannelsBox.jsx';
import ChatBox from '../components/ChatBox.jsx';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import socket from '../socket.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const channelsLoadingStatus = useSelector(state => state.channels.loadingStatus);
  const channelsError = useSelector(state => state.channels.error);
  const messagesLoadingStatus = useSelector(state => state.messages.loadingStatus);
  const messagesError = useSelector(state => state.messages.error);

  useEffect(() => {
    if (channelsLoadingStatus === 'failed' && channelsError) {
      toast.error(t('toasts.networkError'));
      console.error('Channel fetch error:', channelsError);
    }
  }, [channelsLoadingStatus, channelsError, t]);

  useEffect(() => {
    if (messagesLoadingStatus === 'failed' && messagesError) {
      toast.error(t('toasts.networkError'));
      console.error('Messages fetch error:', messagesError);
    }
  }, [messagesLoadingStatus, messagesError, t]);

  useEffect(() => {
    if (channelsLoadingStatus === 'idle') dispatch(fetchChannels());
    if (messagesLoadingStatus === 'idle') dispatch(fetchMessages());
  }, [dispatch, channelsLoadingStatus, messagesLoadingStatus]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleNewMessage = msg => dispatch(addMessage(msg));
    const handleNewChannel = ch => dispatch(addChannel(ch));
    const handleRemoveChannel = payload => dispatch(removeChannel(payload));
    const handleRenameChannel = ch => dispatch(renameChannel(ch));

    socket.on('newMessage', handleNewMessage);
    socket.on('newChannel', handleNewChannel);
    socket.on('removeChannel', handleRemoveChannel);
    socket.on('renameChannel', handleRenameChannel);
    socket.on('connect', () => console.log('Socket connected (ChatPage):', socket.id));
    socket.on('disconnect', r => console.log('Socket disconnected (ChatPage):', r));
    socket.on('connect_error', e => console.error('Socket conn error (ChatPage):', e));


    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('newChannel', handleNewChannel);
      socket.off('removeChannel', handleRemoveChannel);
      socket.off('renameChannel', handleRenameChannel);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      if (socket.connected) socket.disconnect();
    };
  }, [dispatch]);

  return (
    <Container fluid className="h-100 p-0">
      <Container fluid className="h-100 my-4 overflow-hidden rounded shadow bg-light">
        <Row className="h-100 flex-md-row">
          <Col xs={4} md={3} lg={2} className="border-end px-0 bg-light d-flex flex-column h-100">
            <ChannelsBox />
          </Col>
          <Col className="p-0 h-100 d-flex flex-column bg-white">
            <ChatBox />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ChatPage;
