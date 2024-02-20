import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import ErrorMessage from './errorMessage';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../actions/userActions';
import LoadingSpinner from './loading';
import { MdOutlineEdit } from "react-icons/md";


function UpdateProfileForm() { 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picMessage, setPicMessage] = useState("");
  const dispatch = useDispatch();
  const userLogin = useSelector((state)=>state.userLogin);
  const {userInfo} = userLogin;
  const userUpdate = useSelector((state => state.userUpdate));
  const {loading, error, success} = userUpdate;
  const id = userInfo._id;

  useEffect(()=> {
    if(userInfo){
      setfName(userInfo.fName);
      setlName(userInfo.lName);
      setEmail(userInfo.email);
      setPic(userInfo.pic)
    }
  },[userInfo])

  const handleSubmit = (e) => {
    e.preventDefault();

    if(password===confirmPassword){
      console.log(id);
      dispatch(updateProfile({id, fName, lName, email, password, pic}));
    }
  }

  const postPic = (pics) => {

    if(!pics){
      return setPicMessage("Please select an image")
    }
    setPicMessage(null);

    if(pics.type === 'image/jpeg' || pics.type === 'image/png'){
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'WasteNot')
      data.append('cloud_name','diodvhgrg')
      fetch("https://api.cloudinary.com/v1_1/diodvhgrg/image/upload", {
        method: "post",
        body:data
      }).then((res)=>res.json())
      .then((data)=> {
        let newPic = data.url.toString();
        console.log(newPic)
        setPic(newPic);
        console.log(pic)

      })
      .catch((err)=>{
        console.log(err);
      })
    } else {
      return setPicMessage("Please select an image")
    }
  }

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow} style={{height: '36px', overflow: 'visible'}}>
        Edit Profile
      </Button> */}
      <MdOutlineEdit onClick={handleShow} className='profilePageEditIcon'/>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {loading && <LoadingSpinner />}
            {success && (
              <ErrorMessage variant='success'>
                Updated Successfully
              </ErrorMessage>
            )}
            {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
            <Form.Group className="mb-3" >
              <Form.Label>First Name</Form.Label>
              <Form.Control
                placeholder={"e.g John"}
                autoFocus
                value={fName}
                onChange={e => setfName(e.target.value)}
              />
                 <Form.Label>Last Name</Form.Label>
              <Form.Control
                placeholder={"e.g Woodburn"}
                value={lName}
                onChange={e => setlName(e.target.value)}
              />
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                placeholder={"Email Address"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                type='email'
              />
                <Form.Label>Password</Form.Label>
              <Form.Control
                placeholder={"Password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                type='password'
              />
                  <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                placeholder={"Password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                type='password'
              />
              {picMessage && (
                <ErrorMessage variant="danger">{picMessage}</ErrorMessage>
              )}
              <Form.Label>User Profile Image</Form.Label>
              <Form.Control
              id="custom-file"
                type="file"
                label="Upload Profile Picture"
                onChange={e => postPic(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateProfileForm;