/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Layout.css';
import Header from '../Compenets/header/Header';
import Footer from '../Compenets/Footer/Footer'
import Home from '../Pages/Home/Home'
import Saved from '../Pages/Saved/Saved'
import Workers from '../Pages/Workers/Workers'
import Bookings from '../Pages/Bookings/Bookings'
import Not_found from '../Pages/Not_found/Not_found';
import { useAuth } from '../Authstate';
import { useNavigate } from 'react-router-dom';

export const PageContext = createContext();

const Layout = (props) => {

  const { userRole } = useAuth();

  const navigate = useNavigate();

  console.log(userRole);

  const [page, setPage] = useState('Home');
  useEffect(() => {
    if (props.not_found == "true") {
      setPage('not')
    }
  }, [])

  useEffect(() => {
    switch (userRole.role) {
      case 'admin':
        navigate('/admin-panel');
        break;
      case 'worker':
        navigate('/worker');
        break;
      default:
        navigate('/');
    }
  }, [userRole, navigate]);


  return (
    <>
      <PageContext.Provider value={setPage}>
        <Header page={page} not_found={props?.not_found} />

        {page == 'Home' && <Home />}
        {page == 'Saved' && <Saved />}
        {page == 'Workers' && <Workers />}
        {page == 'Bookings' && <Bookings />}
        {page == 'not' && <Not_found />}
        <Footer />
      </PageContext.Provider>
    </>
  )


}

Layout.propTypes = {
  not_found: PropTypes.bool
};

Layout.defaultProps = {
  not_found: false
};

export default Layout
