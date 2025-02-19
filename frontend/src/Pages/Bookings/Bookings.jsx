import './Bookings.css'
import user_icone from '../../assets/user.png'
import { ChatLeftDots } from 'react-bootstrap-icons'
import { LoadingContext } from '../../App'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import API from '../../api'
import { PageContext } from '../../Layout/Layout'
import Swal from "sweetalert2";




const Bookings = () => {

  const setIsLoading = useContext(LoadingContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [bookings, setBookings] = useState(null);
  const setPage = useContext(PageContext);
  const [ tb, setTb] = useState(false);

  useEffect(() => {
    const feachData = async () => {
      setIsLoading(true)
      try {
        const res = await API.get('user/view_bookings/')
        setBookings(res?.data?.Bookings)
      } catch (err) {
        // console.log(err?.response?.data)
        toast.error(err?.response?.data?.message)
      } finally {
        setIsLoading(false)
      }
    }
    feachData()
  }, [tb])

  const showConfirmAlert = (booking_id) => {
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
    <div>
      <div className="main_booking container-fluid">
        <span>Bookings</span>

        {
          bookings?.map((booking, index) => {
            return (
              <div className="col-lg-12 col-12 row booking_div" key={index}>
                <div className="col-lg-2 col-5">
                  <img src={booking?.worker_profile?.profile_picture? `${apiUrl}${booking?.worker_profile?.profile_picture}`:user_icone} alt="" />
                  <h5>{booking?.worker_profile?.full_name}</h5>
                  <p>₹ {booking?.total} </p>
                </div>
                <div className="col-lg-4 col-7">
                  <p>
                    <span>Current status : {booking?.status}</span><br />
                    <span>Total payment :  {booking?.total}</span><br />
                    <span>Pending payment : 100</span><br />
                    <span>Duration : {booking?.duration} Hours</span><br />
                    <span>Booked on : {booking?.booking_date} </span><br />
                    <span>Booked to : {booking?.booked_date} </span><br />
                  </p>
                  {booking?.status == 'created' && <button onClick={()=>showConfirmAlert(booking?.id)}>Cancel now</button>}
                </div>
                <div className="col-lg-3 col-6">
                  <ChatLeftDots />
                  <button onClick={()=>{setPage(`Booking_details/${booking?.id}`), localStorage.setItem('page',`Booking_details/${booking?.id}`)}} >View Details</button>
                </div>
                <div className="col-lg-3 col-6 last_part">
                  <div className="review_share">
                    {
                      /* <div className="stars">
                              <StarFill/>
                              <StarFill/>
                              <StarFill/>
                              <StarHalf/>
                              <Star/>
                      </div> */
                    }
                    <textarea name="review" id="" className='experience' placeholder='Write about your experince ....'></textarea>
                  </div>
                </div>
              </div>
            )
          })
        }


      </div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  )
}

export default Bookings
