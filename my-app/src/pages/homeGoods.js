import React, { useState, useEffect } from "react";
import { ButtonGroup, Col, Row } from "react-bootstrap";
import "../stylesheets/stylesheet.css";
import CardComponent from "../components/card";
import axios from "axios";
import InputItemForm from "../components/addItemForm";
import Button from "react-bootstrap/Button";
import InputBase from "@mui/material/InputBase";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/loading";
import ColoredLine from "../components/horizontalLine";
import Dropdown from "react-bootstrap/Dropdown";
import Help from "../components/helpButton";

function Food() {
  const [homeGoods, setHomeGoods] = useState([]);
  const [availableGoods, setAvailableGoods] = useState([]);
  const unsortedData = availableGoods;
  const [sortedData, setSortedData] = useState(unsortedData);
  const [sortActive, setSortActive] = useState(false);
  const [viewActive, setViewActive] = useState(true);
  let buttonVariantOutline = "outline-success";
  let buttonVariantOutlineList = "outline-warning";
  let buttonVariantFilledList = "warning";
  const [buttonVariant, setButtonVariant] = useState(buttonVariantOutline);
  const [buttonVariantList, setButtonVariantList] = useState(
    buttonVariantOutlineList
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const userInfo = localStorage.getItem("userInfo");
  const navigate = useNavigate();
  const [viewLabel, setViewLabel] = useState("List View");
  const categories = [
    { name: "Furniture" },
    { name: "Kitchen/Dining" },
    { name: "Lighting" },
    { name: "Storage" },
    { name: "Decor" },
    { name: "Miscellaneous" },
  ];
  const [catSelected, setCatSelected] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getHomeGoods?q=${search}`)
      .then((homeGoods) => {
        setHomeGoods(homeGoods.data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [search]);

  useEffect(() => {
    setAvailableGoods([
      ...homeGoods.filter((goods) => goods.reserved === false),
    ]);
  }, [homeGoods]);

  const toggleSort = () => {
    if (sortActive) {
      //Unsorting the data by re-sorting it by the _id
      let unsortedData = sortedData.sort((a, b) => {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        return 0;
      });
      setButtonVariant(buttonVariantOutline);
      setSortedData(unsortedData);
      setSortActive((a) => !a);
    } else {
      let sortedData = unsortedData.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      setButtonVariant("success");
      setSortedData(sortedData);
      console.log("Sorted Data :" + sortedData);
      setSortActive((a) => !a);
    }
  };

  const toggleView = () => {
    if (viewActive) {
      setButtonVariantList(buttonVariantFilledList);
      setViewLabel("Card View");
      setViewActive((a) => !a);
    } else {
      setButtonVariantList(buttonVariantOutlineList);
      setViewLabel("List View");
      setViewActive((a) => !a);
    }
  };

  const handleSelect = (eventKey) => {
    setCatSelected(eventKey);
  };

  const filterGoods = () => {
    if (!catSelected) {
      return availableGoods;
    }

    return availableGoods.filter((category) => {
      if (catSelected === "Furniture" && category.furniture) {
        return true;
      }
      if (catSelected === "Kitchen/Dining" && category.kitchen) {
        return true;
      }
      if (catSelected === "Lighting" && category.lighting) {
        return true;
      }
      if (catSelected === "Storage" && category.storage) {
        return true;
      }
      if (catSelected === "Decor" && category.decor) {
        return true;
      }
      if (catSelected === "Miscellaneous" && category.miscellaneous) {
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
            <h1 className="heading">Home Goods</h1>
          </Row>
          <Row>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Home Goods"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ButtonGroup style={{ width: "78vh" }}>
              <InputItemForm />
              <Button
                className="pageButtonStyling"
                variant={buttonVariant}
                onClick={toggleSort}
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
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle
                  variant="success"
                  className="pageButtonStyling"
                >
                  {catSelected || "Categories"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item eventKey="">Select</Dropdown.Item>
                  {categories.map((category, index) => (
                    <Dropdown.Item eventKey={category.name}>
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Help />
            </ButtonGroup>

            <ColoredLine />
          </Row>
          <Row className="localCharityRow">
              {filterGoods().map((homeGoods, index) => (
                <CardComponent
                  name={homeGoods.name}
                  description={homeGoods.description}
                  image={homeGoods.image}
                  itemLink={(event) =>
                    (window.location.href = "/item/" + homeGoods._id)
                  }
                  id={homeGoods._id}
                  location={homeGoods.location}
                  viewList={viewActive}
                />
              ))}
          </Row>
        </Col>
      </Row>
    );
  }
}
export default Food;
