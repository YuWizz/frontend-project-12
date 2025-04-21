import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { deleteExistingChannel } from '../../slices/channelsSlice';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const RemoveChannelModal = ({ show, handleClose, channelId }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { t } = useTranslation();

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const resultAction = await dispatch(deleteExistingChannel(channelId));
       if (deleteExistingChannel.fulfilled.match(resultAction)) {
        toast.success(t('toasts.removeChannelSuccess'));
        handleClose();
      } else {
          const errorPayload = resultAction.payload || t('errors.removeChannelError');
          setDeleteError(errorPayload);
          toast.error(t('errors.network'));
          console.error("Delete channel failed:", resultAction.error);
      }
    } catch (error) {
        setDeleteError(t('errors.unknown'));
        toast.error(unknownErrorMsg);
        console.error("Unexpected error:", error);
    } finally {
        setIsDeleting(false);
    }
  };

  const handleModalClose = () => {
    setDeleteError(null);
    setIsDeleting(false);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
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
  );
};

export default RemoveChannelModal;
