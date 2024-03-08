import React from "react";
import { Alert } from "react-bootstrap";

// this const will show an error message in an alert inside both the login and the update profile
const ErrorMessage = ({ variant = "info", children}) => {

    return(
        <Alert variant={variant} style={{fontSize: 20}}>
            <strong>{children}</strong>
        </Alert>

    );
};

export default ErrorMessage;