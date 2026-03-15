import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"

import { authLoginReducer, forgotPasswordReducer, resetPasswordReducer } from "./reducers/authReducers"
import { userProfileReducer } from "./reducers/userReducers"
import { chatReducer } from "./reducers/chatReducers"
import { programReducer } from "./reducers/programReducers"
import {
  exerciseListReducer,
  exerciseDetailsReducer,
  exerciseSaveReducer,
  exerciseDeleteReducer
} from "./reducers/exerciseReducers"
import {
  workoutLogReducer,
  dashboardStatsReducer
} from "./reducers/workoutReducers"
import { progressAnalyticsReducer } from "./reducers/progressReducers"

// combine reducers
const rootReducer = combineReducers({
  authLogin: authLoginReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  userProfile: userProfileReducer,
  chat: chatReducer,
  program: programReducer,
  exerciseList: exerciseListReducer,
  exerciseDetails: exerciseDetailsReducer,
  exerciseSave: exerciseSaveReducer,
  exerciseDelete: exerciseDeleteReducer,
  workoutLog: workoutLogReducer,
  dashboardStats: dashboardStatsReducer,
  progress: progressAnalyticsReducer
})

// create the store
const store = configureStore({
  reducer: rootReducer
})

export default store
