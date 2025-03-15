import { toast } from 'sonner'
import './Dashboard.css'
import { PeopleFill, Book, PersonFill, Calendar, Calendar2, Calendar3  } from 'react-bootstrap-icons'
import API from '../../api'
import secureRequest from '../../Compenets/ProtectedRoute/secureRequest'
import { useEffect, useState, useRef } from 'react'
import Chart from 'chart.js/auto'


const Dashboard = () => {

  const [dashData, setDashData ] = useState({});
  const [period, setPeriod] = useState('week');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

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
  const fetchData =async (selectedPeriod = 'week') =>{
    try {
      await secureRequest(async () => {
        const res = await API.get(`admin_view/view_dash_board?period=${selectedPeriod}`)
        const data = res?.data
        setDashData({new_users:data?.new_users, difference_new_users:data?.difference_new_users, new_bookings:data?.new_bookings, difference_new_bookings:data?.difference_new_bookings, new_workers:data?.new_workers,difference_new_workers:data?.difference_new_workers, booking_data: data?.booking_data || [], period: data?.period || 'week'})

      })

    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong")
    }
  }

  const createChart = () => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current || !dashData.booking_data) return;

    const ctx = chartRef.current.getContext('2d');
    
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    gradientFill.addColorStop(0, 'rgba(71, 135, 250, 0.5)');
    gradientFill.addColorStop(1, 'rgba(71, 135, 250, 0.1)');

    const labels = dashData.booking_data.map(item => item.label);
    const data = dashData.booking_data.map(item => item.count);

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Bookings',
          data: data,
          borderColor: '#4787FA',
          backgroundColor: gradientFill,
          tension: 0.4,
          borderWidth: 3,
          fill: true,
          pointBackgroundColor: '#4787FA',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 10,
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#4787FA',
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                return `Bookings: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(200, 200, 200, 0.1)',
              drawBorder: false,
            },
            ticks: {
              color: '#8A8A8A',
              font: {
                size: 11
              },
              padding: 10
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: '#8A8A8A',
              font: {
                size: 11
              },
              padding: 10
            }
          }
        }
      }
    });
  }

  const changePeriod = (newPeriod) => {
    setPeriod(newPeriod);
    fetchData(newPeriod);
  }


  useEffect(()=>{
    fetchData();
  },[])

  useEffect(() => {
    if (dashData.booking_data) {
      createChart();
    }
  }, [dashData])


  return (
    <div>
      <div className="content-admin admin-dashboar_main"> 
        <h1 className='page_name' style={{margin:"0px 30px"}}>Admin panel</h1>
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
                <div className="stat-text">{`${dashData?.difference_new_users} difference`}</div>
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
              <div className="stat-text">{`${dashData?.difference_new_bookings} difference`}</div>
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
                <div className="stat-text">{`${dashData?.difference_new_workers} difference `}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="booking-graph-section">
          <div className="booking-graph-card">
            <div className="booking-graph-header">
              <h2>Booking Trends</h2>
              <div className="period-selector">
                <button className={`period-btn ${period === 'day' ? 'active' : ''}`}  onClick={() => changePeriod('day')}>
                  <Calendar size={16}/> &nbsp; Daily
                </button>
                <button className={`period-btn ${period === 'week' ? 'active' : ''}`}  onClick={() => changePeriod('week')}>
                  <Calendar2 size={16}/> &nbsp; Weekly
                </button>
                <button  className={`period-btn ${period === 'month' ? 'active' : ''}`}  onClick={() => changePeriod('month')}>
                  <Calendar3 size={16}/> &nbsp; Monthly
                </button>
                <button className={`period-btn ${period === 'year' ? 'active' : ''}`} onClick={() => changePeriod('year')}>
                  <Calendar3 size={16}/> &nbsp; Yearly
                </button>
              </div>
            </div>
            <div className="booking-graph-container">
              <canvas ref={chartRef} height="300"></canvas>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard

