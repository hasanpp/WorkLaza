/* eslint-disable no-unused-vars */
import './Home.css'
import {useAuth} from '../../Authstate'
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Banner from '../../Compenets/Banner/Banner'
import { useContext } from 'react';
import { LoadingContext } from '../../App';

 

const Home = () => {

  // const { isAuthenticated, logout } = useAuth();
  // const navigate = useNavigate();

  const setIsLoading = useContext(LoadingContext);

  

  return (
    <div>
      <Banner/>
    </div>
  )
}

export default Home
