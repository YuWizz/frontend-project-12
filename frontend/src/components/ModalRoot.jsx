import { useSelector, useDispatch } from 'react-redux'
import { closeModal, selectModalType, selectModalChannel } from '../slices/modalSlice.js'
import AddChannelModal from './modals/AddChannelModal.jsx'
import RenameChannelModal from './modals/RenameChannelModal.jsx'
import RemoveChannelModal from './modals/RemoveChannelModal.jsx'

const MODAL_COMPONENTS = {
  addChannel: AddChannelModal,
  renameChannel: RenameChannelModal,
  removeChannel: RemoveChannelModal,
}

const ModalRoot = () => {
  const dispatch = useDispatch()
  const modalType = useSelector(selectModalType)
  const modalChannel = useSelector(selectModalChannel)

  const handleClose = () => dispatch(closeModal())

  if (!modalType) {
    return null
  }

  const SpecificModal = MODAL_COMPONENTS[modalType]

  if (!SpecificModal) {
    return null
  }

  return (
    <SpecificModal
      show
      handleClose={handleClose}
      channelId={modalChannel?.id}
      currentName={modalChannel?.name}
    />
  )
}

export default ModalRoot
