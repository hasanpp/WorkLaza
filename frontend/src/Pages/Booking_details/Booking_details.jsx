/* eslint-disable no-unused-vars */
import './Booking_details.css'
import PropTypes from 'prop-types';
import API from '../../api';
import { useEffect,useContext,useState } from 'react';
import { LoadingContext } from '../../App';
import { toast } from 'sonner';
import user_icone from '../../assets/user.png';
import Swal from "sweetalert2";
import { Modal, Button } from 'react-bootstrap';
import { ChatLeftDots, Star, X } from 'react-bootstrap-icons';
import secureRequest from '../../Compenets/ProtectedRoute/secureRequest';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import { PageContext } from '../../Layout/Layout';

const Booking_details = ({ booking_id }) => {

  const [booking, setBooking] = useState();
  const setIsLoading = useContext(LoadingContext);
  const [ tb, setTb] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hover, setHover] = useState(-1);
  const [formData, setFormData] = useState({ rating: 5, title: 'Amazing experince' });
  const setPage = useContext(PageContext);

  useEffect(()=>{
    const featchData = async() =>{
      setIsLoading(true)
      try {
        const res = await API.get(`/user/bookings_view/${booking_id}`)
        
        console.log(res?.data?.Booking);
        setBooking(res?.data?.Booking)
      } catch (err) {
        err?.response?.data?.message && toast.error(err?.response?.data?.message)
      } finally {
        setIsLoading(false)
      }
    }
    featchData();
  },[tb])

  const handlePostReview = async () => {
    setIsLoading(true);
    try {
      await secureRequest(async () => {
        const res = await API.put('/user/bookings_view/', formData);
        toast.success(res?.data?.message);
        setShowModal(false);
        setTb(!tb);
      });
    } catch (err) {
      err?.response?.data?.message && toast.error(err?.response?.data?.message)
    } finally {
      setIsLoading(false);
    }
  };

  const labels = {
      0.5: 'Useless',
      1: 'Useless+',
      1.5: 'Poor',
      2: 'Poor+',
      2.5: 'Ok',
      3: 'Ok+',
      3.5: 'Good',
      4: 'Good+',
      4.5: 'Excellent',
      5: 'Excellent+',
    };
  
    function getLabelText(value) {
      return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
    }
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
          await secureRequest(async () => {
            const res =  await API.delete(`/user/bookings_view/${booking_id}`)
            setTb(!tb)
            toast.success(res?.data?.message);
          });
        } catch (err) {
          err?.response?.data?.message && toast.error(err?.response?.data?.message)
        }finally {
          setIsLoading(false)
        }
      }
    });
  };
   
  const handleChatOpen = (chatReceiverId, bookingId) => {
    setPage(`Chat`); 
    localStorage.setItem('page', `Chat`);
    localStorage.setItem("chatReceiverId", chatReceiverId); 
    localStorage.setItem("bookingId", bookingId);
  };

  return (
    <div className='booking_details_main'>
      <span>Booking/Booking details</span>
      <br /><br />
      <div className="details col-12 clo-lg-12">
        <div className="row">
          <img src={booking?.worker_profile?.profile_picture ? `${booking?.worker_profile?.profile_picture}`: user_icone } alt="" />
          <h3>{booking?.worker_profile?.full_name}</h3>
          <h3>₹ {booking?.total}</h3>
          <ChatLeftDots onClick={()=>handleChatOpen(booking?.worker_profile?.user_id,booking?.id)} />
          <div className={`status ${booking?.status}`}>{booking?.status}</div>
        </div>
        <hr />
        <div className="bootam_part">
          <div className="left col-12 col-lg-6">
            <img src={`${booking?.photo}`} alt="" />
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
            {(booking?.status == 'completed' && !booking?.review_details ) ? <button onClick={() => { setFormData({ ...formData, id: booking?.id }), setShowModal(true); }} >Post your review</button> : <></>}
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Post Your Review</Modal.Title>
            < X onClick={() => setShowModal(false)} style={{ fontSize: '30px', cursor: 'pointer' }} />
          </Modal.Header>
          <Modal.Body>
            {/* <div className="mt-3">
              <label>Rating</label>
              <select className="form-control" value={formData?.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} >
                {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(rating => (<option key={rating} value={rating}>{rating}</option>))}
              </select>
            </div> */}
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent:'space-between' }}>
              <Rating  name="hover-feedback" value={formData?.rating} precision={0.5} getLabelText={getLabelText} 
                onChange={(event, newValue) => { setFormData({ ...formData, rating: newValue})}} 
                onChangeActive={(event, newHover) => {  setHover(newHover); }}
                // icon={<StarFill style={{ color: 'var(--icon-color)' }} fontSize="inherit" />}
                emptyIcon={<Star style={{ opacity: 0.55, color: 'var(--icon-color)' }} fontSize="inherit" />}
                // halfIcon={<StarHalf style={{ opacity: 0.55, color: 'var(--icon-color)' }} fontSize="inherit" />}
                style={{ width: '50%', justifyContent: 'space-around' }}
              />
              {formData?.rating !== null && ( <Box sx={{ ml: 2 }} style={{width:'50%'}}>{labels[hover !== -1 ? hover : formData.target?.rating]}</Box> )}
            </Box>
            <label>Review title</label>
            <input type="text" className='form-control review_title' value={formData?.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder='Give a title to your review' />
            <label>Review Description</label>
            <textarea className="form-control" rows="5" value={formData?.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Write your review..." />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handlePostReview}>
              Post Review
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default Booking_details




Booking_details.propTypes = {
    booking_id: PropTypes.string.isRequired,
};
