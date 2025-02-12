/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify'
import './Worker.css'
import API from '../api'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Home from './Pages/Home/Home'
import Chats from './Pages/Chats/Chats'
import Bookings from './Pages/Bookings/Bookings'
import Schedule from './Pages/Schedule/Schedule'
import Profile from './Pages/Profile/Profile'
import { createContext,useContext } from 'react'
import { logout } from '../authSlice';

export const PageContext = createContext();


const Worker = () => {

  const [waiting, setWaiting] = useState(null);
  const { isAuthenticated, role } = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [page, setPage] = useState(localStorage.getItem('page') || 'Home')
  const dispatch = useDispatch();

  const worker_view = async (latitude = null, longitude = null) => {
    
    try {
      const res = await API.post('/worker/worker_view/', { latitude, longitude })
      localStorage.setItem('full_name', res.data.full_name)
    } catch (err) {
      toast.error(err?.response?.data?.messages)
      dispatch(logout())
    }
  }


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
    switch (role) {
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
  }, [role, navigate]);

  useEffect(() => {
    try {
      if (role == "worker") {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            worker_view(position.coords.latitude, position.coords.longitude)
          },
          (err) => {
            toast.error("Location permission denied.");
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    }
    } catch (error) {
      console.log(error)
    }
    
  }, [])

  const worker_dash =
    <div>
      <PageContext.Provider value={setPage}>
        <Navbar page={page} />
        <div className='content'>
          {page == 'Home' && <Home />}
          {page == 'Schedule' && <Schedule />}
          {page == 'Chats' && <Chats />}
          {page == 'Bookings' && <Bookings />}
          {page == 'Profile' && <Profile />}
        </div>
      </PageContext.Provider>
    </div>


  return (
    waiting ? waiting : worker_dash

  )
}

export default Worker
