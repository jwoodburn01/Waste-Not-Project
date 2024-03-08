// For the file upload for the picture updating use thie to get it to work https://www.youtube.com/watch?v=iw5RSIflYGU&list=PLKhlp2qtUcSYC7EffnHzD-Ws2xG-j3aYo&index=11
import { React, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UpdateProfileForm from "../components/updateProfileForm";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../actions/userActions";
import { Col, Row } from "react-bootstrap";
import { Card } from "react-bootstrap";
import axios from "axios";
import { TbLogin } from "react-icons/tb";

// the profile page shows the user their own profile, with the ability to edit it as well as being shown items thay have listed and items they have reserved
function Profile() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [profile, setProfile] = useState("");
  const [search, setSearch] = useState("");
  const [food, setFood] = useState([]);
  const [homeGoods, setHomeGoods] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [reservedItems, setReservedItems] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const spoiler = useRef([]);
  const spoilerReserved = useRef([]);

  // these 2 methods allow for the hovering of the items to be shown, it adds/ removes css when hovered
  const onHover = (index, sp) => {
    sp.current[index].classList.remove("disabledSpoilerContainer");
  };

  const onLeave = (index, sp) => {
    sp.current[index].classList.add("disabledSpoilerContainer");
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  // gets the profile details of the user logged in
  useEffect(() => {
    axios
      .get(`http://localhost:3001/profileDetails/${userInfo._id}`)
      .then((profile) => setProfile(profile.data))
      .catch((error) => console.error(error));
  }, [userInfo]);

  // gets the food and the home goods
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

  // will filter the items by if he is the owner and then it will add them to the allItems and reserved items if they have reserved it
  useEffect(() => {
    setAllItems([
      ...food.filter((food) => food.userId === userInfo._id),
      ...homeGoods.filter((goods) => goods.userId === userInfo._id),
    ]);

    setReservedItems([
      ...food.filter((food) => food.reservedBy === userInfo._id),
      ...homeGoods.filter((goods) => goods.reservedBy === userInfo._id),
    ]);
  }, [food, homeGoods]);

  return (
    <Row className="localCharityRow">
      <Col>
        <Card style={{ width: "100%", padding: "1vh", left: "1%" }}>
          <Row>
            <Col style={{ textAlign: "center" }}>
              <Card.Img
                variant="bottom"
                src={userInfo.pic}
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Card.Title>
                      {userInfo?.fName + " " + userInfo?.lName}
                    </Card.Title>
                  </div>
                  <div>
                    <TbLogin
                      style={{ height: "3vh", width: "3vh" }}
                      className="profilePageIcon"
                      onClick={logoutHandler}
                    />
                  </div>
                </div>
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
            <Card.Title>
              Profile Details
              <UpdateProfileForm />
            </Card.Title>
            <p>{userInfo?.fName + " " + userInfo?.lName}</p>
            <p>{userInfo?.email}</p>
          </Card.Body>
        </Card>
      </Col>
      <Row>
        {/* shows this users current listings */}
        <h2 className="heading">Your Current Listings</h2>
        {allItems.length > 0 ? (
          <>
            {allItems.map((item, index) => (
              <Card
                className="itemCard"
                style={{ width: "15rem", height: "fit-content" }}
              >
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
                  variant="top"
                  src={item.image}
                  onClick={(event) =>
                    (window.location.href = "/item/" + item._id)
                  }
                  style={{ objectFit: "contain", height: "15rem" }}
                />
              </Card>
            ))}
          </>
        ) : (
          <>
            <h5 className="heading">No Listings to display</h5>
            {/* this shows if there isnt any listings to do with the user */}
          </>
        )}
      </Row>
      <Row>
        {/* Shows items that the user has claimed */}
        <h2 className="heading">Your Claimed Listings</h2>
        {reservedItems.length > 0 ? (
          <>
            {reservedItems.map((item, index) => (
              <Card
                className="itemCard"
                style={{ width: "15rem", height: "fit-content" }}
              >
                <div
                  className="hoverContainer disabledSpoilerContainer"
                  onMouseEnter={() => onHover(index, spoilerReserved)}
                  onMouseLeave={() => onLeave(index, spoilerReserved)}
                  ref={(el) => (spoilerReserved.current[index] = el)}
                  onClick={(event) =>
                    (window.location.href = "/item/" + item._id)
                  }
                >
                  {item.name}
                </div>
                <Card.Img
                  variant="top"
                  src={item.image}
                  onClick={(event) =>
                    (window.location.href = "/item/" + item._id)
                  }
                  style={{ objectFit: "contain", height: "15rem" }}
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
export default Profile;
