import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MdOutlineEdit } from "react-icons/md";


function UpdateItemForm(props) { 

  const { nameInitial, descriptionInitial, imageInitial, locationInitial,  idInitial } = props;
  console.log(nameInitial, idInitial);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [picMessage, setPicMessage] = useState("");
  const [location, setLocation] = useState(''); 
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(()=> {
      setId(idInitial);
      setName(nameInitial);
      setDescription(descriptionInitial);
      setImage(imageInitial);
      setLocation(locationInitial)
  },[idInitial, nameInitial, descriptionInitial, imageInitial, locationInitial])


  const handleSubmit = (e) => {
    e.preventDefault();
    alert('You have submitted')
    let postURL = ""
       postURL = "http://localhost:3001/updateItem"

          axios.post(postURL,{
                name: name,
                description: description,
                image: image,
                location: location,
                id, id

          })
         
        .then(()=>{
            alert('The item has been updated!');
        })
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
        setImage(newPic);

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
      <MdOutlineEdit  onClick={handleShow}/>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" >
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                // placeholder={type === 'food' ? "e.g. Bread Loaf": "e.g. Old Sofa"}
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Form.Label>Item Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />

              <Form.Label>User Profile Image</Form.Label>
              <Form.Control
              id="custom-file"
                type="file"
                label="Upload Profile Picture"
                onChange={e => postPic(e.target.files[0])}
              />

              <Form.Label>Item Location</Form.Label>
              <Form.Control
                placeholder="e.g. South Belfast"
                value={location}
                onChange={e => setLocation(e.target.value)}
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

export default UpdateItemForm;