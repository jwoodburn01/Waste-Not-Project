import { IoMdHelpCircleOutline } from "react-icons/io";
import guide from "../guide/Waste Not - Manual.pdf"; 

function Help(){

    const onButtonClick = () => {
     
        // using Java Script method to get PDF file
        fetch(guide).then((response) => {
            response.blob().then((blob) => {
             
                // Creating new object of PDF file
                const fileURL =
                    window.URL.createObjectURL(blob);
                     
                // Setting various property values
                let alink = document.createElement("a");
                alink.href = fileURL;
                alink.download = "Waste Not - Manual.pdf";
                alink.click();
            });
        });
    };

    return (
        <IoMdHelpCircleOutline className="iconButton" onClick={onButtonClick} style={{height:'4vh', width:'4vh'}}/>
    );

}

export default Help;