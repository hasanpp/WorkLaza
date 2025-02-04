/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify'
import './Worker.css'
import API from '../api'
import { useEffect, useState } from 'react'
import { useAuth } from '../Authstate'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Home from './Pages/Home/Home'
import Chats from './Pages/Chats/Chats'
import Bookings from './Pages/Bookings/Bookings'
import Schedule from './Pages/Schedule/Schedule'
import Profile from './Pages/Profile/Profile'
import { createContext } from 'react'

export const PageContext = createContext();


const Worker = () => {

  const [username, setUsername] = useState(localStorage.getItem('Username'));
  const [waiting, setWaiting] = useState(null);
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(localStorage.getItem('page')||'Home')

  const worker_view = async () => {
    try {
      const res = await API.post('/worker/worker_view/', { 'username': username })
      localStorage.setItem('full_name', res.data.full_name)
    } catch (err) {
      if (!err?.response?.data?.is_verified) {
        setWaiting(<h2>This worker profile is not varified by admin login after some time</h2>)
      }
      if (!err?.response?.data?.is_active) {
        setWaiting(<h2>This worker is blocked by admin plase contact with admin</h2>)
      }

      toast.error(err?.response?.data?.messages)
    }
  }


  useEffect(() => {
    if (!userRole){
      navigate('/')
    }
    switch (userRole.role) {
      case 'admin':
        navigate('/admin-panel');
        break;
      case 'worker':
        navigate('/worker');
        break;
      case 'user':
        navigate('/');
        break;
      default:
        navigate('/signin');
    }
  }, [userRole, navigate]);

  useEffect(() => {
    worker_view()
  }, [])

  const worker_dash =
    <div>
      <PageContext.Provider value={setPage}>
        <Navbar  page={page} />
        <div className='content'>
          {page == 'Home' && <Home />}
          {page == 'Schedule' && <Schedule/>}
          {page == 'Chats' && <Chats/>}
          {page == 'Bookings' && <Bookings/>}
          {page == 'Profile' && <Profile/>}
        </div>
      </PageContext.Provider>
    </div>


  return (
    waiting ? waiting : worker_dash

  )
}

export default Worker
