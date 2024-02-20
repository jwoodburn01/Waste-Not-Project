import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import logo from '../images/waste-notlogo.png'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userActions';
import { FaHome } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

export default function App() {

    const navigate = useNavigate();
const dispatch = useDispatch();

const logoutHandler = () => {
  dispatch(logout());
  navigate("/");
}

  return (
    <MDBFooter className='text-center text-black' style={{ backgroundColor: '#fef7e5', marginTop:'2vh', paddingTop:'1vh'}}>
      {/* <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Keep up to date with us:</span>
        </div>

        <div>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="twitter" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="google" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="linkedin" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section> */}

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="2" lg="2" xl="3" className='mx-auto mb-4'>
              <img className='footerLogo' src={logo} alt='Waste Not Logo'/>

            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p>
                <a href='/homeGoods' className='text-reset'>
                  Home Goods
                </a>
              </p>
              <p>
                <a href='/food' className='text-reset'>
                  Food
                </a>
              </p>
              <p>
                <a href='/localCharities' className='text-reset'>
                  Charities
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Personal links</h6>
              <p>
                <a href='/profile' className='text-reset'>
                  Profile
                </a>
              </p>
              <p>
                <a href='/messages' className='text-reset'>
                  Messages
                </a>
              </p>
              <p>
                <a href='' onClick={logoutHandler} className='text-reset'>
                  Log Out
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
              <FaHome className='footerContactIcon'/>
              <a className='text-reset' href='https://www.google.com/maps/place/Computer+Science+Building/@54.5816952,-5.9402296,17z/data=!3m2!4b1!5s0x486108ee841fa375:0x1e7977a7dfee6774!4m6!3m5!1s0x486108ee869f9ea9:0xa9f41c9563d671de!8m2!3d54.5816921!4d-5.9376547!16s%2Fg%2F1hc2rj0vr?hl=en&entry=ttu'>
                Belfast BT9 5BN
              </a>
                
              </p>
              <p>
              <MdEmail className='footerContactIcon'/>
              <a href='' onClick={ () => window.location.href =`mailto:wastenot@wn.com`} className='text-reset'>
                 wastenot@wn.com
              </a>
               
              </p>
              <p>
              <FaPhoneAlt className='footerContactIcon'/>
              028 9097 4669
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2023 Copyright:
        <a className='text-reset fw-bold' href='/'>
        WasteNot.co.uk
        </a>
      </div>
    </MDBFooter>
  );
}