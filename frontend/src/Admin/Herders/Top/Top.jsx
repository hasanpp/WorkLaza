import './Top.css'
import logo from '../../../assets/Admin_icones/admin-logo.png'
import search from '../../../assets/Admin_icones/search.png'
import notification from '../../../assets/Admin_icones/notification.png'
import ad_user from '../../../assets/Admin_icones/admin-user.png'
import { useContext } from 'react';
import { SearchContext } from '../../Admin';


const Top = () => {

  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  return (
    <>
      <div className="top-nav">
        <div className="logo-class">
          <img src={logo} alt="" />
          <span>Work Laza</span>
        </div>
        <div className="search-box">
          <input type="search" placeholder='Search anything...' value={searchQuery} onChange={handleSearchChange}/>
          <img src={search} alt="" />
        </div>
        <div className="top-right">
          <img src={notification} alt="" />
          <div className='ad_user_bg'>
            <img src={ad_user} alt="" />
          </div>
          
        </div>
      </div>
    </>
  )
}

export default Top
