import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { deleteExistingChannel } from '../../slices/channelsSlice'
import { closeModal, selectModalChannel } from '../../slices/modalSlice.js'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const RemoveChannelModal = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const channel = useSelector(selectModalChannel)
  const channelId = channel?.id
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const handleSelfClose = () => dispatch(closeModal())

  const handleDelete = async () => {
    if (!channelId) {
      setDeleteError(t('errors.unknown'))
      return
    }

    setIsDeleting(true)
    setDeleteError(null)
    try {
      const resultAction = await dispatch(deleteExistingChannel(channelId))
      if (deleteExistingChannel.fulfilled.match(resultAction)) {
        toast.success(t('toasts.removeChannelSuccess'))
        handleSelfClose()
      }
      else {
        const errorPayload = resultAction.payload || t('errors.removeChannelError', t('errors.unknown'))
        setDeleteError(errorPayload)
        toast.error(t('errors.network'))
        console.error('Delete channel failed:', resultAction.error)
      }
    }
    catch (error) {
      const errorMsg = t('errors.unknown')
      setDeleteError(errorMsg)
      toast.error(errorMsg)
      console.error('Unexpected error:', error)
    }
    finally {
      setIsDeleting(false)
    }
  }

  const handleModalClose = () => {
    setDeleteError(null)
    setIsDeleting(false)
    handleSelfClose()
  }

  return (
    <Modal show onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modals.removeChannel.confirm')}</p>
        {deleteError && <p className="text-danger">{deleteError}</p>}
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleModalClose} className="me-2" disabled={isDeleting}>
            {t('buttons.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? t('loading') : t('buttons.remove')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default RemoveChannelModal
