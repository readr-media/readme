export const switchAlert = (store, active, {
  message,
  textConfirm,
  textCancel,
  type = 'action',
  cancelHandler,
  confirmHandler
}) => store.dispatch('ALERT_SWITCH', {
  active, message, textConfirm, cancelHandler,
  confirmHandler, textCancel, type })