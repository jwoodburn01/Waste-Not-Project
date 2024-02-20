
import React, { useEffect, useState } from "react"
import HandsImage from "../images/hands.png"
import Giving from "../images/sharing.png"
import { Col, Row } from "react-bootstrap"
import LoadingSpinner from "../components/loading"
import ErrorMessage from "../components/errorMessage"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginSubmission } from "../actions/userActions"
import { register } from "../actions/userActions"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login(props, history) {
  let [authMode, setAuthMode] = useState("signin")

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  const resetPassword = () => {
    setAuthMode(authMode === "signin" ? "resetPass" : "")
  }

  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("https://img.freepik.com/free-psd/3d-icon-social-media-app_23-2150049569.jpg?w=826&t=st=1703797536~exp=1703798136~hmac=d0ebf7f20e6545ccca079344405bf2e71a00b9d68a76b29cf5c5e3039d018460");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [resetPassEmail, setResetPassEmail] = useState("");
 

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const userRegister = useSelector(state => state.userRegister)
  const { loadingReg, errorReg } = userRegister;
  const navigate = useNavigate();
  const emailToast = () => toast.success("Email Sent");


  const submitRegister = async (e) => {
    e.preventDefault();
    console.log(pic)
    if(!fName|| !lName || !email || !password || !confirmPassword){
      setMessage('Please fill in all fields')
    }else{
       if (password !== confirmPassword) {
      setMessage("Passwords do not match")
    } else {
      dispatch(register(fName, lName, email, password, pic));
      changeAuthMode();

    }
    }
   



  }

  const login = async (e) => {
    e.preventDefault();
    if(!email || !password){
      setLoginMessage('Please fill in all fields')
    }else{
      dispatch(loginSubmission(email, password))
    }

  }

  const resetSubmission = async (e) => {
    e.preventDefault();
fetch("http://localhost:3001/forgotPassword", {
  method:"POST",
  crossDomain: true,
  headers:{
    "Content-Type":"application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  body: JSON.stringify({
    email:resetPassEmail,
  })
})

.then(((res)=> res.json()),emailToast())

.catch(error => console.error(error));


  }

  useEffect(() => {
        const userInfo = localStorage.getItem("userInfo");
    
        if(userInfo){
          navigate("/")
        }
      }, [navigate,userInfo])

  if (authMode === "signin") {
    return (

      <Row>
        <Col sm='6' className="loginCol">
          <div className="Auth-form-container">
            <form className="Auth-form">
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Sign In</h3>
                {loginMessage && <ErrorMessage variant="danger">{loginMessage}</ErrorMessage>}
                {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
                {/* {console.log(error)} */}
                {loading && <LoadingSpinner />}
                <div className="text-center">
                  Not registered yet?{" "}
                  <span className="link-primary" onClick={changeAuthMode}>
                    Sign Up
                  </span>
                </div>
                <div className="form-group mt-3">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={login}
                  >
                    Submit
                  </button>
                </div>
                <div className="text-center">
                  Forgot{" "}
                  <span className="link-primary" onClick={resetPassword}>
                    password?
                  </span>
                </div>
              </div>
            </form>
          </div>
        </Col>
        <Col sm='6'>
          <img className="loginImageDisplay" src={HandsImage} alt="Giving Image"></img>
        </Col>
      </Row>
    )
  }

  if (authMode === "signup") {

    return (
      <Row>
        <Col sm='6'>
          <img className="loginImageDisplay" src={Giving} alt="Thrive"></img>
        </Col>
        <Col sm='6' className="loginCol">
          <div className="Auth-form-container">
            <form className="Auth-form">
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Register</h3>
                {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
                {console.log(message)}
                {errorReg && <ErrorMessage variant="danger">{errorReg}</ErrorMessage>}
                {console.log(errorReg)}
                {loadingReg && <LoadingSpinner />}
                <div className="text-center">
                  Already registered?{" "}
                  <span className="link-primary" onClick={changeAuthMode}>
                    Sign In
                  </span>
                </div>
                <div className="form-group mt-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="e.g John"
                    value={fName}
                    onChange={e => setfName(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Last Name</label>
                  <input
                    className="form-control mt-1"
                    placeholder="e.g Wodburn"
                    value={lName}
                    onChange={e => setlName(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    className="form-control mt-1"
                    placeholder="Password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button onClick={submitRegister} className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Col>
      </Row>
    )
  }
  if (authMode === "resetPass") {

    return (

      <Row>
        <Col sm='6'>
          <img className="loginImageDisplay" src={Giving} alt="Thrive"></img>
        </Col>
        <Col sm='6' className="loginCol">
          <div className="Auth-form-container">
            <form className="Auth-form">
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Forgot Password</h3>
                <div className="text-center">
                  Go back?{" "}
                  <span className="link-primary" onClick={changeAuthMode}>
                    Sign In
                  </span>
                </div>
                <div className="form-group mt-3">
                  <label>Email address</label>
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Email Address"
                    value={resetPassEmail}
                    onChange={(e) => setResetPassEmail(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button className="btn btn-primary" onClick={resetSubmission}>
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Col>
      </Row>
    )
  }

}