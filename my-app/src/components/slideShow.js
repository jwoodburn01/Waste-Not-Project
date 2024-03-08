import React, { useState, useEffect } from "react";
import { Slide } from "react-slideshow-image";
import { Button } from "@mui/material";
import "react-slideshow-image/dist/styles.css";
import axios from "axios";
import LoadingSpinner from "./loading";

const spanStyle = {
  padding: "20px",
  background: "#fef7e5",
  color: "#000000",
  text: "bold",
};

const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "left",
  backgroundSize: "cover",
  height: "400px",
};

// this is a slideshow i improved from npm, it allows me to show some news and lets me link the websites the articles are from
const Slideshow = () => {
  const [slideImages, setSlideImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // gets the slideshows i have stored on mongo
  useEffect(() => {
    axios
      .get("http://localhost:3001/getSlideshow")
      .then((slideImages) => {
        setSlideImages(slideImages.data);
        setLoading(false);
      })

      .catch((error) => console.error(error));
  }, []);

  // if the website hasnt loaded it will show a spinner there
  if (loading) {
    return <LoadingSpinner />;
  } else {
    return (
      <div className="slide-container">
        <Slide>
          {slideImages.map((slideImage, index) => (
            <div key={index}>
              <div
                className=""
                style={{
                  ...divStyle,
                  backgroundImage: `url(${slideImage.url})`,
                }}
              >
                <table>
                  <tr>
                    <td className="newsTitleCol">
                      <span style={spanStyle}>
                        <h2>{slideImage.caption}</h2>
                        <h4>{slideImage.site}</h4>
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Button
                        className="readNowButton"
                        variant="contained"
                        onClick={() => window.open(slideImage.link, "_blank")}
                      >
                        Read Now
                      </Button>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          ))}
        </Slide>
      </div>
    );
  }
};

export default Slideshow;
