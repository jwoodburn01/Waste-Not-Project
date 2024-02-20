import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { useState } from "react";
import useConfirm from "./confirmDialogue";
import { ToastContainer, toast } from "react-toastify";
import { FaTrashCan } from "react-icons/fa6";

const CardComponent = (props) => {
  const {
    name,
    description,
    image,
    itemLink,
    id,
    location,
    viewList,
    dairy,
    wheat,
    nuts,
    shellFish,
    Egg,
  } = props;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [message, setMessage] = useState();
  const [Dialog, confirmDelete] = useConfirm("Are you sure?", message);
  const successToast = () => toast.success("Item Deleted");
  const failToast = () => toast.error("Failed to Delete Item");

  const deleteItem = async () => {
    setMessage(`Are you sure you want to delete ${name}`);
    const ans = await confirmDelete();
    if (ans) {
      try {
        await axios.delete(`http://localhost:3001/removeItem/${id}`);
        successToast();
      } catch (err) {
        failToast();
        console.log(err);
      }
    } else {
    }
  };

  // only shows the delete button if the user is an admin
  let deleteButton;
  if (userInfo && userInfo.type == "admin") {
    deleteButton = (
      // <Button variant="danger" onClick={deleteItem}>
      //   Delete
      // </Button>
      <FaTrashCan onClick={deleteItem} style={{width:'4vh', height:'4vh'}}/>
    );
  } else {
    deleteButton = null;
  }
  const allergenList = [];

  if (dairy) {
    allergenList.push("Dairy");
  }
  if (nuts) {
    allergenList.push("Nuts");
  }
  if (shellFish) {
    allergenList.push("ShellFish");
  }
  if (Egg) {
    allergenList.push("Eggs");
  }
  if (wheat) {
    allergenList.push("Wheat");
  }

  let allergenInfo;
  if (allergenList) {
    allergenInfo = `Contains: ${allergenList.join(" ,")}`;
  } else {
    allergenInfo = null;
  }

  if (viewList) {
    return (
      <Card
        style={{ width: "80%", padding: "1vh", marginTop: "1vh", left: "10%" }}
      >
        <Row>
          <Col style={{ textAlign: "center" }}>
            <Card.Img
              variant="bottom"
              src={image}
              onClick={itemLink}
              style={{ width: "auto", height: "40vh", objectFit: "contain" }}
            />
          </Col>
          <Col>
            <Card.Body>
              <Card.Title onClick={itemLink}>{name}</Card.Title>
              <Card.Text onClick={itemLink}>
                {description}
                {allergenList.length > 0 ? (
                  <Card.Text>
                    <b>{allergenInfo}</b>
                  </Card.Text>
                ) : (
                  ""
                )}
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
        <Card.Footer>{location}</Card.Footer>
      </Card>
    );
  } else {
    return (
      <Card className="itemCard col-sm-4">
        <Card.Body className=" d-flex flex-column justify-content-center">
          <Card.Img className="cardImage" src={image} onClick={itemLink} />
          <Card.Title>{name}</Card.Title>
          <Card.Text onClick={itemLink}>{description}</Card.Text>
          {allergenList.length > 0 ? (
            <Card.Text>
              <b>{allergenInfo}</b>
            </Card.Text>
          ) : (
            ""
          )}
          <Dialog />
            <div className="binCardIcon">
              {deleteButton}
            </div>
          
        </Card.Body>
        <Card.Footer>{location}</Card.Footer>
      </Card>
    );
  }
};

export default CardComponent;
