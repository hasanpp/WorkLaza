/* eslint-disable no-unused-vars */
import './Home.css'
import 'react-toastify/dist/ReactToastify.css';
import Banner from '../../Compenets/Banner/Banner'
import { useContext } from 'react';
import { LoadingContext } from '../../App';
import { Medium } from 'react-bootstrap-icons'
import stay_conected from '../../assets/stay_conect.png'
import trusted from '../../assets/trusted.png'
import user_icone from '../../assets/user.png'



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
            <img src={stay_conected} alt="" />
            <h2>Stay connected</h2>
            <p>Stay connected with Worklaza for all your home service needs, bringing you innovative solutions</p>
          </div>
          <div className="col-lg-7">
            <div className="box-black">
              <h5>Over 1,000 Successes</h5>
              <p>Over 1,000 successful home service requests fulfilled with customer satisfaction.</p>
            </div>
            <div className="box-black">
              <h5>Wide Range of Services</h5>
              <p>We offer a wide range of services, including plumbing, electrical work and more.</p>
            </div>
            <div className="box-black">
              <h5>New Services Regularly</h5>
              <p>New services and skilled professionals added regularly to meet your needs.</p>
            </div>
            <div className="box-black">
              <h5>Expert Professionals</h5>
              <p>Worklaza services are provided by highly trained professionals with years of expertise</p>
            </div>
          </div>
        </div> 
        <div className="row second-row">
          <div className="col-lg-5">
            <img src={trusted} alt="" />
            <h2>Trusted Home Service Provider</h2>
            <p>Our employees are always ready to go anywhere and provide quality home services at your doorstep.</p>
          </div>
          <div className="col-lg-7">
            <div className="box-black">
              <h5>Comprehensive Services</h5>
              <p>Over 100+ home service categories for your diverse needs.</p>
            </div>
            <div className="box-black">
              <h5>Instant Booking</h5>
              <p>Easy-to-use interface for seamless appointment scheduling.</p>
            </div>
            <div className="box-black">
              <h5>Stay Ahead</h5>
              <p>Discover the latest home service trends and innovations.</p>
            </div>
            <div className="box-black">
              <h5>Experienced Employees</h5>
              <p>Skilled employees with years of experience, ready to serve you.</p>
            </div>
          </div>
        </div> 
      </div>

      <div className="conectivity container-fluid">
        <span>A Knowledge Treasure Trove</span>
        <h2>Popular Professionals in Your Area</h2>
      </div>
      <br /><br /><br />
      <div className="conectivity container-fluid">
        <span>What Our Customers  Say</span>
        <h2>Real Words from Customers</h2>
      </div>
      <div className="customeres_words col-lg-12 row">
        <div className="col-lg-4">
          <div className="user_det">
            <img src={user_icone} alt="profile" />
            <div className="name">
              <h6>Emma J</h6>
              <span>Home Painting</span>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          
        </div>
        <div className="col-lg-4">
          
        </div>
      </div>
      <br /><br /><br />

    </div>
  )
}

export default Home
