import video from "../images/pexels-julia-m-cameron-6894023 (540p).mp4";
import "../stylesheets/stylesheet.css";
import logo from "../images/waste-notlogo.png";
import { useState, useEffect } from "react";

// the background video is to be shown at the home page when the user enters the website
const BackgroundVideo = () => {
  const [textTransition, setTextTransition] = useState(false);

  // this use effect allows me to show the test after the inital video is loaded, adding a nice effect.
  useEffect(() => {
    setTimeout(() => {
      setTextTransition(true);
    }, 500);
  }, []);

  return (
    <div>
      <div className="videoWrapper">
        <div
          className="homeVideoContent"
          style={{
            opacity: textTransition ? 1 : 0,
            transition: "opacity 0.5s",
          }}
        >
          <img className="logoImage" src={logo} />
          <h2 className="heading">Feed Bellies, Not Bins</h2>
        </div>

        {/* Overlay to make the background video blurred with the text above being above it due to styling */}
        <div className="overlay"></div>
        <video autoPlay loop muted className="backgroundVideo">
          <source src={video} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};
export default BackgroundVideo;
