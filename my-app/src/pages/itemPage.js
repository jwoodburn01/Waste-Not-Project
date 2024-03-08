import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import UpdateItemForm from "../components/updateFoodForm";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutgoingMail } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useConfirm from "../components/confirmDialogue";

function ItemPage() {
  // this item is made to display both food and home goods items
  const { id } = useParams(); // using the id passed from the card
  const [item, setItem] = useState([]);
  const [postOwner, setPostOwner] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const successToast = () => toast.success("Item Deleted");
  const reservedToastSuccess = () => toast.success("Item Reserved");
  const reservedToastFaield = () => toast.success("Item Failed to be Reserved");
  const failedToast = () => toast.error("Error, Item Failed to Delete");
  const [message, setMessage] = useState();
  const [Dialog, confirmDelete] = useConfirm("Are you sure?", message);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  // this looks for the id in food and if its not in it, it will then look for it inside goods
  useEffect(() => {
    axios
      .get(`http://localhost:3001/fetchFood/${id}`)
      .then((res) => {
        if (!res.data) {
          return axios.get(`http://localhost:3001/fetchGoods/${id}`);
        }
        setItem(res.data);
      })
      // secondary res is here as a fall back so if it finds it in goods it will work
      .then((secondaryRes) => {
        if (secondaryRes) {
          setItem(secondaryRes.data);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  // searches for the profile of the id that is associated with the item
  useEffect(() => {
    axios
      .get(`http://localhost:3001/profileDetails/${item.userId}`)
      .then((postOwner) => setPostOwner(postOwner.data))
      .catch((error) => console.error(error));
  }, [item.userId]);

  // this is a mail to with filled in message and subject if the user wants to email the owner, it will take them to outlook with the data filled in
  const emailPostOwner = () => {
    window.location.href = `mailto:${postOwner.email}?subject=Waste Not - ${item.name}&body=${emailMessage}`;
  };

  // will send the user to messages with the post owner set as the current chat
  const messageNavButton = () => {
    navigate(`/messages/${postOwner._id}`);
  };

  // if the user reserves the item the 2 variables will be updated to then hide the item from the list and show it on the profile page
  const setReserved = () => {
    try {
      axios.post("http://localhost:3001/updateItem", {
        id: id,
        reserved: true,
        reservedBy: userInfo._id,
      });
      reservedToastSuccess();
    } catch (error) {
      console.log(error);
      reservedToastFaield();
    }
    // this message will be sent to alert the owner that this user has reserved their item
    let reservedMessage = `Hi, I just reserved your item ${item.name}, I would like to arrange collection.`;
    axios.post("http://localhost:3001/msg", {
      from: userInfo._id,
      to: postOwner._id,
      message: reservedMessage,
    });
    messageNavButton(); // then will relocate them to the chat also
  };

  // if its the post owner viewing the item they will have the option to delte the item
  const deleteItem = async () => {
    let itemRemoved;
    setMessage(`Are you sure you want to delete ${item.name}`);
    const ans = await confirmDelete();
    if (ans) {
      try {
        await axios.delete(`http://localhost:3001/removeItem/${id}`);
        itemRemoved = true;
        navigate(-1);
        successToast();
      } catch (err) {
        itemRemoved = false;
        console.log(err);
        failedToast();
      }
    } else {
    }
  };

  // showing the allergens if they are true with a comma breaking them up
  const allergenList = [];

  if (item.dairy) {
    allergenList.push("Dairy");
  }
  if (item.nuts) {
    allergenList.push("Nuts");
  }
  if (item.shellFish) {
    allergenList.push("ShellFish");
  }
  if (item.egg) {
    allergenList.push("Eggs");
  }
  if (item.wheat) {
    allergenList.push("Wheat");
  }

  let allergenInfo;
  if (allergenList) {
    allergenInfo = `Contains: ${allergenList.join(", ")}`;
  } else {
    allergenInfo = null;
  }

  // showing the item in cards
  return (
    <Row>
      <Col sm="6" className="loginCol">
        <Row className="localCharityRow">
          <Card className="itemPageCard">
            <Card.Img
              className="itemCardImage"
              variant="top"
              src={item.image}
            />
          </Card>
        </Row>
      </Col>
      <Col sm="6">
        <Card className="detailsCard">
          <Card.Body>
            <Card.Title>
              {item.name}
              {postOwner._id === userInfo._id ? (
                <UpdateItemForm
                  nameInitial={item.name}
                  descriptionInitial={item.description}
                  locationInitial={item.location}
                  idInitial={id}
                  imageInitial={item.image}
                  dairyInitial={item.dairy}
                  wheatInitial={item.wheat}
                  nutsInitial={item.nuts}
                  eggsInitial={item.egg}
                  shellFishInitial={item.shellFish}
                />
              ) : (
                ""
              )}
            </Card.Title>
            <Card.Text>
              {item.description}
              {allergenList.length > 0 ? (
                <Card.Text>
                  <b>{allergenInfo}</b>
                </Card.Text>
              ) : (
                ""
              )}
            </Card.Text>
            <Card.Title>Contact {postOwner.fName}</Card.Title>
            <Form.Control
              as="textarea"
              rows={3}
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
            />
            <MdOutgoingMail
              className="itemPageEmail"
              onClick={emailPostOwner}
            />
            <Row>
              {postOwner._id === userInfo._id ? (
                <>
                  <Button
                    variant="danger"
                    className="itemPageReserveButton"
                    onClick={deleteItem}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  {item.reserved ? (
                    <Button
                      className="itemPageReserveButton"
                      variant="success"
                      disabled
                    >
                      Item has been reserved
                    </Button>
                  ) : (
                    <Button
                      className="itemPageReserveButton"
                      variant="success"
                      onClick={setReserved}
                    >
                      Reserve Item
                    </Button>
                  )}
                </>
              )}
            </Row>
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">{item.location}</small>
          </Card.Footer>
        </Card>
        <Card style={{ width: "100%", padding: "1vh", marginTop: "1vh" }}>
          <Row>
            <Col style={{ display: "flex", justifyContent: "center" }}>
              <Card.Img
                variant="bottom"
                src={postOwner.pic}
                style={{
                  width: "auto",
                  height: "25vh",
                  objectFit: "contain",
                }}
              />
            </Col>
            <Col>
              <Card.Body>
                <Card.Title>
                  {postOwner.fName + " " + postOwner.lName}
                </Card.Title>
                <Card.Text>
                  Waste Not User since {postOwner.createdAt?.slice(0, 4)}
                </Card.Text>
                <FaUser
                  className="ItemPageIconProfile"
                  onClick={(e) => navigate(`/userProfile/${postOwner._id}`)}
                />
                <MdOutlineEmail
                  className="ItemPageIconMessage"
                  onClick={messageNavButton}
                />
              </Card.Body>
            </Col>
          </Row>
        </Card>
        <Dialog />
      </Col>
    </Row>
  );
}

export default ItemPage;
