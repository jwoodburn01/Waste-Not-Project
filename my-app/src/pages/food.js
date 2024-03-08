import React, { useState, useEffect } from "react";
import { ButtonGroup, Col, Row } from "react-bootstrap";
import "../stylesheets/stylesheet.css";
import CardComponent from "../components/card";
import axios from "axios";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InputItemForm from "../components/addItemForm";
import ItemPage from "../pages/itemPage";
import Button from "react-bootstrap/Button";
import InputBase from "@mui/material/InputBase";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/loading";
import ColoredLine from "../components/horizontalLine";
import Dropdown from "react-bootstrap/Dropdown";
import Help from "../components/helpButton";

// this file holds the food page, it will show the search bar and filtering buttons as well as the food items listed
function Food() {
  const [food, setFood] = useState([]);
  const [availableFood, setAvailableFood] = useState([]);
  const unsortedData = availableFood;
  const [sortedData, setSortedData] = useState(unsortedData);
  const [sortActive, setSortActive] = useState(false);
  let buttonVariantOutline = "outline-success";
  const [buttonVariant, setButtonVariant] = useState(buttonVariantOutline);
  const [viewActive, setViewActive] = useState(false);
  let buttonVariantOutlineList = "outline-warning";
  const [buttonVariantList, setButtonVariantList] = useState(
    buttonVariantOutlineList
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const userInfo = localStorage.getItem("userInfo");
  const navigate = useNavigate();
  const [viewLabel, setViewLabel] = useState("Card View");
  const [catSelected, setCatSelected] = useState(null);

  // if the user isnt logged in they will be sent back to the home page
  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  // this returns the food items, if there is no search it will return everything and will change when the search is edited
  useEffect(() => {
    axios
      .get(`http://localhost:3001/getFood?q=${search}`)
      .then((food) => {
        setFood(food.data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [search]);

  // this will remove any items that have been reserved, to only show available items
  useEffect(() => {
    setAvailableFood([...food.filter((item) => item.reserved === false)]);
  }, [food]);

  // this will sort the data by name and also change the button type so the user can see when the data is filtered
  const toggleSort = () => {
    if (sortActive) {
      //Unsorting the data by re-sorting it by the _id
      let unsortedData = sortedData.sort((a, b) => {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        return 0;
      });
      setButtonVariant(buttonVariantOutline); // sets the button type
      setSortedData(unsortedData);
      setSortActive((a) => !a);
    } else {
      let sortedData = unsortedData.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      setButtonVariant("success"); // sets the button type to filled
      setSortedData(sortedData);
      setSortActive((a) => !a);
    }
  };

  // the toggle view will change the card type to let the user see both horizontal cards and vertical ones
  const toggleView = () => {
    if (viewActive) {
      setButtonVariantList(buttonVariantOutlineList);
      setViewLabel("Card View");
      setViewActive((a) => !a);
    } else {
      setButtonVariantList("warning");
      setViewLabel("List View");
      setViewActive((a) => !a);
    }
  };

  // this will let the user filter by allergens
  const handleSelect = (eventKey) => {
    setCatSelected(eventKey);
  };

  // will show ones not selected so the user can hide what they are alergic too
  const filterFood = () => {
    if (!catSelected) {
      return availableFood;
    }

    return availableFood.filter((allergen) => {
      if (catSelected === "Nuts" && !allergen.nuts) {
        return true;
      }
      if (catSelected === "Eggs" && !allergen.egg) {
        return true;
      }
      if (catSelected === "Dairy" && !allergen.dairy) {
        return true;
      }
      if (catSelected === "Wheat" && !allergen.wheat) {
        return true;
      }
      if (catSelected === "Shell Fish" && !allergen.shellFish) {
        return true;
      }

      return false;
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  } else {
    return (
      <Row>
        <Col>
          <Row>
            <h1 className="heading">Food</h1>
          </Row>
          <Row>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Food"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <ButtonGroup style={{ width: "78vh" }}>
              {/* Add item form */}
              <InputItemForm /> 

              {/* Filtering by name button */}
              <Button
                variant={buttonVariant}
                onClick={toggleSort}
                className="pageButtonStyling"
              >
                A-Z
              </Button>
              <Button
                className="pageButtonStyling"
                variant={buttonVariantList}
                onClick={toggleView}
              >
                {viewLabel}
              </Button>

              {/* Dropdown for the allergens */}
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle
                  variant="success"
                  // id="dropdown-basic"
                  className="pageButtonStyling"
                >
                  {catSelected || "Allergens"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item eventKey="">Select</Dropdown.Item>
                  <Dropdown.Item eventKey="Nuts">Nuts</Dropdown.Item>
                  <Dropdown.Item eventKey="Eggs">Eggs</Dropdown.Item>
                  <Dropdown.Item eventKey="Dairy">Dairy</Dropdown.Item>
                  <Dropdown.Item eventKey="Wheat">Wheat</Dropdown.Item>
                  <Dropdown.Item eventKey="Shell Fish">
                    Shell Fish
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Help />
            </ButtonGroup>
            <ColoredLine />
          </Row>
          <Row className="localCharityRow">
            {filterFood().map(
              (food, index) => (
                console.log(food),
                (
                  // card component with the 2 available card types
                  <CardComponent
                    name={food.name}
                    description={food.description}
                    image={food.image}
                    itemLink={(event) =>
                      (window.location.href = "/item/" + food._id)
                    }
                    location={food.location}
                    id={food._id}
                    viewList={viewActive}
                    dairy={food?.dairy}
                    wheat={food?.wheat}
                    nuts={food?.nuts}
                    shellFish={food?.shellFish}
                    egg={food?.egg}
                  />
                )
              )
            )}{" "}
          </Row>
        </Col>
      </Row>
    );
  }
}
export default Food;
