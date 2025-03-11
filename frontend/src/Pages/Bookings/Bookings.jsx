/* eslint-disable no-unused-vars */
import './Bookings.css';
import user_icone from '../../assets/user.png';
import { ChatLeftDots, X, StarFill, Star, StarHalf } from 'react-bootstrap-icons';
import { LoadingContext } from '../../App';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import API from '../../api';
import { PageContext } from '../../Layout/Layout';
import Swal from "sweetalert2";
import { Modal, Button } from 'react-bootstrap';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import secureRequest from '../../Compenets/ProtectedRoute/secureRequest';

const Bookings = () => {

  const setIsLoading = useContext(LoadingContext);
  const [bookings, setBookings] = useState(null);
  const setPage = useContext(PageContext);
  const [tb, setTb] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, title: 'Amazing experince' });
  const [hover, setHover] = useState(-1);

  useEffect(() => {
    const feachData = async () => {
      setIsLoading(true)
      try {
        const res = await API.patch('/user/bookings_view/')
        setBookings(res?.data?.Bookings)
      } catch (err) {
        toast.error(err?.response?.data?.message)
      } finally {
        setIsLoading(false)
      }
    }
    feachData()
  }, [tb])

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
      toast.error(err?.response?.data?.message);
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0; 
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFill key={`full-${i}`} />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} />);
    }
  
    return stars;
  };
  

  const showConfirmAlert = (booking_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Don't Cancel",
      confirmButtonText: "Yes, Cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        try {
          await secureRequest(async () => {
            const res = await API.delete(`/user/bookings_view/${booking_id}`)
            setTb(!tb)
            toast.success(res?.data?.message);
          });
        } catch (err) {
          toast.error(err?.response?.data?.message)
        } finally {
          setIsLoading(false)
        }
      }
    });
  };

  const handleChatOpen = (workerId, bookingId) => {
    setPage(`Chat`); 
    localStorage.setItem('page', `Chat`);
    localStorage.setItem("chatWorkerId", workerId); 
    localStorage.setItem("bookingId", bookingId);
  };

  return (
    <div>
      <div className="main_booking container-fluid">
        <span>Bookings</span>

        {bookings?.length > 0 ?
          bookings?.map((booking, index) => {
            return (
              <div className="col-lg-12 col-12 row booking_div" key={index}>
                <div className="col-lg-2 col-5">
                  <img src={booking?.worker_profile?.profile_picture ? `${booking?.worker_profile?.profile_picture}` : user_icone} alt="" />
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
                  {booking?.status == 'created' && <button onClick={() => showConfirmAlert(booking?.id)}>Cancel now</button>}
                </div>
                <div className="col-lg-3 col-6">
                  <ChatLeftDots onClick={()=>handleChatOpen(booking?.worker_profile?.id,booking?.id)}/>
                  <button onClick={() => { setPage(`Booking_details/${booking?.id}`), localStorage.setItem('page', `Booking_details/${booking?.id}`) }} >View Details</button>
                </div>
                <div className="col-lg-3 col-6 last_part">
                  {
                    booking?.status == 'completed' && (

                      booking?.review_details ?
                        <div className="testimonial-box">
                          <div className="stars">{renderStars(booking?.review_details?.rating)}</div>
                          <br />
                          <p className="review-text">{booking?.review_details?.description}</p>
                        </div>
                        :
                        <div className="review_share">
                          <textarea name="review" id="" className='experience' placeholder='Write about your experince ....' onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                          <button className="btn btn-primary" onClick={() => { setFormData({ ...formData, id: booking?.id }), setShowModal(true); }} style={{ width: '100px', margin: '10%', padding: '0%' }}>Post Review</button>
                        </div>
                    )

                  }
                </div>

              </div>
            )
          })
          :
          <><div><br /><br /><br /><span style={{color:"#fff", textAlign:"center", fontSize:"20px"}}>{`You don't have any bookings..`}</span></div></>
        }
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
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  )
}

export default Bookings
