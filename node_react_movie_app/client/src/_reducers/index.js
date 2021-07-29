import { combineReducers } from "redux"; //여러 기능 합침
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;