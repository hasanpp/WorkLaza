/* eslint-disable no-unused-vars */
import './Bookings.css'
import { useEffect, useState, useContext } from 'react';
import { SearchContext } from '../Admin';
import API from '../../api';
import { toast } from 'sonner';
import { Modal, Button, Form } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons'

const Bookings = () => {
  const [bookings, setBookings] = useState();
  const [filteredBookings, setFilteredBookings] = useState([]);
  const { searchQuery } = useContext(SearchContext);
  const [sortedBookings, setSortedBookings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [tb_c, setTb_c] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get('admin_view/view_bookings/');
        setBookings(res?.data?.Bookings);
        setSortedBookings(res?.data?.Bookings);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
    fetchData();
  }, [tb_c]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...sortedBookings].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedBookings(sortedData);
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = sortedBookings?.filter(booking =>
        booking?.job_details?.job.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        booking?.worker_profile?.full_name.toLowerCase()?.includes(searchQuery?.toLowerCase()) || 
        booking?.user_profile?.username.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        booking?.status.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(sortedBookings);
    }
  }, [searchQuery, sortedBookings, tb_c]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, sortedBookings?.length);
  const paginatedBookings = filteredBookings?.slice(startIndex, endIndex);

  const handleTitleClick = (booking, index) => {
    setCurrentBooking({ ...booking, 'index': index });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false)
  };


  return (
    <div>
      <div className="top_row">
        <h1>Bookings</h1>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" onClick={() => handleSort('id')}>
                ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('user_profile.username')}>
                USER {sortConfig.key === 'user_profile.username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('worker_profile.full_name')}>
                WORKER {sortConfig.key === 'worker_profile.full_name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('ob_details.job')}>
                JOB TITLE {sortConfig.key === 'job_details.job' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('booking_date')}>
                CREATED AT {sortConfig.key === 'booking_date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('booked_date')}>
                BOOKED TO {sortConfig.key === 'booked_date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('status')}>
                STATUS {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings?.map((booking, index) => (
              <tr key={index} onClick={() => handleTitleClick(booking, index)}>
                <td>{booking?.id}</td>
                <td>{booking?.user_profile?.username}</td>
                <td>{booking?.worker_profile?.full_name}</td>
                <td>{booking?.job_details?.job} </td>
                <td>{booking?.booking_date} &nbsp;&nbsp;{booking?.booking_time}</td>
                <td>{booking?.booked_date}</td>
                <td><span className={`sp_status ${booking?.status}`}>{booking?.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>
          {startIndex + 1}-{endIndex} of {sortedBookings?.length}
        </span>&nbsp;&nbsp;&nbsp;
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='pagination-b'
        >
          &lt;
        </button>&nbsp;&nbsp;&nbsp;
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * rowsPerPage >= sortedBookings?.length}
          className='pagination-b'
        >
          &gt;
        </button>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>Inspect Booking</Modal.Title>
          <X style={{ fontSize: '40px', cursor: 'pointer' }} onClick={handleClose} />
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group style={{ display: 'flex', justifyContent:'space-between' }}>
              <Form.Group controlId="formUsername" style={{ width: '47%' }}>
                <Form.Label>User</Form.Label>
                <Form.Control type="text" value={currentBooking?.user_profile?.username} disabled={true} required />
              </Form.Group>
              <Form.Group controlId="formUsername" style={{ width: '47%' }}>
                <Form.Label>Worker</Form.Label>
                <Form.Control type="text" value={currentBooking?.worker_profile?.full_name} disabled={true} required />
              </Form.Group>
            </Form.Group>
            <Form.Group style={{ display: 'flex', justifyContent:'space-between' }}>
              <Form.Group controlId="formUsername" style={{ width: '47%' }}>
                <Form.Label>Job</Form.Label>
                <Form.Control type="text" value={currentBooking?.job_details?.job} disabled={true} required />
              </Form.Group>
              <Form.Group controlId="formUsername" style={{ width: '47%' }}>
                <Form.Label>Any previous issues</Form.Label>
                <Form.Control type="text" value={currentBooking?.any_previous_issues} disabled={true} required />
              </Form.Group>
            </Form.Group>
            <Form.Group style={{ display: 'flex', justifyContent:'space-between' }}>
              <Form.Group controlId="formUsername" style={{ width: '47%' }}>
                <Form.Label>Created on</Form.Label>
                <Form.Control type="text" value={currentBooking?.booking_date} disabled={true} required />
              </Form.Group>
              <Form.Group controlId="formUsername" style={{ width: '47%' }}>
                <Form.Label>Booked to</Form.Label>
                <Form.Control type="text" value={currentBooking?.booked_date} disabled={true} required />
              </Form.Group>
            </Form.Group>
            <Form.Group style={{ display: 'flex', justifyContent:'space-between' }}>
              <Form.Group controlId="formUsername" style={{ width: '30%' }}>
                <Form.Label>Damaged parts</Form.Label>
                <Form.Control type="text" value={currentBooking?.damaged_parts} disabled={true} required />
              </Form.Group>
              <Form.Group controlId="formUsername" style={{ width: '15%' }}>
                <Form.Label>Duration</Form.Label>
                <Form.Control type="text" value={currentBooking?.duration} disabled={true} required />
              </Form.Group>
              <Form.Group controlId="formUsername" style={{ width: '20%' }}>
                <Form.Label>Status</Form.Label>
                <Form.Control type="text" value={currentBooking?.status} disabled={true} required />
              </Form.Group>
              <Form.Group controlId="formUsername" style={{ width: '14%' }}>
                <Form.Label>Total</Form.Label>
                <Form.Control type="text" value={currentBooking?.total} disabled={true} required />
              </Form.Group>
            </Form.Group>
            <Form.Group controlId="formdeS">
              <Form.Label>Address</Form.Label>
              <Form.Control as="textarea" value={currentBooking?.address} rows={4} disabled={true} required style={{ height: '40px' }} />
            </Form.Group>
            <Form.Group style={{ display: 'flex', justifyContent:'space-between' }}>
              <Form.Group controlId="formdeS" style={{ width: '49%' }}>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" value={currentBooking?.details} rows={4} disabled={true} required style={{ height: '150px' }} />
              </Form.Group>
              {
                currentBooking?.photo && (
                  <Form.Group controlId="formdeS" style={{ width: '49%' }}>
                    <Form.Label>Photo</Form.Label>
                    <img src={`${apiUrl}${currentBooking?.photo}`} alt="" style={{width:'100%'}}/>
                  </Form.Group>
                )
              }
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>


    </div>
  )
}

export default Bookings
