import Spinner from 'react-bootstrap/Spinner';
import '../stylesheets/stylesheet.css'

// this loading spinner will be set before data is loaded fully to let the user know that progress is being made rather than data just appearing. 
function LoadingSpinner({size = 100}) {
  return (
    <div className='loadingSpinner'>

        <Spinner 
    style={{width: size , height: size}} animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    </div>
    
  );
}

export default LoadingSpinner;