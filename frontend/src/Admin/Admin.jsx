import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Top from "./Herders/Top/Top";
import Left from "./Herders/Left/Left";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Workers from "./Pages/Workers";
import Chats from "./Pages/Chats";
import Bookings from "./Pages/Bookings";
import Files from "./Pages/Files";
import Requests from "./Pages/Requests";
import Settings from "./Pages/Settings";
import Categoryes from "./Pages/Categoryes";
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
        <div className="content-admin">
          {page == 'Dash' && <Dashboard />}
          {page == 'Categoryes' && <Categoryes />}
          {page == 'Users' && <Users/>}
          {page == 'Workers' && <Workers/>}
          {page == 'Chats' && <Chats/>}
          {page == 'Bookings' && <Bookings/>}
          {page == 'Files' && <Files/>}
          {page == 'Settings' && <Settings/>}
          {page == 'Requests' && <Requests/>}
          <br /><br /><br /><br /><br /><br /><br /><br /><br />
          <br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
      </PageContext.Provider>
    </SearchContext.Provider>
  )
}

export default Admin
