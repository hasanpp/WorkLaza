/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from 'react';
import { toast } from 'sonner';
import search_i from '../../assets/Search.svg';
import user_icon from '../../assets/user.png';
import API from '../../api';
import './Workers.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { Postage, X } from 'react-bootstrap-icons';
import { LoadingContext } from '../../App';
import { PageContext } from '../../Layout/Layout';
import { useSelector } from "react-redux";
import secureRequest  from '../../Compenets/ProtectedRoute/secureRequest';
import axios from 'axios';

const Workers = () => {

  const { isAuthenticated } = useSelector((state) => state.auth)
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState('');
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(100000);
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const setIsLoading = useContext(LoadingContext);
  const setPage = useContext(PageContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const workersPerPage = 6;


  const getcords = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          },
          (error) => {
            toast.error("Error getting geolocation:", error);
            resolve({ latitude: 0, longitude: 0 });
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
        reject(new Error("Geolocation not supported"));
      }
    });
  };

  const saveWorker = async (worker_id)=>{
    if (!isAuthenticated){
        toast.warning("Please login to save a profile")
        return
    }
    try {
      await secureRequest(async () => {
        const res = await API.post("/user/save_worker/", { worker_id });
        toast.success(res?.data?.message);
    });
    } catch (err) {
        console.log("error",err.response.data)
        console.log("erooooooooor")
        toast.error(err?.response?.data?.message||"Something went wrong ")
    }
}

  useEffect(() => {
    const fetchWorkers = async () => {
      setIsLoading(true)
      try {
        const l_res = await getcords();
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/view_workers/`,{'longitude':l_res.longitude,'latitude':l_res.latitude});
        setWorkers(res?.data?.Workers);
        setFilteredWorkers(res?.data?.Workers);
      } catch (err) {
        console.log(err)
        toast.error(err?.response?.data?.message||"Something went wrong");
      }finally{
        setIsLoading(false)
      }
    };
    fetchWorkers();
  }, []);
  
  
  useEffect(() => {
    let tempWorkers = workers.filter(worker => 
      worker.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.job_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWorkers(tempWorkers);
  }, [searchQuery, workers]);

  
  useEffect(() => {
    applyFilter();
    let sortedWorkers = [...filteredWorkers];
    if (sortOption === 'salary-asc') {
      sortedWorkers.sort((a, b) => a.salary - b.salary);
    } else if (sortOption === 'salary-desc') {
      sortedWorkers.sort((a, b) => b.salary - a.salary);
    } else if (sortOption === 'experience-asc') {
      sortedWorkers.sort((a, b) => a.experience - b.experience);
    } else if (sortOption === 'experience-desc') {
      sortedWorkers.sort((a, b) => b.experience - a.experience);
    }
    setFilteredWorkers(sortedWorkers);
  }, [sortOption]);


 const applyFilter = () => {
    let tempWorkers = workers;
    if (selectedJob) {
      tempWorkers = tempWorkers.filter(worker => worker.job_title === selectedJob);
    }
    if (minSalary) {
      tempWorkers = tempWorkers.filter(worker => worker.salary >= minSalary);
    }
    if (maxSalary) {
      tempWorkers = tempWorkers.filter(worker => worker.salary <= maxSalary);
    }
    if (qualification) {
      tempWorkers = tempWorkers.filter(worker => worker.qualification === qualification);
    }
    if (experience) {
      tempWorkers = tempWorkers.filter(worker => worker.experience === experience);
    }

    if (selectedDate && selectedTime) {
      const selectedDay = new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' });
      
      tempWorkers = tempWorkers.filter(worker => 
        worker.availabilities.some(availability => 
          availability.day_of_week === selectedDay &&
          availability.is_active &&
          selectedTime >= availability.start_time &&
          selectedTime <= availability.end_time
        )
      );
    }

    setFilteredWorkers(tempWorkers);
    setShowFilterModal(false);
  };
  
  const indexOfLastWorker = currentPage * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(indexOfFirstWorker, indexOfLastWorker);
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

  return (
    <div className='main_workers_div'>
      <br /><br />
      <div className="container-fluid sub_workers_div">
        <br />
        <span className='page_name'>Workers</span>

        <div className="toprow row">
          <div className="flter">
            <button onClick={() => setShowFilterModal(true)}>Filter workers</button>
          </div>
          <div className="search">
            <input type="search" placeholder='Search for workers .....' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <span><img src={search_i} alt="Search" /></span>
          </div>
          <div className="sort">
            <select onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Sort by</option>
              <option value='salary-asc'>Salary: Low to High</option>
              <option value='salary-desc'>Salary: High to Low</option>
              <option value='experience-asc'>Experience: Low to High</option>
              <option value='experience-desc'>Experience: High to Low</option>
            </select>
          </div>
        </div>

        <div className="workers_dis">
          { currentWorkers ? currentWorkers.map(worker => (
            <div key={worker?.id} className="worker_card">
              <img src={worker?.profile_pic ? `${apiUrl}${worker?.profile_pic}` : user_icon} alt="Profile" />
              <h3>{worker?.full_name}</h3>
              <span>{worker?.job_title}</span>
              <h4>₹ {worker?.salary}/hour</h4>
              <p>{worker?.description?.slice(0, 65)}...</p>
              <div className="button_row">
                <button className='details_btn' onClick={()=>{setPage(`Worker_details/${worker?.id}`), localStorage.setItem('page',`Worker_details/${worker?.id}`)}}>View Details</button>
                <button className='Book_btn' onClick={()=>saveWorker(worker?.id)}>Save Profile</button>
              </div>
            </div>
          )) : <div><br /><br /><br /><span>There are no data to your requirment</span></div>}
        </div>

        <div className='pagination'>
          {currentPage>1&&<button className='pag_dec' onClick={() => setCurrentPage(currentPage - 1)} >{`<`}</button>}
          {[...Array(totalPages).keys()].map(num => (
            <button  key={num + 1}  className={currentPage === num + 1 ? 'active' : ''} onClick={() => setCurrentPage(num + 1)} >
              {num + 1}
            </button>
          ))}
          {currentPage<totalPages&&<button className='pag_aec' onClick={() => setCurrentPage(currentPage + 1)} >{`>`}</button>}
        </div>
      </div>


      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header>
          <Modal.Title>Filter Workers</Modal.Title>
          <X onClick={() => setShowFilterModal(false)} size={40} style={{cursor:'pointer'}}/>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Job Type</Form.Label>
              <Form.Control as="select" value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
                <option value="">All</option>
                {[...new Set(workers.map(worker => worker.job_title))].map(job => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Min Price</Form.Label>
              <Form.Control type='number' value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Max Price</Form.Label>
              <Form.Control type='number' value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Experience</Form.Label>
              <Form.Control type='number' value={experience} onChange={(e) => setExperience(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Qualification</Form.Label>
              <Form.Control as="select" value={qualification} onChange={(e) => setQualification(e.target.value)}>
                <option value="">All</option>
                {[...new Set(workers?.map(worker => worker?.qualification))].map(qualification => (
                  <option key={qualification} value={qualification}>{qualification}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Select Date</Form.Label>
              <Form.Control  type="date"  value={selectedDate}  onChange={(e) => setSelectedDate(e.target.value)}  />
            </Form.Group>
            <Form.Group>
              <Form.Label>Select Time</Form.Label>
              <Form.Control type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}  />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFilterModal(false)}>Close</Button>
          <Button variant="primary" onClick={applyFilter}>Apply</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Workers;