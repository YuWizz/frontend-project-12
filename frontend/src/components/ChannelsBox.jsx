import { useSelector, useDispatch } from 'react-redux';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useTranslation } from 'react-i18next';
import { setCurrentChannel } from '../slices/channelsSlice.js';
import { openModal } from '../slices/modalSlice.js';

const ChannelsBox = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const channels = useSelector(state => state.channels.entities);
  const currentChannelId = useSelector(state => state.channels.currentChannelId);
  const channelsLoadingStatus = useSelector(state => state.channels.loadingStatus);
  const channelsError = useSelector(state => state.channels.error);

  const showModal = (type, channel = null) => {
    dispatch(openModal({ type, channel }));
  };

  const handleChannelSelect = id => dispatch(setCurrentChannel(id));

  const renderChannelButton = channel => (
    <Nav.Item key={channel.id} className="w-100 position-static">
      <div className="btn-group w-100 dropdown" role="group">
        <Button
          variant={channel.id === currentChannelId ? 'secondary' : 'light'}
          onClick={() => handleChannelSelect(channel.id)}
          className={`w-100 rounded-0 text-start text-truncate border-0 ${channel.removable ? '' : 'rounded'}`}
        >
          {`# ${channel.name}`}
        </Button>
        {channel.removable && (
          <Dropdown>
            <Dropdown.Toggle
              split
              variant={channel.id === currentChannelId ? 'secondary' : 'light'}
              id={`dropdown-split-basic-${channel.id}`}
              className="border-0 rounded-0 rounded-end"
            >
              <span className="visually-hidden">{t('chat.channelControl')}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => showModal('removeChannel', channel)}>{t('buttons.remove')}</Dropdown.Item>
              <Dropdown.Item onClick={() => showModal('renameChannel', channel)}>{t('buttons.rename')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </Nav.Item>
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2 ps-4 pt-3 pe-2">
        <b>{t('chat.channelsHeader')}</b>
        <Button variant="outline-primary" size="sm" onClick={() => showModal('addChannel')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path
              d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"
            />
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
            />
          </svg>
          <span className="visually-hidden">{t('buttons.add')}</span>
        </Button>
      </div>

      {channelsLoadingStatus === 'loading' && <Spinner animation="border" className="mx-auto" />}
      {channelsError && (
        <Alert variant="danger" className="m-2">
          {`Ошибка: ${channelsError}`}
        </Alert>
      )}

      <Nav variant="pills" className="flex-column px-2 overflow-auto flex-grow-1">
        {channels.map(renderChannelButton)}
      </Nav>
    </>
  );
};

export default ChannelsBox;
