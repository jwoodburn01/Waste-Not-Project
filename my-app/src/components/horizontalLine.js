import "../stylesheets/stylesheet.css";

export default function ColoredLine() {
  // this makes a line for the pages to split the header and the main body
    return (
    <hr 
    style={{
       color: "black",
       height: "1px",
       width:"96%",
       alignItems: "center",
       marginTop:"1vh",
       marginLeft:"2%"
      }}/>
    );

    };