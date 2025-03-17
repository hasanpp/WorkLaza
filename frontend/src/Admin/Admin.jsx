import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Top from "./Herders/Top/Top";
import Left from "./Herders/Left/Left";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Workers from "./Pages/Workers";
import Chats from "./Pages/Chats";
import Bookings from "./Pages/Bookings";
import Requests from "./Pages/Requests";
import Categoryes from "./Pages/Categoryes";
import Wallet from './Pages/Wallet'
import ProtectedRoute from '../Compenets/ProtectedRoute/ProtectedRoute'
import { useSelector } from 'react-redux';
import './Admin.css'

export const SearchContext = createContext();
export const PageContext = createContext();

const Admin = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth)
  const [page, setPage] = useState(localStorage.getItem('page')||'Dash')


  useEffect(() => {
    switch (role) {

      case 'admin':
        navigate('/admin-panel');
        break;
      case 'worker':
        navigate('/worker');
        break;
      default:
        navigate('/');
    }
  }, [role, navigate])

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = '/src/assets//Admin_icones/admin-logo.png';
  }, []);

  useEffect(()=>{
    localStorage.setItem('page',page)
  },[page])

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery}}>
      <PageContext.Provider value={setPage}>
        <Top/>
        <Left page={page} />
        
        {page == 'Dash' && <ProtectedRoute><Dashboard/></ProtectedRoute>}
        {page == 'Categoryes' && <ProtectedRoute><Categoryes /></ProtectedRoute>}
        {page == 'Users' && <ProtectedRoute><Users/></ProtectedRoute>}
        {page == 'Workers' && <ProtectedRoute><Workers/></ProtectedRoute>}
        {page == 'Chats' && <ProtectedRoute><Chats/></ProtectedRoute>}
        {page == 'Bookings' && <ProtectedRoute><Bookings/></ProtectedRoute>}
        {page == 'Wallet' && <ProtectedRoute><Wallet/></ProtectedRoute>}
        {page == 'Requests' && <ProtectedRoute><Requests/></ProtectedRoute>}

        {/* Redirect to Home if page is invalid */}
        {!['Dash', 'Categoryes', 'Users', 'Workers', 'Chats', 'Bookings', 'Wallet', 'Requests' ].includes(page) && (() => {
            setPage('Dash');
            localStorage.setItem('page', 'Dash');
            return <Dashboard />;
          })()
        }
        
      </PageContext.Provider>
    </SearchContext.Provider>
  )
}

export default Admin
