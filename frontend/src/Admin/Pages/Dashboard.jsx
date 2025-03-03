import { toast } from 'sonner'
import './Dashboard.css'
import { PeopleFill, Book, PersonFill } from 'react-bootstrap-icons'
import API from '../../api'
import secureRequest from '../../Compenets/ProtectedRoute/secureRequest'
import { useEffect, useState } from 'react'

const Dashboard = () => {

  const [dashData, setDashData ] = useState({});

  const paths = {
    increase: "M0,60 C20,40 40,70 60,45 C80,20 100,50 120,30 C140,10 150,5 150,5", 
    decrease: "M0,5 C20,25 40,15 60,40 C80,60 100,45 120,65 C140,80 150,75 150,75",  
    unchanged: "M0,40 C25,45 50,35 75,40 C100,45 125,35 150,40" 
  };

  const colors = {
    increase: "#4787FA",  
    decrease: "#FA4747", 
    unchanged: "#FABD47" 
  };

  const feachData =async ()=>{
    try {
      await secureRequest(async () => {
        const res = await API.get('admin_view/view_dash_board')
        const data = res?.data
        console.log(res?.data)
        setDashData({new_users:data?.new_users, difference_new_users:data?.difference_new_users, new_bookings:data?.new_bookings, difference_new_bookings:data?.difference_new_bookings, new_workers:data?.new_workers,difference_new_workers:data?.difference_new_workers})
      })

    } catch (err) {
      toast.error(err?.response?.data?.message)
    }
  }

  useEffect(()=>{
    feachData();
  },[])
  return (
    <div>
      <div className="content-admin"> 
        <h1 style={{margin:"0px 30px"}}>Admin panel</h1>
        <br />
        <div className="top_row_dash row">
          <div className="dashboard-card">
            <div className="card-header">
              <div className="icon-container">
                <PersonFill size={24} color="#D8D8D8" />
              </div>
              <span className="card-title">New users</span>
              <span className="card-count">{dashData?.new_users}</span>
            </div>
            <div className="card-divider"></div>
            <div className="card-content">
              <svg width="150" height="80" viewBox="0 0 150 80" className="graph" >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path d={dashData?.difference_new_users >0 ? paths.increase: dashData?.difference_new_users == 0 ? paths.unchanged :paths.decrease} fill="none" stroke={dashData?.difference_new_users > 0 ? colors.increase: dashData?.difference_new_users == 0 ? colors.unchanged :colors.decrease} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
              </svg>
              <div className="stats-container">
                <div className="stat-text">{`${dashData?.difference_new_users} difference from last week`}</div>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-header">
              <div className="icon-container">
                <Book size={24} color="#D8D8D8" />
              </div>
              <span className="card-title">New Bookings</span>
              <span className="card-count">{dashData?.new_bookings}</span>
            </div>
            <div className="card-divider"></div>
            <div className="card-content">
              <svg width="150" height="80" viewBox="0 0 150 80" className="graph" >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path d={dashData?.difference_new_bookings >0 ? paths.increase: dashData?.difference_new_bookings == 0 ? paths.unchanged :paths.decrease} fill="none" stroke={dashData?.difference_new_bookings > 0 ? colors.increase: dashData?.difference_new_bookings == 0 ? colors.unchanged :colors.decrease} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
              </svg>
              <div className="stats-container">
              <div className="stat-text">{`${dashData?.difference_new_bookings} difference from last week`}</div>
              </div>
            </div>
          </div>
          <div className="dashboard-card">
            <div className="card-header">
              <div className="icon-container">
                <PeopleFill size={24} color="#D8D8D8" />
              </div>
              <span className="card-title">New workers</span>
              <span className="card-count">{dashData?.new_workers}</span>
            </div>
            <div className="card-divider"></div>
            <div className="card-content">
              <svg width="150" height="80" viewBox="0 0 150 80" className="graph" >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <path d={dashData?.difference_new_workers >0 ? paths.increase: dashData?.difference_new_workers == 0 ? paths.unchanged :paths.decrease} fill="none" stroke={dashData?.difference_new_workers > 0 ? colors.increase: dashData?.difference_new_workers == 0 ? colors.unchanged :colors.decrease} strokeWidth="3" strokeLinecap="round" filter="url(#glow)" />
              </svg>
              <div className="stats-container">
                <div className="stat-number"></div>
                <div className="stat-text">{`${dashData?.difference_new_workers} difference from last week`}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard

