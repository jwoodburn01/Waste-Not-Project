import Spinner from 'react-bootstrap/Spinner';
import '../stylesheets/stylesheet.css'

function LoadingSpinner({size = 100}) {
  return (
    <div className='loadingSpinner'
        // style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     width: "100%",
        //     height: "100%",
        // }}
    >

        <Spinner 
    style={{width: size , height: size}} animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </div>
    
  );
}

export default LoadingSpinner;