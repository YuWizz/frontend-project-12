import { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Form, Button } from 'react-bootstrap'
import { renameExistingChannel, selectChannelNames, selectAllChannels } from '../../slices/channelsSlice'
import { closeModal, selectModalChannel } from '../../slices/modalSlice.js'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import leoProfanity from '../../profanityFilter.js'

const RenameChannelModal = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const modalChannel = useSelector(selectModalChannel)
  const channelId = modalChannel?.id
  const allChannels = useSelector(selectAllChannels)
  const currentChannelData = allChannels.find(ch => ch.id === channelId)
  const actualCurrentName = currentChannelData?.name ?? ''
  const otherChannelNames = useSelector(selectChannelNames).filter(name => name !== actualCurrentName)
  const inputRef = useRef(null)

  const handleSelfClose = () => dispatch(closeModal())

  useEffect(() => {
    setTimeout(() => inputRef.current?.select(), 100)
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t('errors.required'))
      .min(3, t('errors.usernameLength'))
      .max(20, t('errors.usernameLength'))
      .notOneOf(otherChannelNames, t('errors.channelUnique')),
  })

  const formik = useFormik({
    initialValues: { name: actualCurrentName },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      if (!channelId) {
        console.error('RenameChannelModal: channelId is missing.')
        setFieldError('name', t('errors.unknown'))
        setSubmitting(false)
        return
      }
      setSubmitting(true)
      try {
        const cleanedName = leoProfanity.clean(values.name.trim())
        const resultAction = await dispatch(renameExistingChannel({ id: channelId, name: cleanedName }))
        if (renameExistingChannel.fulfilled.match(resultAction)) {
          toast.success(t('toasts.renameChannelSuccess'))
          resetForm()
          handleSelfClose()
        }
        else {
          toast.error(t('toasts.networkError'))
          setFieldError('name', resultAction.payload || t('errors.unknown'))
          console.error('Rename channel failed:', resultAction.error)
          inputRef.current?.select()
        }
      }
      catch (error) {
        toast.error(t('errors.unknown'))
        setFieldError('name', t('errors.unknown'))
        console.error('Unexpected error:', error)
        inputRef.current?.select()
      }
      finally {
        setSubmitting(false)
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
  })

  const handleModalClose = () => {
    formik.resetForm({ values: { name: actualCurrentName } })
    handleSelfClose()
  }

  return (
    <Modal show onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
              id="rename-channel-name"
              isInvalid={!!formik.errors.name}
              disabled={formik.isSubmitting}
              required
            />
            <Form.Label htmlFor="rename-channel-name" className="visually-hidden">{t('modals.addChannel.label')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleModalClose} className="me-2" disabled={formik.isSubmitting}>
              {t('buttons.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? t('loading') : t('buttons.rename')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default RenameChannelModal
