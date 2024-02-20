// For the file upload for the picture updating use thie to get it to work https://www.youtube.com/watch?v=iw5RSIflYGU&list=PLKhlp2qtUcSYC7EffnHzD-Ws2xG-j3aYo&index=11
import { React, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Card } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { id } = useParams();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  const [profile, setProfile] = useState("");
  const [search, setSearch] = useState("");
  const [food, setFood] = useState([]);
  const [homeGoods, setHomeGoods] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const spoiler = useRef([]);

  const onHover = (index, sp) => {
    sp.current[index].classList.remove("disabledSpoilerContainer");
  };

  const onLeave = (index, sp) => {
    sp.current[index].classList.add("disabledSpoilerContainer");
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/profileDetails/${id}`)
      .then((profile) => setProfile(profile.data))
      .catch((error) => console.error(error));
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getFood?q=${search}`)
      .then((food) => {
        setFood(food.data);
      })
      .catch((error) => console.error(error));
  }, [search]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getHomeGoods?q=${search}`)
      .then((homeGoods) => {
        setHomeGoods(homeGoods.data);
      })
      .catch((error) => console.error(error));
  }, [search]);

  useEffect(() => {
    setAllItems([
      ...food.filter((food) => food.userId === id),
      ...homeGoods.filter((goods) => goods.userId === id),
    ]);
  }, [food, homeGoods]);

  return (
    <Row>
      <Col>
        {/* <Card style={{ width: '60rem' }}>
          <Card.Img variant="top" src={profile?.pic} />
          <Card.Body>
            <Card.Title>
              {profile?.fName + " " + profile?.lName}
            </Card.Title>
            <Card.Text>
              Waste Not member since {profile.createdAt?.slice(0, 4)}
            </Card.Text>
          </Card.Body>
        </Card> */}
        <Card style={{ width: "100%", padding: "1vh", left: "1%" }}>
          <Row>
            <Col style={{ textAlign: "center" }}>
              <Card.Img
                variant="bottom"
                src={profile.pic}
                style={{
                  width: "auto",
                  height: "22vh",
                  objectFit: "contain",
                  borderRadius: "60%",
                }}
              />
            </Col>
            <Col>
              <Card.Body>
                <Card.Title>{profile?.fName + " " + profile?.lName}</Card.Title>
                <Card.Text>
                  Waste Not member since {profile.createdAt?.slice(0, 4)}
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col>
        <Card>
          <Card.Body>
            <Card.Title>User Details</Card.Title>
            <p>{profile?.fName + " " + profile?.lName}</p>
            <p>{profile?.email}</p>
          </Card.Body>
        </Card>
      </Col>
      <Row>
        <h2 className="heading">User's Current Listings</h2>
        {allItems.length > 0 ? (
          <>
            {allItems.map((item, index) => (
              <Card className="itemCard" style={{ width: "15rem" }}>
                <div
                  className="hoverContainer disabledSpoilerContainer"
                  onMouseEnter={() => onHover(index, spoiler)}
                  onMouseLeave={() => onLeave(index, spoiler)}
                  ref={(el) => (spoiler.current[index] = el)}
                  onClick={(event) =>
                    (window.location.href = "/item/" + item._id)
                  }
                >
                  {item.name}
                </div>
                <Card.Img
                  className="cardImage"
                  style={{ objectFit: "contain", height: "15rem" }}
                  variant="top"
                  src={item.image}
                  onClick={(event) =>
                    (window.location.href = "/item/" + item._id)
                  }
                />
              </Card>
            ))}
          </>
        ) : (
          <>
            <h5 className="heading">No Listings to display</h5>
          </>
        )}
      </Row>
    </Row>
  );
}
export default UserProfile;
