import './Left.css'
import Bookings from '../../../assets/Admin_icones/Bookings.png'
import Chats from '../../../assets/Admin_icones/Chats.png'
import Dash from '../../../assets/Admin_icones/Dash.png'
import Folder from '../../../assets/Admin_icones/Folder.png'
import Logout from '../../../assets/Admin_icones/Logout.png'
import Registration from '../../../assets/Admin_icones/Registration.png'
import settings from '../../../assets/Admin_icones/settings.png'
import users from '../../../assets/Admin_icones/users.png'
import Workers from '../../../assets/Admin_icones/Workers.png'
import Category from '../../../assets/Admin_icones/Category.png'
import { logout } from '../../../authSlice';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { PageContext } from '../../Admin'



const Left = ({page}) => {

  const dispatch = useDispatch();
  const setPage = useContext(PageContext);

  return (
    <div className="sidebar">
        <ul>
            <li className={`${page=='Dash'? 'selected':null}`} onClick={()=>setPage('Dash')}><img src={Dash} alt="" /></li>
            <li className={`${page=='Categoryes'? 'selected':null}`} onClick={()=>setPage('Categoryes')}><img src={Category} alt="" /></li>
            <li className={`${page=='Bookings'? 'selected':null}`} onClick={()=>setPage('Bookings')}><img src={Bookings} alt="" /></li>
            <li className={`${page=='Workers'? 'selected':null}`} onClick={()=>setPage('Workers')}><img src={Workers} alt="" /></li>
            <li className={`${page=='Requests'? 'selected':null}`} onClick={()=>setPage('Requests')}><img src={Registration} alt="" /></li>
            <li className={`${page=='Users'? 'selected':null}`} onClick={()=>setPage('Users')}><img src={users} alt="" /></li>
            <li className={`${page=='Files'? 'selected':null}`} onClick={()=>setPage('Files')}><img src={Folder} alt="" /></li>
            <li className={`${page=='Chats'? 'selected':null}`} onClick={()=>setPage('Chats')}><img src={Chats} alt="" /></li>
            <li className={`${page=='Settings'? 'selected':null}`} onClick={()=>setPage('Settings')}><img src={settings} alt="" /></li>
            <li onClick={()=>dispatch(logout())} className='logout'><img src={Logout} alt="" /></li>
        </ul>
    </div>
  )
}

Left.propTypes = {
  page: PropTypes.string.isRequired, 
};


export default Left
