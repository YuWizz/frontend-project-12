import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { useTranslation } from 'react-i18next'
import MessageForm from './MessageForm.jsx'

const ChatBox = () => {
  const { t } = useTranslation()
  const messagesBoxRef = useRef(null)

  const channels = useSelector(state => state.channels.entities)
  const currentChannelId = useSelector(state => state.channels.currentChannelId)
  const messages = useSelector(state => state.messages.entities)
  const messagesLoadingStatus = useSelector(state => state.messages.loadingStatus)
  const messagesError = useSelector(state => state.messages.error)

  const currentMessages = messages.filter(msg => msg.channelId === currentChannelId)
  const currentChannel = channels.find(ch => ch.id === currentChannelId)

  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight
    }
  }, [messages, currentChannelId])

  return (
    <>
      <div className="bg-light shadow-sm p-3 mb-0 small">
        {currentChannel && (
          <>
            <b># {currentChannel.name}</b>
            <div className="text-muted">{t('chat.messagesCount', { count: currentMessages.length })}</div>
          </>
        )}
        {!currentChannel && <p className="m-0">Выберите канал</p>}
      </div>

      <div ref={messagesBoxRef} id="messages-box" className="chat-messages overflow-auto px-5 py-3 flex-grow-1">
        {messagesLoadingStatus === 'loading' && <Spinner animation="border" className="mx-auto d-block" />}
        {messagesError && <Alert variant="danger">Ошибка: {messagesError}</Alert>}
        {messagesLoadingStatus !== 'loading' && currentMessages.map(message => (
          <div key={message.id} className="text-break mb-2">
            <b>{message.username}</b>: {message.body}
          </div>
        ))}
      </div>

      <div className="mt-auto px-4 py-3">
        {currentChannelId && <MessageForm channelId={currentChannelId} />}
      </div>
    </>
  )
}

export default ChatBox
