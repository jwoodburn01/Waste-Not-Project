import React, { useState, useEffect } from 'react';
import { Col, Row } from "react-bootstrap"
import '../stylesheets/stylesheet.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import InputCharityForm from '../components/addCharityForm';
import InputBase from '@mui/material/InputBase';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ColoredLine from '../components/horizontalLine';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useConfirm from '../components/confirmDialogue';

function LocalCharities() {

  const [localCharity, setlocalCharity] = useState([]);
  const unsortedData = localCharity;
  const [sortedData, setSortedData] = useState(unsortedData);
  const [sortActive, setSortActive] = useState(false);
  let buttonVariantOutline = 'outline-success';
  const [buttonVariant, setButtonVariant] = useState(buttonVariantOutline);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const successToast = () => toast.success("Charity Deleted");
  const failedToast = () => toast.error("Error, Charity Failed to Delete");
  const [message, setMessage] = useState();
  const [Dialog, confirmDelete] = useConfirm("Are you sure?", message);

  useEffect(() => {

    if (!userInfo) {
      navigate("/")
    }
  }, [navigate, userInfo])


  useEffect(() => {
    axios.get(`http://localhost:3001/getLocalCharities?q=${search}`)
      .then(localCharity => setlocalCharity(localCharity.data))
      .catch(error => console.error(error));
  }, [search]);

  const deleteCharity = async (charity) => {
    setMessage(`Are you sure you want to delete ${charity.name}`);
    const ans = await confirmDelete();
    if (ans) {
      try {
        await axios.delete(`http://localhost:3001/removeCharity/${charity._id}`)
        successToast();
      } catch (err) {

        
        failedToast();
        console.log(err);
      }
    } else {

    }
  };


  const toggleSort = () => {
    // setSortActive(a => !a);
    if (sortActive) {
      //Unsorting the data by re-sorting it by the _id
      let unsortedData = sortedData.sort((a, b) => {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        return 0;
      })
      setButtonVariant(buttonVariantOutline)
      setSortedData(
        unsortedData
      );
      console.log("UnsortedData:" + unsortedData)
      setSortActive(a => !a)

    } else {

      let sortedData = unsortedData.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      })
      setButtonVariant('success')
      setSortedData(
        sortedData
      );
      console.log("Sorted Data :" + sortedData)
      setSortActive(a => !a)
    }
  }
  // only shows the delete button if the user is an admin
  let deleteButton;
  let addNewButton;
  if (userInfo && userInfo.type == 'admin') {
    addNewButton = <InputCharityForm />
  } else {
    deleteButton = null;
  }
  return (
    <Row>
      <Col sm='6' className="loginCol">
        <Row>
          <h1 className="heading">Local Charities</h1>
        </Row>
        <Row>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Local Charities"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton> */}
          {addNewButton}
          <Button className='pageButtonStyling' variant={buttonVariant} onClick={toggleSort}>A-Z</Button>
          <ColoredLine />
          
        </Row>
        <Dialog />
        {localCharity.map((localCharity, index) => (
          <Row className='localCharityRow'>
            <Card>
              <Card.Header><h5>Sponsored Charity</h5></Card.Header>
              <Card.Body>
                <Card.Title>{localCharity.name}</Card.Title>
                <Card.Text>
                  {localCharity.description}
                </Card.Text>
                <Button variant="primary" onClick={() => window.open(localCharity.link, '_blank')}>More Info</Button>
                {userInfo && userInfo.type === 'admin' ? 
                <Button className='charityDelete' variant='danger' onClick={e => deleteCharity(localCharity)}>Delete</Button>
              :
              ''
              }
              </Card.Body>
              <Card.Footer>{localCharity.location}</Card.Footer>
            </Card>
          </Row>
        ))};

      </Col>
      <Col sm='6'>
        <iframe id="googleMapsEmbed" src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d591862.0637039257!2d-6.00348!3d54.587058000000006!3m2!1i1024!2i768!4f13.1!2m1!1sfood%20charities%20belfast!5e0!3m2!1sen!2suk!4v1702496368346!5m2!1sen!2suk"></iframe>
      </Col>
    </Row>
  );
}
export default LocalCharities;