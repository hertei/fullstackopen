import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice ({
  name: 'notification',
  initialState: null,
  reducers: {
    addNotification(state, action) {
      return action.payload
    }
  }
})

export const { addNotification } = notificationSlice.actions

export const setNotification = (notification, time = 5) => {
  return async dispatch => {
    dispatch(addNotification(notification))
    setTimeout( () => {
      dispatch(addNotification(null))
    },time*1000)
  }
}
export default notificationSlice.reducer