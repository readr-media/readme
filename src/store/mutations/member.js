  // const debug = require('debug')('CLIENT:mutations:member')

  const SET_PROFILE = (state, { profile, }) => {
    state['profile'] = profile
  }
  const SET_LOGGEIN_STATUS = (state, { body, }) => {
    state['isLoggedIn'] = body
  }
  const SET_TOKEN = (state, { token, type, }) => {
    switch (type) {
      case 'register':
        state['register-token'] = token
        break
    }
  }

  export {
    SET_LOGGEIN_STATUS,
    SET_PROFILE,
    SET_TOKEN,
  }