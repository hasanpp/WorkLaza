/* eslint-disable no-unused-vars */
import './Home.css'
import Banner from '../../Compenets/Banner/Banner'
import { useContext } from 'react';
import { LoadingContext } from '../../App';
import { StarFill,Star,StarHalf } from 'react-bootstrap-icons'
import stay_conected from '../../assets/stay_conect.png'
import trusted from '../../assets/trusted.png'
import profile1 from '../../assets/profile1.png'
import profile2 from '../../assets/profile2.png'
import profile3 from '../../assets/profile3.png'
import logo from "../../assets/logo.png";
import top_right_arrow from '../../assets/top-right-arrow.png'
 

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
      {/* 
        <div className="conectivity container-fluid">
          <span>A Knowledge Treasure Trove</span>
          <h2>Popular Professionals in Your Area</h2>
        </div> 
      */}
      <div className="conectivity container-fluid">
        <span>What Our Customers  Say</span>
        <h2>Real Words from Customers</h2>
      </div>
      <div className="customeres_words col-lg-12 row">
        <div className="col-lg-4">
          <div className="user_det">
            <img src={profile1} alt="profile" />
            <div className="name">
              <h6>Tom H.</h6>
              <span>Electrical Services</span>
            </div>
          </div>
          <br />
          <div className="testimonial-box">
            <div className="stars">
                <StarFill/>
                <StarFill/>
                <StarFill/>
                <StarFill/>
                <StarFill/>
            </div>
            <br />
            <p className="review-text">
                {`"I had an electrical issue with my home wiring, and Worklaza sent an expert electrician who quickly diagnosed the problem and fixed it. Great service!"`}
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="user_det">
            <img src={profile2} alt="profile" />
            <div className="name">
              <h6>John P.</h6>
              <span>General Home Services</span>
            </div>
          </div>
          <br />
          <div className="testimonial-box">
            <div className="stars">
                <StarFill/>
                <StarFill/>
                <StarFill/>
                <StarFill/>
                <StarHalf/>
            </div>
            <br />
            <p className="review-text">
                {`"I love how Worklaza provides a one-stop solution for various home services. Their customer support is also fantastic – easy to reach and very helpful!"`}
            </p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="user_det">
            <img src={profile3} alt="profile" />
            <div className="name">
              <h6>David L</h6>
              <span>Plumbing Services</span>
            </div>
          </div>
          <br />
          <div className="testimonial-box">
            <div className="stars">
                <StarFill/>
                <StarFill/>
                <StarFill/>
                <StarFill/>
                <Star/>
            </div>
            <br />
            <p className="review-text">
                {`"I needed a repair. The Worklaza team was sent a plumber right to my doorstep. The service was smooth and reasonably priced. Highly recommend!"`}
            </p>
          </div>
        </div>
      </div> 
      <div className="be_a_part container-fluid">
        <div className="col-lg-3 col-12">
          <img src={logo} alt="Logo" />
        </div>
        <div className='col-lg-9 col-12'>
          <br />
          <span>Earn, Connect, and Innovate</span>
          <h3>Be Part of the Wrok Laza Revolution</h3>
          <br />
          <p>{`Join a thriving team that is reshaping the home service industry. Explore endless opportunities to grow, connect with passionate professionals, and make a real impact in people's lives. Be part of a dynamic and innovative community that's dedicated to delivering top-quality services and excellence every day.`}</p>
        </div>

        <div className='row'>
          <div className="lar_atr_box">
            <div className="top">  
              <h5>Resource Access</h5>
              <img src={top_right_arrow} alt="top-right-arrow" />
            </div>
            <p>{`Visitors can access a wide range of resources, including ebooks, whitepapers, reports.`}</p>
          </div>
          <div className="lar_atr_box">
            <div className="top">  
              <h5>Resource Access</h5>
              <img src={top_right_arrow} alt="top-right-arrow" />
            </div>
            <p>{`Visitors can access a wide range of resources, including ebooks, whitepapers, reports.`}</p>
          </div>
          <div className="lar_atr_box">
            <div className="top">  
              <h5>Resource Access</h5>
              <img src={top_right_arrow} alt="top-right-arrow" />
            </div>
            <p>{`Visitors can access a wide range of resources, including ebooks, whitepapers, reports.`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
