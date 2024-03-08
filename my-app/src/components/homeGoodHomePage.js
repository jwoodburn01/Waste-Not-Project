import { Row, Col } from "react-bootstrap";
import CardComponent from "./card"
import React, { useState, useEffect } from 'react';
import axios from "axios";
import LoadingSpinner from './loading';

function HomeGoodsHomePage() {

  const [homeGoods, setHomeGoods] = useState([]);
  const [availableGoods, setAvailableGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // this gets the list of home goods
  useEffect(() => {
    axios.get(`http://localhost:3001/getHomeGoods?q=${search}`)
      .then(homeGoods => { setHomeGoods(homeGoods.data);
      setLoading(false)})
      .catch(error => console.error(error));
  }, [search]);

  // the reserved goods are left out of the list
  useEffect(() => {
    setAvailableGoods([...homeGoods.filter(goods => goods.reserved === false)])
  }, [homeGoods]);

      if(loading){
        return (
          <LoadingSpinner />
        );
      } else {
    return ( 
        <Row className="homePageItems">{availableGoods.slice(0,4).map((homeGoods, index) => (
          
            <CardComponent
              name={homeGoods.name}
              description={homeGoods.description}
              image={homeGoods.image}
              itemLink={event => window.location.href = '/item/' + homeGoods._id}
              location={homeGoods.location}
            />
        ))} 
        </Row>
     );
}
}

export default HomeGoodsHomePage;