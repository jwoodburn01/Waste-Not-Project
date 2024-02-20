import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL } from "../constants/userConstants";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const loginSubmission =(email, password) => async (dispatch) => {
  const successToast = () => toast.success("Login Successful");
  const failToast = () => toast.error("Login Failed");
    try {
    dispatch({type: USER_LOGIN_REQUEST});

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

 

      const { data } = await axios.post("http://localhost:3001/authProfile", {
        email,
        password
      },
        config
      );
     dispatch({ type: USER_LOGIN_SUCCESS, payload: data});
      localStorage.setItem("userInfo", JSON.stringify(data));
      successToast();

    } catch (error) {
    dispatch({
    type: USER_LOGIN_FAIL,
    payload:
        error.response && error.response.data.message
        ? error.response.data.message
        : error.response
    })
    console.log(error);
  failToast();
    }
  };

  export const logout = () => async (dispatch) => {
  const logOutToast = () => toast.success("Logout Successful");
    localStorage.removeItem("userInfo");
    dispatch({type: USER_LOGOUT});
    logOutToast();

  };

  export const register = (fName, lName, email, password, pic) => async (dispatch) => {
  const registerToast = () => toast.success("Register Successful, you have been added to the system");
  const registerToastFail = () => toast.error("Failed to Register");

    try {
        dispatch({type: USER_REGISTER_REQUEST})
       
        let postURL = "http://localhost:3001/addProfile"

        const data = axios.post(postURL, {
          fName: fName,
          lName: lName,
          email: email,
          password: password,
          type: 'user',
          pic: pic
        })

            // Once posted, the user will be notified 
            // alert('You have been added to the system!');
            registerToast();

            dispatch({type: USER_REGISTER_SUCCESS, payload: data});
     
      } catch (error) {
       
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                ? error.response.data.message
                : error.response
            })
            registerToastFail();
      }
  }

  export const updateProfile = (user) => async (dispatch, getState) => {
  const updateToastSuccess = () => toast.success("Profile Updated");
  const updateToastFail = () => toast.error("Profile Failed to Update");


    try{
      dispatch({type: USER_UPDATE_REQUEST});

      const {
        userLogin: {userInfo},
      } = getState();

      const config ={
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        },
        
      }
      const { data } = await axios.post("http://localhost:3001/updateProfile", user, config);

      dispatch({type: USER_UPDATE_SUCCESS, payload: data});
      dispatch({type: USER_LOGIN_SUCCESS, payload: data});
      localStorage.setItem("userInfo", JSON.stringify(data));
      updateToastSuccess();
    } catch(error) {
      dispatch({
        type: USER_UPDATE_FAIL,
        payload:
            error.response && error.response.data.message
            ? error.response.data.message
            : error.response
        })
        updateToastFail();
    }
  }