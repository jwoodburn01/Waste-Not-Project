import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InputCharityForm() { 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [location, setLocation] = useState(""); 
  const successToast = () => toast.success("Charity Added");
  const failedToast = () => toast.error("Error, Charity Failed to Add");
  const errorToast = () => toast.error("Error, Please fill in all fields");


  const handleSubmit = (e) => {
    e.preventDefault();
if(!name || !link || !location){
  errorToast();
}else {
   try {
      axios.post("http://localhost:3001/addCharity",{
                name: name,
                description: description,
                link: link,
                location: location,

          })
          setShow(false);
          successToast();
    } catch (error) {
      failedToast();
      console.log(error);
    }
   
}

 

  }

  return (
    <>
      <Button className='pageButtonStyling' variant="primary" onClick={handleShow}>
        Add New
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Charity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" >
              <Form.Label>Charity Name</Form.Label>
              <Form.Control
                placeholder={"Charity name"}
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />

              <Form.Label>Website Link</Form.Label>
              <Form.Control
                value={link}
                onChange={e => setLink(e.target.value)}
              />

              <Form.Label>Location</Form.Label>
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
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InputCharityForm;