import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useSelector } from "react-redux";
import { MdOutlineEdit } from "react-icons/md";
import { Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

// this form will update both food and home good items, it will show only the Name, Description, Image and Location for home good items as a category should have been selected previously
// for food however users could have forgot that it included dairy so may need to add that, in this case allergens can be updated
function UpdateItemForm(props) {
  // getting the data from the item page via props
  const {
    nameInitial,
    descriptionInitial,
    imageInitial,
    locationInitial,
    idInitial,
    dairyInitial,
    wheatInitial,
    nutsInitial,
    eggsInitial,
    shellFishInitial,
  } = props;
  console.log(nameInitial, idInitial);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [picMessage, setPicMessage] = useState("");
  const [location, setLocation] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [dairy, setDairy] = useState("");
  const [wheat, setWheat] = useState("");
  const [shellFish, setShellFish] = useState("");
  const [nuts, setNuts] = useState("");
  const [egg, setEgg] = useState("");
  const successToast = () => toast.success("Item Updated");
  const failedToast = () => toast.error("Error, Item Failed to Update");

  // setting the initial states of the data to what the props sent are
  useEffect(() => {
    setId(idInitial);
    setName(nameInitial);
    setDescription(descriptionInitial);
    setImage(imageInitial);
    setLocation(locationInitial);
    setDairy(dairyInitial);
    setWheat(wheatInitial);
    setShellFish(shellFishInitial);
    setNuts(nutsInitial);
    setEgg(eggsInitial);
  }, [
    idInitial,
    nameInitial,
    descriptionInitial,
    imageInitial,
    locationInitial,
    dairyInitial,
    wheatInitial,
    shellFishInitial,
    nutsInitial,
    eggsInitial,
  ]);
  // the useEffect will re run if any of the initial states are updated

  // the handle submit takes the data and will send it to the server, if the allergens exist it will send them as well, the allergens will only exist in food items
  const handleSubmit = (e) => {
    e.preventDefault();
    let postURL = "";
    postURL = "http://localhost:3001/updateItem";

    const allergenList = {};
    dairy !== undefined && (allergenList.dairy = dairy);
    wheat !== undefined && (allergenList.wheat = wheat);
    shellFish !== undefined && (allergenList.shellFish = shellFish);
    nuts !== undefined && (allergenList.nuts = nuts);
    egg !== undefined && (allergenList.egg = egg);

    console.log(allergenList);
    axios
      .post(postURL, {
        name: name,
        description: description,
        image: image,
        location: location,
        id,
        id,
        allergenList,
      })

      .then(() => {
        successToast();
        handleClose();
      })
      .catch((error) => {
        failedToast();
        console.log(error);
      });
  };

  // the post pic will send the selected image to cloudinary and return a url to be saved in mongo
  const postPic = (pics) => {
    if (!pics) {
      return setPicMessage("Please select an image");
    }
    setPicMessage(null);

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "WasteNot");
      data.append("cloud_name", "diodvhgrg");
      fetch("https://api.cloudinary.com/v1_1/diodvhgrg/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          let newPic = data.url.toString();
          setImage(newPic);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return setPicMessage("Please select an image");
    }
  };

  // the allergens will only show if the allergens listed below exist
  const allergens =
    dairy || wheat || shellFish || nuts || egg ? (
      <Form.Group>
        <Form.Label>Allergen Information</Form.Label>
        <Row>
          <Col>
            <Form.Check
              label={`Dairy`}
              checked={dairy}
              onChange={() => setDairy(!dairy)}
            />
            <Form.Check
              label={`Wheat`}
              checked={wheat}
              onChange={() => setWheat(!wheat)}
            />
            <Form.Check
              label={`Nuts`}
              checked={nuts}
              onChange={() => setNuts(!nuts)}
            />
          </Col>

          <Col>
            <Form.Check
              label={`Eggs`}
              checked={egg}
              onChange={() => setEgg(!egg)}
            />
            <Form.Check
              label={`Shell Fish`}
              checked={shellFish}
              onChange={() => setShellFish(!shellFish)}
            />
          </Col>
        </Row>
      </Form.Group>
    ) : null;

  // this retuen will show a form dialog and let the user update their items
  return (
    <>
      <MdOutlineEdit onClick={handleShow} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Label>Item Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {allergens}

              <Form.Label>Item Image</Form.Label>
              <Form.Control
                id="custom-file"
                type="file"
                label="Upload Profile Picture"
                onChange={(e) => postPic(e.target.files[0])}
              />

              <Form.Label>Item Location</Form.Label>
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
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateItemForm;
