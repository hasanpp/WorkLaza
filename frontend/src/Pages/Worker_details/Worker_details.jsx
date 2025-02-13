/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import './Worker_details.css';
import PropTypes from 'prop-types';
import API from '../../api';
import { toast } from 'react-toastify';
import user_icon from '../../assets/user.png';


const Worker_details = ({worker_id}) => {

    const [worker,setWorker] = useState();
    const [availabilities,setAvailabilities] = useState();
    const { isAuthenticated } = useSelector((state) => state.auth)
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        const fetch_data = async()=>{
            try {
                const res =await API.post('user/view_worker/',{'id':worker_id})
                setWorker(res?.data?.worker)
                setAvailabilities(res?.data?.worker?.availabilities)
            } catch (err) {
                toast.error(err?.response?.data?.message)
            }
        }
        fetch_data();
    },[])

    const saveWorker = async (worker_id)=>{
        if (!isAuthenticated){
            toast.warning("Please login to save a profile")
            return
        }
        try {
            const res = await API.post('user/save_worker/',{'worker_id':worker_id})
            toast.success(res?.data?.message)
        } catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.message)
        }
    }


  return (
    <div className='main_worker_details'>
       <span className='page_name'>Workers/Worker details</span>
        <div className="container-fluid main_details">
            <div className="inner_div">
                <div className="first_row">
                    <div className="left_side">
                        <img src={worker?.profile_pic ? `${apiUrl}${worker?.profile_pic}` : user_icon} alt="" />
                    </div>
                    <div className="right_side">
                        <br />
                        <h2>{worker?.full_name}</h2>
                        <br />
                        <div>
                            <span className="feild">{worker?.job_title}</span>     
                            <br />
                            <span className="feild">{worker?.experience} + yers of expeexperience</span><br />
                            <span className="feild">Education : {worker?.qualification} </span><br />
                            <span className="feild">Age : {worker?.age}  </span>
                        </div>
                        <br />
                        <h4>₹ {worker?.salary} / hour</h4>
                        <br />
                        <div className="buttons">
                            <button onClick={()=>saveWorker(worker?.id)}>Save profile</button>
                            <button>Book now</button>
                        </div>
                        <br /><br />
                    </div>
                </div>
                <div className="second_row">
                    <p>{worker?.description}</p>
                </div>
                <br />
            </div>
        </div>
    </div>
  )
}

export default Worker_details



Worker_details.propTypes = {
    worker_id: PropTypes.string.isRequired, 
};
