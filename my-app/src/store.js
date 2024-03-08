import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userLoginReducer, userRegisterReducer, userUpdateReducer } from './reducers/userReducers';

//  this file will deal with the local storage data, including userInfo

// this will allow the reducers to be used with the local storage and let it update
const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userUpdate: userUpdateReducer
})

const userInfoFromStorage = localStorage.getItem('userInfo')
?JSON.parse(localStorage.getItem("userInfo"))
: null;

const initialState ={
    userLogin:{userInfo:userInfoFromStorage}
}

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;