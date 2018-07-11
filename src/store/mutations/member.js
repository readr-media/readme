  const debug = require('debug')('CLIENT:mutations:member')

  const SET_PROFILE = (state, { profile, }) => {
    state['profile'] = profile
  }
  const SET_LOGGEIN_STATUS = (state, { body, }) => {
    state['isLoggedIn'] = body
  }

  export {
    SET_LOGGEIN_STATUS,
    SET_PROFILE,
  }