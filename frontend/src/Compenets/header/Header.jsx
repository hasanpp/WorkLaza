/* eslint-disable no-unused-vars */
import './Header.css'
import logo from '../../assets/logo.png'
import { Person } from 'react-bootstrap-icons';
import { useContext, useState } from 'react';
import { useAuth } from '../../Authstate'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { PageContext } from '../../Layout/Layout';
import PropTypes from 'prop-types';


const Header = ({ page }) => {

  const { userRole,logout } = useAuth();
  const username = localStorage.getItem('Username');
  const first_name = localStorage.getItem('first_name');
  const last_name = localStorage.getItem('last_name');
  const setPage = useContext(PageContext);


  const handleLogout = () => {
    logout();
    localStorage.clear();
    toast.success('user Loged out');
  };

  
  const navigate = useNavigate();

  
  

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="" />
          <h4>Work Laza</h4>
        </a>

        <div className="collapse navbar-collapse" id="navbarSupportedContent" >
          <ul className="navbar-nav ">
            <li className="nav-item active">
              <a className={`nav-link ${page=='Home'?'selected':null}`} onClick={() => setPage('Home') }>Home<span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item active">
              <a className={`nav-link ${page=='Workers'?'selected':null}`} onClick={() => setPage('Workers')}>Workers<span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item active">
              <a className={`nav-link ${page=='Bookings'?'selected':null}`} onClick={() => setPage('Bookings')}>Bookings<span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item active">
              <a className={`nav-link ${page=='Saved'?'selected':null}`} onClick={() => setPage('Saved')}>Saved<span className="sr-only">(current)</span></a>
            </li>
          </ul>
        </div>

        <div className="dropdown">
          <button className='btn btn-info' type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span>{username ? `${first_name} ${last_name}` : 'user'}</span> &nbsp;
            <Person color="white" size={20} />
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">

            {!userRole.isAuthenticated ? <a className="dropdown-item" onClick={() => navigate('/signin')}>Sign In</a> : null}
            {!userRole.isAuthenticated ? <a className="dropdown-item" onClick={() => navigate('/signup')}>Sign Up</a> : null}
            {userRole.isAuthenticated ? <a className="dropdown-item" onClick={() => navigate('/profile')}>View profile</a> : null}
            {userRole.isAuthenticated ? <a className="dropdown-item" >Chat</a> : null}
            {userRole.isAuthenticated ? <a className="dropdown-item" >Register as a worker</a> : null}
            {userRole.isAuthenticated ? <a style={{ color: "red" }} className="dropdown-item dropdown-item-red" onClick={handleLogout}>Log out</a> : null}

          </div>
        </div>

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.25 10.0625C4.25 9.4757 4.7257 9 5.3125 9H28.6875C29.2743 9 29.75 9.4757 29.75 10.0625C29.75 10.6493 29.2743 11.125 28.6875 11.125H5.3125C4.7257 11.125 4.25 10.6493 4.25 10.0625ZM4.25 17.5C4.25 16.9132 4.7257 16.4375 5.3125 16.4375H28.6875C29.2743 16.4375 29.75 16.9132 29.75 17.5C29.75 18.0868 29.2743 18.5625 28.6875 18.5625H5.3125C4.7257 18.5625 4.25 18.0868 4.25 17.5ZM15.9375 24.9375C15.9375 24.3507 16.4132 23.875 17 23.875H28.6875C29.2743 23.875 29.75 24.3507 29.75 24.9375C29.75 25.5243 29.2743 26 28.6875 26H17C16.4132 26 15.9375 25.5243 15.9375 24.9375Z" fill="white" />
          </svg>
        </button>

      </nav>
    </div>
  )
}

Header.propTypes = {
  page: PropTypes.string.isRequired, 
};

export default Header
