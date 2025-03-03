import { useEffect, useState, useContext } from 'react';
import './Home.css';
import { CardChecklist, BoxFill, PersonCheckFill, Wallet2 } from 'react-bootstrap-icons';
import secureRequest from '../../../Compenets/ProtectedRoute/secureRequest';
import API from '../../../api';
import { toast } from 'sonner';
import { PageContext } from '../../Worker';

const Home = () => {

  const [worker, setWorker ] = useState();
  const setPage = useContext(PageContext);

  const worker_view = async () => {
    try {
      await secureRequest(async () => {
        const res = await API.get('/worker/view_details/' )
        console.log(res?.data)
        setWorker({...res?.data?.worker, new_bookings:res?.data?.new_bookings, reviews_count:res?.data?.reviews_count, today_tasks_count: res?.data?.today_tasks_count})
      });
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }
  }

  useEffect(()=>{
    worker_view()
  },[])

  return (
    <div className='main_worker_home'>
      <span>Home</span>
      <br />
      <br />
      <div className="top_row">
        <div className="new_task">
          <BoxFill/>
          <span>New tasks</span>
          <h4 className="count" style={{color:'green'}}>{worker?.new_bookings}</h4>
        </div>
        <div className="new_task">
          <CardChecklist/>
          <span>Tasks pending</span>
          <h4 className="count" style={{color:'yellow'}}>{worker?.today_tasks_count}</h4>
        </div>
        <div className="new_task">
          <PersonCheckFill/>
          <span>reviews</span>
          <h4 className="count" style={{color:'blue'}}>{worker?.reviews_count}</h4>
        </div>
        <div className="new_task"  onClick={() =>{ setPage('Payments'), localStorage.setItem('page','Payments')}}>
          <Wallet2/>
          <span>Platform fee</span>
          <h4 className="count" style={{color:'red'}}>{worker?.pending_fee}</h4>
        </div>
      </div>
    </div>
  )
}

export default Home
