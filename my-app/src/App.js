import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home';
import Login from './pages/login';
import Food from './pages/food';
import HomeGoods from './pages/homeGoods';
import LocalCharities from './pages/localCharities';
import ItemPage from './pages/itemPage';
import NavigationBar from './components/navbar'
import Footer from './components/footer';
import Profile from './pages/profile';
import "bootstrap/dist/css/bootstrap.min.css"
import Messages from './pages/messages';
import UserProfile from './pages/userProfile';

function App() {
    return (
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          {/* these allow the pages to be viewed and for buttons to work by navigating to these urls */}
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/food' element={<Food/>}/>
            <Route path='/item/:id' element={<ItemPage/>}/>
            <Route path='/homegoods' element={<HomeGoods/>}/>
            <Route path='/localcharities' element={<LocalCharities/>}/>
            <Route path='/profile' element={<Profile />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/messages/:id' element={<Messages />} />
            <Route path='/userProfile/:id' element={<UserProfile />} />


        </Routes>
        <Footer />
      </BrowserRouter>
    );
}

export default App;