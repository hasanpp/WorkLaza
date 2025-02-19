import './Booking_details.css'
import PropTypes from 'prop-types';
import API from '../../api';
import { useEffect,useContext,useState } from 'react';
import { LoadingContext } from '../../App';
import { toast } from 'react-toastify';
import user_icone from '../../assets/user.png';
import Swal from "sweetalert2";
import { ChatLeftDots } from 'react-bootstrap-icons';

const Booking_details = ({ booking_id }) => {

  const [booking, setBooking] = useState();
  const apiUrl = import.meta.env.VITE_API_URL;
  const setIsLoading = useContext(LoadingContext);
  const [ tb, setTb] = useState(false);

  useEffect(()=>{
    const featchData = async() =>{
      setIsLoading(true)
      try {
        const res = await API.get(`user/view_booking/${booking_id}`)
        
        console.log(res?.data?.Booking);
        setBooking(res?.data?.Booking)
      } catch (err) {
        toast.error(err?.response?.data?.message)
      } finally {
        setIsLoading(false)
      }
    }
    featchData();
  },[tb])


  const showConfirmAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Don't Cancel",
      confirmButtonText: "Yes, Cancel it!",
    }).then( async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        try {
          const res =  await API.patch(`user/cancel_booking/${booking_id}`)
          setTb(!tb)
          toast.success(res?.data?.message);
        } catch (err) {
          toast.error(err?.response?.data?.message)
        }finally {
          setIsLoading(false)
        }
      }
    });
  };
   

  return (
    <div className='booking_details_main'>
      <span>Booking/Booking details</span>
      <br /><br />
      <div className="details col-12 clo-lg-12">
        <div className="row">
          <img src={booking?.worker_profile?.profile_picture ? `${apiUrl}${booking?.worker_profile?.profile_picture}`: user_icone } alt="" />
          <h3>{booking?.worker_profile?.full_name}</h3>
          <h3>₹ {booking?.total}</h3>
          <ChatLeftDots/>
          <div className={`status ${booking?.status}`}>{booking?.status}</div>
        </div>
        <hr />
        <div className="bootam_part">
          <div className="left col-12 col-lg-6">
            <img src={`${apiUrl}${booking?.photo}`} alt="" />
          </div>
          <div className="right col-12 col-lg-6">
            <h4>Details of Booking</h4>
            <p>{booking?.details}</p>
            <p>
              <span>Current status : {booking?.status}</span><br />
              <span>Total payment :  {booking?.total}</span><br />
              <span>Pending payment : 100</span><br />
              <span>Duration : {booking?.duration} Hours</span><br />
              <span>Booked on : {booking?.booking_date} </span><br />
              <span>Booked to : {booking?.booked_date} </span><br />
              <span>Address : {booking?.address} </span><br />
            </p>
            {booking?.status == 'created' && <button onClick={showConfirmAlert}>Cancel now</button>}
              
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking_details




Booking_details.propTypes = {
    booking_id: PropTypes.string.isRequired,
};
