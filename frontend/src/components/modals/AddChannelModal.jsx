import { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Form, Button } from 'react-bootstrap'
import { addNewChannel, setCurrentChannel, selectChannelNames } from '../../slices/channelsSlice'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { closeModal } from '../../slices/modalSlice.js'
import leoProfanity from '../../profanityFilter.js'

const AddChannelModal = () => {
  const dispatch = useDispatch()
  const channelNames = useSelector(selectChannelNames)
  const inputRef = useRef(null)
  const { t } = useTranslation()

  const handleSelfClose = () => dispatch(closeModal())

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t('errors.required'))
      .min(3, t('errors.usernameLength'))
      .max(20, t('errors.usernameLength'))
      .notOneOf(channelNames, t('errors.channelUnique')),
  })

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setSubmitting(true)
      try {
        const cleanedName = leoProfanity.clean(values.name.trim())
        const resultAction = await dispatch(addNewChannel({ name: cleanedName }))
        if (addNewChannel.fulfilled.match(resultAction)) {
          toast.success(t('toasts.addChannelSuccess'))
          const newChannel = resultAction.payload
          dispatch(setCurrentChannel(newChannel.id))
          resetForm()
          handleSelfClose()
        }
        else {
          toast.error(t('toasts.networkError'))
          setFieldError('name', resultAction.payload || t('errors.unknown'))
          console.error('Add channel failed:', resultAction.error)
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
    validateOnBlur: false,
    validateOnChange: false,
  })

  return (
    <Modal show onHide={handleSelfClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel.title')}</Modal.Title>
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
              id="channelName"
              isInvalid={!!formik.errors.name}
              disabled={formik.isSubmitting}
              required
            />
            <Form.Label htmlFor="channelName" className="visually-hidden">{t('modals.addChannel.label')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="secondary" onClick={handleSelfClose} className="me-2" disabled={formik.isSubmitting}>
            {t('buttons.cancel')}
          </Button>
          <div className="d-flex justify-content-end mt-3">
            <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? t('loading') : t('buttons.submit')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default AddChannelModal
