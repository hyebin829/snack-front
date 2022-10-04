import { combineReducers } from 'redux'
import modalSlice from './modal'
import postSlice from './post'
import userSlice from './user'

const rootReducer = combineReducers({
  user: userSlice.reducer,
  post: postSlice.reducer,
  modal: modalSlice.reducer,
})

export default rootReducer
