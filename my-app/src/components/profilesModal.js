import Modal from 'react-bootstrap/Modal';
import "../stylesheets/stylesheet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { ImBin2 } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useConfirm from './confirmDialogue';

function ProfilesModal({show, onClose}) {

  const [profile, setProfile] = useState([]);
  const successToast = () => toast.success("User Deleted");
  const failedToast = () => toast.error("Error, User Failed to Delete");
  const [message, setMessage] = useState();
  const [Dialog, confirmDelete] = useConfirm(
    'Are you sure?',
    message
  ) 

    useEffect(() => {
        axios
          .get(`http://localhost:3001/getAllUsers`)
          .then((profile) => {
            setProfile(profile.data);
          })
          .catch((error) => console.error(error));
      }, []);

      console.log(profile);

      const removeUser = async (user) => {
        let itemRemoved;
        setMessage(`Are you sure you want to delete ${user.email}`);
        const ans = await confirmDelete()
        if (ans) {
          try {
            await axios.delete(`http://localhost:3001/removeUser/${user._id}`)
            itemRemoved = true;
            successToast();
          } catch (err) {
    
            itemRemoved = false;
            failedToast();
            console.log(err);
    
    
          }
        }
        else {

        }
        // if (window.confirm(`Are you sure you want to delete ${user.email}`)) {
        //   try {
        //     await axios.delete(`http://localhost:3001/removeUser/${user._id}`)
        //     itemRemoved = true;
        //     successToast();
        //   } catch (err) {
    
        //     itemRemoved = false;
        //     failedToast();
        //     console.log(err);
    
    
        //   }
    
        //   // if (itemRemoved) {
        //   //   alert('Charity has been deleted from the system!');
        //   //   window.location.reload();
        //   // } else {
        //   //   alert('Charity has failed to delete.');
        //   // }
        // } else {
    
        // }
      };

  return (
    <>
    

      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Profiles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {profile?.map((user) => (
            <div key={user?.id} className="userContainer" >
              <ImBin2 className="deleteUserIcon" onClick={e => removeUser(user)}/>
              <img src={user?.pic} alt="userImage" className="chatUserImage" />
              <div style={{ marginLeft: "10px" }}>
                <p style={{ textAlign: "start", marginTop: "5px", fontSize: "15px" }}>
                  {user.fName + " " + user.lName}{" "}
                </p>
                <p style={{ textAlign: "start", marginTop: "-13px", fontSize: "14px" }}>
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