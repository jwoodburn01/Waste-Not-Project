import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col } from "react-bootstrap";

function InputItemForm() {
  // the variables used will be initialised below, the variables for both the allergens and the categories for both sets of items
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [pic, setPic] = useState("");
  const [picMessage, setPicMessage] = useState("");
  const [location, setLocation] = useState("");
  const [dairy, setDairy] = useState(false);
  const [wheat, setWheat] = useState(false);
  const [shellFish, setShellFish] = useState(false);
  const [nuts, setNuts] = useState(false);
  const [egg, setEgg] = useState(false);
  const [furniture, setFurniture] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [lighting, setLighting] = useState(false);
  const [storage, setStorage] = useState(false);
  const [decor, setDecor] = useState(false);
  const [miscellaneous, setMiscellaneous] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  // creating the toasts to be used for success and fail
  const successToast = () => toast.success("Item Added");
  const failedToast = () => toast.error("Error, Item Failed to Add");
  const errorToast = () => toast.error("Error, Please fill in all fields, ensure the image is JPG or PNG");

  // the handle submit below works for both food and home goods
  // using the type dropdown it uses the different url for each and sends the entered data to it.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type || !name || !location || !pic) {
      errorToast();
    } else {
      try {
        if (type === "food") {
          // food items post
          console.log(shellFish, egg, wheat, nuts, dairy);
          axios.post("http://localhost:3001/addFood", {
            name: name,
            description: description,
            image: pic,
            location: location,
            userId: userInfo._id,
            reserved: false,
            reservedBy: "",
            dairy: dairy,
            wheat: wheat,
            shellFish: shellFish,
            nuts: nuts,
            egg: egg,
          });
          successToast();
        } else {
          // home goods post
          axios.post("http://localhost:3001/addHomeGoods", {
            name: name,
            description: description,
            image: pic,
            location: location,
            userId: userInfo._id,
            reserved: false,
            reservedBy: "",
            furniture: furniture,
            kitchen: kitchen,
            lighting: lighting,
            storage: storage,
            decor: decor,
            miscellaneous: miscellaneous,
          });
          successToast();
        }
      } catch (error) {
        failedToast();
        console.error(error);
      }
      // resetting the values to blank
      setType("");
      setName("");
      setDescription("");
      setPic("");
      setLocation("");
      setShow(false);
    }
  };

  // the images i have used cloudinary to host the image and it will return the url to be saved in my mongo server as the url
  const postPic = (pics) => {
    if (!pics) {
      return setPicMessage("Please select an image");
    }
    setPicMessage(null);
    // this only accepts a jpeg or a png
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      // these appends make sure it saved to my cloud
      data.append("file", pics);
      data.append("upload_preset", "WasteNot");
      data.append("cloud_name", "diodvhgrg");
      // the fetch then sends the image to it
      fetch("https://api.cloudinary.com/v1_1/diodvhgrg/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // the returned url is saved to the picture url
          let newPic = data.url.toString();
          setPic(newPic);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return setPicMessage("Please select an image");
    }
  };

  // if the type chosen is food it will then display these allergens for the user to choose from
  const allergens = (
    <Form.Group>
      <Form.Label>Allergen Information</Form.Label>
      <Row>
        <Col>
          <Form.Check label={`Dairy`} onChange={() => setDairy(!dairy)} />
          <Form.Check label={`Wheat`} onChange={() => setWheat(!wheat)} />
          <Form.Check label={`Nuts`} onChange={() => setNuts(!nuts)} />
        </Col>

        <Col>
          <Form.Check label={`Eggs`} onChange={() => setEgg(!egg)} />
          <Form.Check
            label={`Shell Fish`}
            onChange={() => setShellFish(!shellFish)}
          />
        </Col>
      </Row>
    </Form.Group>
  );

  // if the user selects home goods it will display the calegories for the user to choose from from radio buttons to ensure only 1 can be selected
  const categories = (
    <Form.Group>
      <Form.Label>Category Selection</Form.Label>
      <Row>
        <Col>
          <Form.Check
            label={`Furniture`}
            onChange={() => setFurniture(!furniture)}
            type="radio"
            name="category"
          />
          <Form.Check
            label={`Kitchen/Dining`}
            onChange={() => setKitchen(!kitchen)}
            type="radio"
            name="category"
          />
          <Form.Check
            label={`Lighting`}
            onChange={() => setLighting(!lighting)}
            type="radio"
            name="category"
          />
        </Col>

        <Col>
          <Form.Check
            label={`Storage`}
            onChange={() => setStorage(!storage)}
            type="radio"
            name="category"
          />
          <Form.Check
            label={`Decor`}
            onChange={() => setDecor(!decor)}
            type="radio"
            name="category"
          />
          <Form.Check
            label={`Miscellaneous`}
            onChange={() => setMiscellaneous(!miscellaneous)}
            type="radio"
            name="category"
          />
        </Col>
      </Row>
    </Form.Group>
  );

  // this form will be used in both the food and home goods pages so is made universal to save making 1 different forms
  return (
    <>
      {/* the show button is here so it saves me passing props */}
      <Button
        variant="primary"
        onClick={handleShow}
        className="pageButtonStyling"
      >
        Add New
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Item Type</Form.Label>
              <Form.Select
                aria-label="Item Type Select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Select...</option>
                <option value="food">Food</option>
                <option value="homeGoods">Home Goods</option>
              </Form.Select>
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                placeholder={
                  type === "food" ? "e.g. Bread Loaf" : "e.g. Old Sofa"
                }
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

              {type === "food" ? allergens : ""}
              {type === "homeGoods" ? categories : ""}

              <Form.Label>Item Image</Form.Label>
              <Form.Control
                id="custom-file"
                type="file"
                label="Upload Item Picture"
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
            Post
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InputItemForm;
