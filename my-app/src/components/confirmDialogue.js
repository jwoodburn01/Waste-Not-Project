import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ModalClose from "@mui/joy/ModalClose";
import { Button } from "react-bootstrap";
import { useState } from "react";

// the const below brings up a mui confirm dialog 
const useConfirm = (title, message) => {
  const [promise, setPromise] = useState(null);

  // this method allows the confirm to be set by other classes
  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  // This is the dialog that will pop up using the passed title and message from the file its calling from
  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <ModalClose onClick={handleCancel} />
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
  return [ConfirmationDialog, confirm];
};

export default useConfirm;
