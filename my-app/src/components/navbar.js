import { NavLink, useNavigate } from "react-router-dom";
import "../stylesheets/stylesheet.css";
import logo from "../images/waste-notlogo.png";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { useEffect } from "react";
import EmailIcon from "@mui/icons-material/Email";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ProfilesModal from "./profilesModal";
import useConfirm from "./confirmDialogue";

const NavigationBar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const userName = localStorage.getItem("userInfo").fName;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  let profileLink = null;
  let messageIcon = null;
  const accountRemovalToast = () =>
    toast.success("Account Removal Request Sent");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState();
  const [Dialog, confirmDelete] = useConfirm("Are you sure?", message);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  const messageNav = () => {
    navigate("/messages");
  };

  const accountRemovalReq = async () => {
    setMessage("Are you sure you want to delete your account?");
    const ans = await confirmDelete();
    if (ans) {
      let message = `Automated Message: I want to delete my account`;
      axios.post("http://localhost:3001/msg", {
        from: userInfo._id,
        to: "658dbba33fb671584738a7e9",
        message: message,
      });
      accountRemovalToast();
    } else {
    }
  };

  if (userInfo) {
    profileLink = (
      <NavDropdown title={userInfo?.fName}>
        <NavDropdown.Item href={"/profile"}>My Profile</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href={"/messages"}>Messages</NavDropdown.Item>
        <NavDropdown.Divider />
        {userInfo.type === "user" ? (
          <>
            <NavDropdown.Item onClick={accountRemovalReq}>
              Remove Account
            </NavDropdown.Item>
            <NavDropdown.Divider />
          </>
        ) : (
          <>
            <NavDropdown.Item
              onClick={() => {
                setShow(true);
              }}
            >
              User Profiles
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <ProfilesModal show={show} onClose={() => setShow(false)} />
          </>
        )}
        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
      </NavDropdown>
    );
  } else {
    profileLink = <NavLink to="/login">Login/Register</NavLink>;
  }

  if (userInfo) {
    messageIcon = <EmailIcon className="iconButton" onClick={messageNav} />;
  } else {
    messageIcon = (
      <MailOutlineIcon className="iconButton" onClick={messageNav} />
    );
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <img
            className="navLogo"
            onClick={() => navigate("/")}
            src={logo}
            alt="Waste Not Logo"
          />
        </div>
        <div className="menuIcon" onClick={() => setNavOpen(!navOpen)}>
          <FiMenu />
        </div>
        <div className={`nav-elements  ${navOpen && "active"}`}>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/food">Food</NavLink>
            </li>
            <li>
              <NavLink to="/homeGoods">Home Goods</NavLink>
            </li>
            <li>
              <NavLink to="/localCharities">Local Charities</NavLink>
            </li>
            <li>{messageIcon}</li>
            <li>
              {profileLink}
              <Dialog />
            </li>
          </ul>
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};
export default NavigationBar;
