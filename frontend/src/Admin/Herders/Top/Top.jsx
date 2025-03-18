/* eslint-disable no-unused-vars */
import './Top.css'
import logo from '../../../assets/Admin_icones/admin-logo.png'
import search from '../../../assets/Admin_icones/search.png'
import notification from '../../../assets/Admin_icones/notification.png'
import { useContext, useEffect, useState, useRef, } from 'react';
import { SearchContext } from '../../Admin';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const Top = () => {

  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { user_id } = useSelector((state) => state.auth)
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);
  const web_socket_url = import.meta.env.VITE_WEBSOCKET_URL;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!user_id) return;

    const socket = new WebSocket(`${web_socket_url}${user_id}/`);

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const ispage = localStorage.getItem("page")
      if (ispage !== "Chats" || data.title !== "New message"){
        setNotifications((prev) => [data, ...prev]);
        toast(`${data.title}: ${data.body}`);
      }
    }

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    setWs(socket);
    return () => socket.close();
  }, [user_id])

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    console.log(!isOpen)
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <>
      <div className="top-nav">
        <div className="logo-class">
          <img src={logo} alt="" />
          <span>Work Laza</span>
        </div>
        <div className="search-box">
          <input type="search" placeholder='Search anything...' value={searchQuery} onChange={handleSearchChange} />
          <img src={search} alt="" />
        </div>
        <div className="top-right">
          <div className="notification-dropdown" ref={dropdownRef}>
            <div className="notification-icon" onClick={toggleDropdown}>
              <img src={notification} alt="" style={{ cursor: 'pointer' }} />
              {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
            </div>
            {isOpen && (

              <div className="dropdown-content">
                <div className="header">
                  <span>Notifications</span>
                </div>
                <ul>
                  {notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                      <li key={index} className="notification-item">
                        <div className="text">
                          <p>{notif.body}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="no-notifications">No new notifications</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Top
