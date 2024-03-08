import Slideshow from "../components/slideShow";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BackgroundVideo from "../components/backgroundVideo";
import { Col, Row } from "react-bootstrap";
import HomePageIcons from "../components/homepageIcons";
import FoodItemsHomePage from "../components/foodItemsHomePage";
import HomeGoodsHomePage from "../components/homeGoodHomePage";
import { useNavigate } from "react-router-dom";
import ButtonBaseDemo from "../components/imageButtons";

// this is the home page
function Home() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();

  // making a username out of the first and last names
  let userNames;
  if (userInfo) {
    userNames = userInfo?.fName + " " + userInfo?.lName;
  } else {
    userNames = "";
  }

  // will allow the user to navigate to the different pages if they hit the "See more"
  const homeGoodsNav = () => {
    navigate("/homeGoods");
  };

  const foodNav = () => {
    navigate("/food");
  };

  return (
    <section>
        {/* the background video that shows on entering the website */}
      <BackgroundVideo /> 

      <h2 className="heading">Welcome to Waste Not {userNames} </h2>

      <p className="heading">
        Here at Waste Not we are trying to connect people in need with the rest
        of the local community. Our aim is to "bring the community closer by
        reducing food waste". We hope to do this by encouraging everyone who has
        any spare food left over or soon to be out of date that wont get ate to
        donate it. This can be through donating to a local food bank and/or
        posting a collection on our website to let people in your area get a
        chance to collect your left over food.
      </p>
      {/* the home page icons are some statistics about poverty in the UK and NI */}
      <HomePageIcons />
      {/* the local news are charity articles shown and linked in a slideshow */}
      <h2 className="heading">Local Charity News</h2>
      <Slideshow />
      <Row>
        <Col>
        {/* a link to the home goods and food pages with image buttons */}
          <h2 className="heading">Our Items</h2>
        </Col>
        <ButtonBaseDemo />
      </Row>
      <Row>
        <Col>
        {/* showing a few of each food and home goods */}
          <h3 className="heading">Some of the Food Items</h3>
          <p className="seeMoreText" onClick={foodNav}>
            See More
          </p>
        </Col>
        <FoodItemsHomePage />
      </Row>
      <Row>
        <Col>
          <h3 className="heading">Some of the Home Items</h3>
          <p className="seeMoreText" onClick={homeGoodsNav}>
            See More
          </p>
        </Col>
        <HomeGoodsHomePage />
      </Row>
    </section>
  );
}
export default Home;
