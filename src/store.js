import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"

import { authLoginReducer } from "./reducers/authReducers"
import { userProfileReducer } from "./reducers/userReducers"
import { chatReducer } from "./reducers/chatReducers"
import { programReducer } from "./reducers/programReducers"
import {
  exerciseListReducer,
  exerciseDetailsReducer
} from "./reducers/exerciseReducers"
import {
  workoutLogReducer,
  dashboardStatsReducer
} from "./reducers/workoutReducers"

// combine reducers
const rootReducer = combineReducers({
  authLogin: authLoginReducer,
  userProfile: userProfileReducer,
  chat: chatReducer,
  program: programReducer,
  exerciseList: exerciseListReducer,
  exerciseDetails: exerciseDetailsReducer,
  workoutLog: workoutLogReducer,
  dashboardStats: dashboardStatsReducer
})

// create the store
const store = configureStore({
  reducer: rootReducer
})

export default store
