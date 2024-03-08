import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InputCharityForm() {
  // setting all of the states and toasts
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

  // this handle submit method will ensrure that the required data is entered, if so then it will send the values
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !link || !location) {
      errorToast(); // if the data isnt entered it will show a error toast with 'Please fill in all fields'
    } else {
      try {
        axios.post("http://localhost:3001/addCharity", {
          name: name,
          description: description,
          link: link,
          location: location,
        });
        setShow(false);
        successToast(); // if it sends the data it will show a successful toast
      } catch (error) {
        failedToast(); // will show failed to send toast
        console.log(error);
      }
    }
  };
  // the input form below allows the admin to add a charity with all of the relevant details to the list of charities displayed on the website
  return (
    <>
      <Button
        className="pageButtonStyling"
        variant="primary"
        onClick={handleShow}
      >
        Add New
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Charity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Charity Name</Form.Label>
              <Form.Control
                placeholder={"Charity name"}
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Form.Label>Website Link</Form.Label>
              <Form.Control
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />

              <Form.Label>Location</Form.Label>
              <Form.Control
                placeholder="e.g. South Belfast"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
