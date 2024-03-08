import Modal from "react-bootstrap/Modal";
import "../stylesheets/stylesheet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { ImBin2 } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useConfirm from "./confirmDialogue";

// this profiles modal will allow the admin to remove accounts that they feel need deleted, either based on their request or being reported
function ProfilesModal({ show, onClose }) {
  const [profile, setProfile] = useState([]);
  const successToast = () => toast.success("User Deleted");
  const failedToast = () => toast.error("Error, User Failed to Delete");
  const [message, setMessage] = useState();
  const [Dialog, confirmDelete] = useConfirm("Are you sure?", message);

  // gets all of the users of waste not
  useEffect(() => {
    axios
      .get(`http://localhost:3001/getAllUsers`)
      .then((profile) => {
        setProfile(profile.data);
      })
      .catch((error) => console.error(error));
  }, []);

  // this will bring up a confirm dialog and then remove the user
  const removeUser = async (user) => {
    let itemRemoved;
    setMessage(`Are you sure you want to delete ${user.email}`);
    const ans = await confirmDelete();
    if (ans) {
      try {
        await axios.delete(`http://localhost:3001/removeUser/${user._id}`);
        itemRemoved = true;
        successToast();
      } catch (err) {
        itemRemoved = false;
        failedToast();
        console.log(err);
      }
    } else {
      failedToast();
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Profiles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* this will map all of the users with basic detalis to allow the admin to identify who is who */}
          {profile?.map((user) => (
            <div key={user?.id} className="userContainer">
              <ImBin2
                className="deleteUserIcon"
                onClick={(e) => removeUser(user)}
              />
              <img src={user?.pic} alt="userImage" className="chatUserImage" />
              <div style={{ marginLeft: "10px" }}>
                <p
                  style={{
                    textAlign: "start",
                    marginTop: "5px",
                    fontSize: "15px",
                  }}
                >
                  {user.fName + " " + user.lName}{" "}
                </p>
                <p
                  style={{
                    textAlign: "start",
                    marginTop: "-13px",
                    fontSize: "14px",
                  }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          ))}
          <Dialog />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProfilesModal;
