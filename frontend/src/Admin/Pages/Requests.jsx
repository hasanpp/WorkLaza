import './Requests.css'
import { useState, useContext, useEffect } from 'react'
import { SearchContext } from '../Admin';
import API from '../../api';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CheckCircle, Ban } from 'react-bootstrap-icons';


const Requests = () => {

  const [workers, setWorkers] = useState();
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const { searchQuery } = useContext(SearchContext);
  const [sortedWorkers, setSortedWorkers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [tb_c, setTb_c] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(null);

  const process_request = async (id, index, accept) => {
    try {
      const response = await API.post(`admin_view/process_worker_request/`, { 'id': id, 'accept': accept });
      if (accept) {
        workers[index].is_verified = true

      } else {
        workers[index].is_verified = false
      }
      setTb_c(!tb_c)
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get('admin_view/view_requests/');
        console.log(res.data.workers);
        
        setWorkers(res.data.workers);
        setSortedWorkers(res.data.workers);
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
                <td>{worker.job}</td>
                <td>{worker.previous_company}</td>
                <td className="action-td">
                  <button onClick={()=>{process_request(worker.id,index,true)}}><CheckCircle color="green" size={11}/></button>
                  <button onClick={()=>{process_request(worker.id,index,false)}}><Ban color="red"/></button>
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
                <Form.Control type="text" value={currentWorker.job} readOnly={true}/>
              </Form.Group>
              <Form.Group controlId="formdeS">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" value={currentWorker.description} readOnly={true} rows={4}/>
              </Form.Group>
              <Form.Group controlId="formImages" style={{ width: '100%', height: 'auto', display:'flex', justifyContent:'space-between' }}>
                <Form.Group controlId="formCertificate" style={{ width: '48%', height: 'auto'}}>
                  <Form.Label>Certificate</Form.Label><br/>
                  <img  src={`http://localhost:8000${currentWorker.certificate}`}  alt="Worker"  style={{ width: '100%', height: 'auto',}}/>
                </Form.Group>
                <Form.Group controlId="formId_prof" style={{ width: '48%', height: 'auto'}}>
                  <Form.Label>Id proff</Form.Label><br/>
                  <img  src={`http://localhost:8000${currentWorker.id_prof}`}  alt="Worker" style={{ width: '100%', height: 'auto',}} />
                </Form.Group>
              </Form.Group>
              
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="success" onClick={() => process_request(currentWorker.id,currentWorker.index,true)}>Accept</Button>
          <Button variant="danger" onClick={() => process_request(currentWorker.id,currentWorker.index,false)}>Reject</Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default Requests
