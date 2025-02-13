/* eslint-disable no-unused-vars */
import './Requests.css'
import { useState, useContext, useEffect } from 'react'
import { SearchContext } from '../Admin';
import API from '../../api';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CheckCircle, Ban } from 'react-bootstrap-icons';
import { LoadingContext } from '../../App';

const Requests = () => {

  const [workers, setWorkers] = useState();
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const { searchQuery } = useContext(SearchContext);
  const [sortedWorkers, setSortedWorkers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [reason, setReason] = useState('Id proof is not valid');
  const [reqWorker, setReqWorker] = useState({id:null,index:null,accept:false});
  const rowsPerPage = 10;
  const [tb_c, setTb_c] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReson, setShowReson] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [jobs, setJobs] = useState();
  const setIsLoading = useContext(LoadingContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const process_request = async (id, index, accept) => {
    if (!accept&&!reason.trim()) {
      toast.warning('Please give a reason for rejecting the request')
      return
    }
    setShowModal(false)
    setShowReson(false)
    setIsLoading(true)
    try {
      const response = await API.post(`admin_view/process_worker_request/`, { 'id': id, 'accept': accept, 'reason': reason });
      if (accept) {
        toast.success('Request rejected')
      } else {
        setReason('Id proof is not valid')
      }
      setTb_c(!tb_c)
      toast.success(response?.data?.message);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get('admin_view/view_requests/');
        const j_res = await API.get('admin_view/view_jobs/');
        setWorkers(res?.data?.workers);
        setJobs(j_res?.data?.Jobs)
        setSortedWorkers(res?.data?.workers);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    fetchData();
  }, [tb_c]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...sortedWorkers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedWorkers(sortedData);
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = sortedWorkers.filter(worker =>
        worker.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.job.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.qualification.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers(sortedWorkers);
    }
  }, [searchQuery, sortedWorkers]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(currentPage * rowsPerPage, sortedWorkers.length);
  const paginatedWorkers = filteredWorkers.slice(startIndex, endIndex);

  const handleFullnameClick = (worker,index) => {
    setCurrentWorker({...worker,'index':index});
    setShowModal(true);
  };

  const handleClose = () => {
    setShowReson(false);
    setShowModal(false);
  };

  return (
    <div>
      <div className="top_row">
        <h1>Requests</h1>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" onClick={() => handleSort('id')}>
                ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('fullname')}>
                FULL NAME {sortConfig.key === 'fullname' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('age')}>
                AGE {sortConfig.key === 'age' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('salary')}>
                SALARY {sortConfig.key === 'salary' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('qualification')}>
                QUALIFICATION {sortConfig.key === 'qualification' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('experience')}>
                EXPERIENCE {sortConfig.key === 'experience' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('job')}>
                JOB {sortConfig.key === 'job' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" onClick={() => handleSort('previous_company')}>
                PREVIOUS COMPANY {sortConfig.key === 'previous_company' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th scope="col" className="action-th">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedWorkers.map((worker, index) => (
              <tr key={index}>
                <td>{worker.id}</td>
                <td onClick={() => handleFullnameClick(worker,index)}>
                  {worker.full_name}
                </td>
                <td>{worker.age}</td>
                <td>{worker.salary}</td>
                <td>{worker.qualification}</td>
                <td>{worker.experience}</td>
                <td>
                  {
                    jobs?.map((job) => {
                      return (job?.id == worker?.job && job.title)
                    })
                  }
                </td>
                <td>{worker.previous_company}</td>
                <td className="action-td">
                  <button onClick={()=>{process_request(worker.id,index,true)}}><CheckCircle color="green" size={11}/></button>
                   <button onClick={()=>{ setReqWorker({id:worker.id,index:worker.id,accept:false}), setShowReson(true)}}><Ban color="red"/></button> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>
          {startIndex + 1}-{endIndex} of {sortedWorkers.length}
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
          disabled={currentPage * rowsPerPage >= sortedWorkers.length}
          className='pagination-b'
        >
          &gt;
        </button>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>{currentWorker&&currentWorker.full_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentWorker && (
            <Form>
              <Form.Group controlId="formSalary">
                <Form.Label>Salary</Form.Label>
                <Form.Control type="text" value={currentWorker.salary} readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formQualification">
                <Form.Label>Qualification</Form.Label>
                <Form.Control type="text" value={currentWorker.qualification} readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formExperience">
                <Form.Label>Experience</Form.Label>
                <Form.Control type="text" value={currentWorker.experience} readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formJob">
                <Form.Label>Job</Form.Label>
                <Form.Control type="text" value={ jobs?.map((job) => { return (job?.id == currentWorker?.job && job.title) }) } readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formdeS">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" value={currentWorker.description} readOnly={true} rows={4}/>
              </Form.Group>
              <Form.Group controlId="formImages" style={{ width: '100%', height: 'auto', display:'flex', justifyContent:'space-between' }}>
                <Form.Group controlId="formCertificate" style={{ width: '48%', height: 'auto'}}>
                  <Form.Label>Certificate</Form.Label><br/>
                  <img  src={`${apiUrl}${currentWorker.certificate}`}  alt="Worker"  style={{ width: '100%', height: 'auto',}}/>
                </Form.Group>
                <Form.Group controlId="formId_prof" style={{ width: '48%', height: 'auto'}}>
                  <Form.Label>Id proff</Form.Label><br/>
                  <img  src={`${apiUrl}${currentWorker.id_prof}`}  alt="Worker" style={{ width: '100%', height: 'auto',}} />
                </Form.Group>
              </Form.Group>
              
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="success" onClick={() => process_request(currentWorker.id,currentWorker.index,true)}>Accept</Button>
          <Button variant="danger" onClick={() =>{ setReqWorker({id:currentWorker.id,index:currentWorker.index,accept:false}), setShowReson(true)}}>Reject</Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showReson} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>Provide Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Reason</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={()=>process_request(reqWorker.id, reqWorker.index, reqWorker.accept) }>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default Requests
