import { Row, Col } from "react-bootstrap";
import CardComponent from "../components/card"
import React, { useState, useEffect } from 'react';
import axios from "axios";
import LoadingSpinner from '../components/loading';

function FoodItemsHomePage() {

  const [food, setFood] = useState([]);
  const [availableFood, setAvailableFood] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');


    useEffect(() => {
        axios.get(`http://localhost:3001/getFood?q=${search}`)
          .then(food => { setFood(food.data);
          setLoading(false)})
          .catch(error => console.error(error));
      }, [search]);

      useEffect(() => {
        setAvailableFood([...food.filter(food => food.reserved === false)])
      }, [food]);

      if(loading){
        return (
          <LoadingSpinner />
        );
      } else {
    return ( 
        <Row>{availableFood.slice(0,4).map((food, index) => (
            <CardComponent
              name={food.name}
              description={food.description}
              image={food.image}
              itemLink={event => window.location.href = '/item/' + food._id}
              location={food.location}
              id={food._id}
                dairy={food?.dairy}
                wheat={food?.wheat}
                nuts={food?.nuts}
                shellFish={food?.shellFish}
                egg={food?.egg}
            />
        ))} 
            

            
        </Row>
     );
}
}

export default FoodItemsHomePage;