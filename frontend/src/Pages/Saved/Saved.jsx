import { useEffect, useState, useContext } from 'react'
import { toast } from 'sonner'
import { PageContext } from '../../Layout/Layout';
import API from '../../api'
import './Saved.css'
import user_icon from '../../assets/user.png';
import secureRequest from '../../Compenets/ProtectedRoute/secureRequest';


const Saved = () => {

  const [workers, setWorkers] = useState();
  const [tb, setTb] =useState(false);
  const setPage = useContext(PageContext);

  useEffect(()=>{
    const featc_data = async ()=>{
      try {
        const res = await API.get('/user/saved_workers_view/')
        setWorkers(res?.data?.workers)
      } catch (err) {
        toast.error(err?.response?.data?.message)
      }
    }
    featc_data();
  },[tb])

  const remove_saved = async (worker_id)=>{
    try {
      await secureRequest(async () => {
        const res = await API.delete(`/user/saved_workers_view/${worker_id}`)
        toast.success(res?.data?.message)
        setTb(!tb)
      });
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }
  }

  return (
    <div className='main_saved'>
      <span>Saved</span>

      <div className="workers_dis">
                { workers?.length > 0  ? workers?.map(worker => (
                  <div key={worker?.id} className="worker_card" style={{cursor:'pointer'}}>
                    <img src={worker?.profile_pic ? `${worker?.profile_pic}` : user_icon} alt="Profile" />
                    <h3>{worker?.full_name}</h3>
                    <span>{worker?.job_title}</span>
                    <h4>₹ {worker?.salary}/hour</h4>
                    <p>{worker?.description?.slice(0, 65)}...</p>
                    <div className="button_row">
                      <button className='details_btn' onClick={()=>{setPage(`Worker_details/${worker?.id}`), localStorage.setItem('page',`Worker_details/${worker?.id}`)}} >View details</button>
                      <button className='Book_btn' onClick={()=>remove_saved(worker?.id)} style={{zIndex:'100'}}>Remove saved</button>
                    </div>
                  </div>
                )) : <div><br /><br /><br /><span  style={{color:"#fff", textAlign:"center", fontSize:"20px"}}>There are no saved profiles</span></div>}
              </div>
    </div>
  )
}

export default Saved
