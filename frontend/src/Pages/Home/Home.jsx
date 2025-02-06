/* eslint-disable no-unused-vars */
import './Home.css'
import { useAuth } from '../../Authstate'
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
      <Banner />
      <div className="conectivity container-fluid">
        <span>Unlock the Power of</span>
        <h2>Work Laza connectivity </h2>
      </div>
      <div className="conectivites container-fluid">
        <div className="row top-row">
          <div className="col-lg-5">
            dsafdfsdf
          </div>
          <div className="col-lg-7">

          </div>
        </div> 
      </div>
      
    </div>
  )
}

export default Home
