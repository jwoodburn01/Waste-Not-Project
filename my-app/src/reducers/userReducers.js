import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_UPDATE_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS } from "../constants/userConstants";

// this reducer handles the login actions
export const userLoginReducer=(state={}, action) =>{
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {loading: true};
            // if login is successful it will update the userInfo
        case USER_LOGIN_SUCCESS:
            return {loading: false, userInfo: action.payload};
        case USER_LOGIN_FAIL:
            return {loading: false, error: action.payload};
            // on logout clear data
        case USER_LOGOUT:
            return{};

        default:
            return state;
    }
}

// this reducer deals with the register actions in the same way as the login
export const userRegisterReducer=(state={}, action) =>{
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return {loading: true};
        case USER_REGISTER_SUCCESS:
            // on success updates the userInfo
            return {loading: false, userInfo: action.payload};
        case USER_REGISTER_FAIL:
            return {loading: false, error: action.payload};
     
        default:
            return state;
    }
}

// once again something similar to above but for update user
export const userUpdateReducer=(state={}, action) =>{
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return {loading: true};
        case USER_UPDATE_SUCCESS:
            // if updated it will update the userInfo
            return {loading: false, userInfo: action.payload, success: true};
        case USER_UPDATE_FAIL:
            return {loading: false, error: action.payload, success: true};
     
        default:
            return state;
    }
}