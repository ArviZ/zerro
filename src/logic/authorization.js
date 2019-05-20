import LocalStorage from '../services/localstorage'
import Cookies from 'cookies-js'
import ZenApi from '../services/ZenApi'
import { setToken } from '../store/token'
import { updateData, wipeData } from '../store/data'

export const logIn = () => (dispatch, getState) => {
  dispatch(logOut())
  ZenApi.getToken()
    .then(token => {
      dispatch(setToken(token))
      dispatch(updateData())
    })
    .catch(err => console.warn('!!! Login failed', err))
}

export const logOut = () => (dispatch, getState) => {
  dispatch(wipeData())
  dispatch(setToken(null))
  LocalStorage.clear()
  Cookies.expire('token')
}