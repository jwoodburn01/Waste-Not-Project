// For the file upload for the picture updating use thie to get it to work https://www.youtube.com/watch?v=iw5RSIflYGU&list=PLKhlp2qtUcSYC7EffnHzD-Ws2xG-j3aYo&index=11
import { React, useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import UpdateProfileForm from '../components/updateProfileForm';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';
import { Col, Row } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { TbLogin } from "react-icons/tb";

function Profile() {
 
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const [profile, setProfile] = useState('');
  const [search, setSearch] = useState('');
  const [food, setFood] = useState([]);
  const [homeGoods, setHomeGoods] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [reservedItems, setReservedItems] = useState([]);
     const navigate = useNavigate();
    const dispatch = useDispatch();
    const spoiler = useRef([]);
    const spoilerReserved = useRef([]);

    const onHover = (index, sp) => {
      sp.current[index].classList.remove("disabledSpoilerContainer");
    };
  
    const onLeave = (index, sp) => {
      sp.current[index].classList.add("disabledSpoilerContainer");
    };

    const logoutHandler = () => {
      dispatch(logout());
      navigate("/");
    }

    useEffect(() => {
      
      if(!userInfo){
        navigate("/")
      }
    }, [navigate,userInfo])

    useEffect(() => {
      axios.get(`http://localhost:3001/profileDetails/${userInfo._id}`)
        .then(profile => setProfile(profile.data))
        .catch(error => console.error(error));
    }, [userInfo]);

    useEffect(() => {
      axios.get(`http://localhost:3001/getFood?q=${search}`)
        .then(food => { setFood(food.data);})
        .catch(error => console.error(error));
    }, [search]);

    useEffect(() => {
      axios.get(`http://localhost:3001/getHomeGoods?q=${search}`)
        .then(homeGoods => { setHomeGoods(homeGoods.data);})
        .catch(error => console.error(error));
    }, [search]);

    useEffect(() => {
      setAllItems([...food.filter(food => food.userId === userInfo._id),
        ...homeGoods.filter(goods => goods.userId === userInfo._id)])

        setReservedItems([...food.filter(food => food.reservedBy === userInfo._id),
          ...homeGoods.filter(goods => goods.reservedBy === userInfo._id)])
          console.log(reservedItems);
    }, [food, homeGoods]);
    
    
    return (
        
    <Row className='localCharityRow'>
    <Col>
    {/* style={{ width: '50rem' }} */}
      {/* <Card className='profileImageCard'>
      <Card.Img className="profileCardImage" variant="top" src={userInfo.pic} />
      <Card.Body>
        <Card.Title>
          {userInfo?.fName + " " + userInfo?.lName}
          </Card.Title>
        <Card.Text>
          Waste Not member since {profile.createdAt?.slice(0,4)}
        </Card.Text> */}
        {/* <Button variant="danger" onClick={logoutHandler}>Sign Out</Button> */}
      
{/*         
        <TbLogin className='profilePageIcon' onClick={logoutHandler} />
      </Card.Body> */}
    {/* </Card> */}
    <Card style={{ width: '100%', padding: '1vh', left:'1%' }}>
    <Row>
      <Col style={{ textAlign:'center' }}>
      <Card.Img variant="bottom" src={userInfo.pic} style={{ width:'auto', height:'22vh', objectFit:'contain', borderRadius:'60%'}}/>
      </Col>
      <Col>
          <Card.Body>
    <Card.Title>
    {userInfo?.fName + " " + userInfo?.lName}
    </Card.Title>
    <Card.Text>
    Waste Not member since {profile.createdAt?.slice(0,4)}
    </Card.Text>
  </Card.Body>
      </Col>
    </Row>
</Card>
    </Col>
    <Col>
      <Card>
        <Card.Body>
            <Card.Title>
              Profile Details
      <UpdateProfileForm />

            </Card.Title>
            <p>{userInfo?.fName + " " + userInfo?.lName}</p>
            <p>{userInfo?.email}</p>
        </Card.Body>
      </Card>
    </Col> 
    <Row>
      <h2 className='heading'>Your Current Listings</h2>
      {allItems.length>0 ? (
        <>
               {allItems.map((item, index) => (
<Card className='itemCard' style={{ width: '15rem', height:'fit-content' }}>
<div className='hoverContainer disabledSpoilerContainer'
  onMouseEnter={() => onHover(index, spoiler)} 
  onMouseLeave={() => onLeave(index, spoiler)} 
  ref={el => spoiler.current[index] = el}
  onClick={event => window.location.href = '/item/' + item._id}
  >
    {item.name}
  </div>
<Card.Img className='cardImage' variant="top" src={item.image} onClick={event => window.location.href = '/item/' + item._id} style={{ objectFit:'contain', height:'15rem'}}/>
</Card>

))}
        </>
 
      )
      
     : (
      <>
        <h5 className='heading'>No Listings to display</h5>
      </>
     )
 }
    </Row>
    <Row>
      <h2 className='heading'>Your Claimed Listings</h2>
      {reservedItems.length>0 ? (
        <>
               {reservedItems.map((item, index) => (
<Card className='itemCard' style={{ width: '15rem', height:'fit-content' }}>
<div className='hoverContainer disabledSpoilerContainer'
  onMouseEnter={() => onHover(index, spoilerReserved)} 
  onMouseLeave={() => onLeave(index, spoilerReserved)} 
  ref={el => spoilerReserved.current[index] = el}
  onClick={event => window.location.href = '/item/' + item._id}
  >
    {item.name}
  </div>
<Card.Img variant="top" src={item.image} onClick={event => window.location.href = '/item/' + item._id} style={{ objectFit:'contain', height:'15rem'}}/>
</Card>

))}
        </>
 
      )
      
     : (
      <>
        <h5 className='heading'>No Listings to display</h5>
      </>
     )
 }
    </Row>
    </Row>

    );
}
export default Profile;